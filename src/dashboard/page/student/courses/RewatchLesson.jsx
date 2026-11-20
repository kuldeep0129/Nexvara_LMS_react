
import React, {
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";

import { useParams, useSearchParams } from "react-router-dom";

import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  BookOpen,
  Clock,
  Loader2,
  AlertCircle,
  Settings2,
  CheckCircle2
} from "lucide-react";

import { batchService } from "../../../services/teacher/batchService";

// ======================================================
// YOUTUBE API LOADER
// ======================================================

let youtubeApiPromise = null;

const loadYouTubeApi = () => {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      try {
        previousCallback?.();
      } catch (error) {
        console.error("Previous YouTube callback error:", error);
      }

      if (window.YT?.Player) {
        resolve(window.YT);
      } else {
        youtubeApiPromise = null;
        reject(new Error("YouTube Player API unavailable."));
      }
    };

    let script = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;

      script.onerror = () => {
        youtubeApiPromise = null;
        reject(new Error("Unable to load YouTube Player API."));
      };

      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
};

// ======================================================
// HELPERS
// ======================================================

const isValidYouTubeId = (value) =>
  /^[a-zA-Z0-9_-]{11}$/.test(String(value || "").trim());

const extractYouTubeId = (value) => {
  if (!value) return "";

  const input = String(value).trim();

  if (isValidYouTubeId(input)) return input;

  try {
    const parsedUrl = new URL(
      input.startsWith("http") ? input : `https://${input}`
    );

    const hostname = parsedUrl.hostname.toLowerCase();

    if (
      hostname === "youtu.be" ||
      hostname.endsWith(".youtu.be")
    ) {
      const id = parsedUrl.pathname.split("/").filter(Boolean)[0] || "";
      return isValidYouTubeId(id) ? id : "";
    }

    if (
      hostname === "youtube.com" ||
      hostname.endsWith(".youtube.com") ||
      hostname === "youtube-nocookie.com" ||
      hostname.endsWith(".youtube-nocookie.com")
    ) {
      if (parsedUrl.pathname === "/watch") {
        const id = parsedUrl.searchParams.get("v") || "";
        return isValidYouTubeId(id) ? id : "";
      }

      const parts = parsedUrl.pathname.split("/").filter(Boolean);

      if (["embed", "shorts", "live"].includes(parts[0])) {
        const id = parts[1] || "";
        return isValidYouTubeId(id) ? id : "";
      }
    }

    return "";
  } catch {
    return "";
  }
};

const getDatabaseVideoId = (video) => {
  const candidates = [
    video.videoId,
    video.VideoId,
    video.id,
    video.Id,
    video.videoRecordId,
    video.VideoRecordId,
    video.courseVideoRecordId,
    video.CourseVideoRecordId,
    video.courseVideoId,
    video.CourseVideoId
  ];

  for (const candidate of candidates) {
    if (
      candidate !== null &&
      candidate !== undefined &&
      String(candidate).trim() !== ""
    ) {
      const parsed = Number(candidate);

      if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  return 0;
};

const getYouTubeSource = (video) =>
  video.videourl ||
  video.VideoUrl ||
  video.videoUrl ||
  video.Videourl ||
  video.youtubeVideoId ||
  video.YouTubeVideoId ||
  "";

const getVideoList = (response) => {
  const result =
    response?.data?.data ??
    response?.data ??
    response;

  const videoList = Array.isArray(result)
    ? result
    : result?.videoDetails ??
      result?.VideoDetails ??
      result?.items ??
      result?.Items ??
      result?.videos ??
      result?.Videos ??
      [];

  return { result, videoList };
};

const formatTime = (seconds) => {
  const value = Number(seconds);

  if (!Number.isFinite(value) || value < 0) return "0:00";

  const total = Math.floor(value);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const getApiErrorMessage = (error) => {
  const status =
    error?.response?.status ??
    error?.status ??
    error?.response?.statusCode;

  if (status === 401) {
    return "Your session has expired or your login token is missing. Please log in again.";
  }

  if (status === 403) {
    return "You do not have permission to access these course videos.";
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.Message ||
    error?.message ||
    "Failed to load course videos."
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function SecureVideoPlayer({ batchId: propBatchId }) {
  const { batchId: routeBatchId } = useParams();
  const [searchParams] = useSearchParams();

  const batchId = propBatchId ?? routeBatchId;
  const mode = searchParams.get("mode") || "enter";
  const isRewatchMode = mode.toLowerCase() === "rewatch";

  // ----------------------------------------------------
  // STATE
  // ----------------------------------------------------

  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [error, setError] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const [sessionReady, setSessionReady] = useState(false);

  // ----------------------------------------------------
  // REFS
  // ----------------------------------------------------

  const playerRef = useRef(null);
  const youtubeWrapperRef = useRef(null);
  const playerReadyRef = useRef(false);

  const activeVideoRef = useRef(null);
  const videosRef = useRef([]);

  const playerShellRef = useRef(null);
  const timerRef = useRef(null);

  const sessionIdRef = useRef(null);
  const sessionVideoIdRef = useRef(null);
  const sessionStartVideoIdRef = useRef(null);

  const progressSaveTimerRef = useRef(null);
  const lastSavedPositionRef = useRef(0);

  const isSessionPlayingRef = useRef(false);
  const progressRequestRef = useRef(false);

  const sessionReadyRef = useRef(false);
  const switchingVideoRef = useRef(false);
  const componentMountedRef = useRef(true);

  // ----------------------------------------------------
  // SYNC REFS
  // ----------------------------------------------------

  useEffect(() => {
    activeVideoRef.current = activeVideo;
  }, [activeVideo]);

  useEffect(() => {
    videosRef.current = videos;
  }, [videos]);

  // ----------------------------------------------------
  // PROGRESS RESPONSE HELPERS
  // ----------------------------------------------------

  const getProgressResponseData = (response) =>
    response?.data?.data ?? response?.data ?? response;

  const getSessionIdFromResponse = (response) => {
    const data = getProgressResponseData(response);

    return data?.sessionId ?? data?.SessionId ?? null;
  };

  const getPositionFromResponse = (response) => {
    const data = getProgressResponseData(response);

    return Math.max(
      0,
      Number(
        data?.lastPositionSeconds ??
        data?.LastPositionSeconds ??
        data?.watchedSeconds ??
        data?.WatchedSeconds ??
        0
      )
    );
  };

  const getPercentageFromResponse = (response) => {
    const data = getProgressResponseData(response);

    return Math.min(
      100,
      Math.max(
        0,
        Number(
          data?.completionPercentage ??
          data?.CompletionPercentage ??
          0
        )
      )
    );
  };

  const createEventId = () => {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      (character) => {
        const random = Math.random() * 16 | 0;

        return (
          character === "x"
            ? random
            : (random & 0x3) | 0x8
        ).toString(16);
      }
    );
  };

  // ----------------------------------------------------
  // SAVE CURRENT VIDEO PROGRESS
  // ----------------------------------------------------

  const saveCurrentProgress = async (
    eventType = "Checkpoint",
    playing = isSessionPlayingRef.current,
    stopReason = null
  ) => {
    const sessionId = sessionIdRef.current;
    const video = activeVideoRef.current;

    if (!sessionId || !video?.id) return;

    if (progressRequestRef.current) return;

    let position = lastSavedPositionRef.current;

    try {
      const player = playerRef.current;

      if (
        playerReadyRef.current &&
        player &&
        typeof player.getCurrentTime === "function"
      ) {
        const currentPosition = player.getCurrentTime();

        if (Number.isFinite(currentPosition)) {
          position = Math.floor(currentPosition);
        }
      }
    } catch {
      // Keep the last known position.
    }

    position = Math.max(0, position);

    const payload = {
      eventId: createEventId(),
      sessionId,
      videoId: Number(video.id),
      positionSeconds: position,
      eventType,
      isPlaying: playing,
      occurredAt: new Date().toISOString(),
      stopReason
    };

    progressRequestRef.current = true;

    try {
      await batchService.saveVideoProgress(payload);

      lastSavedPositionRef.current = position;

      if (!componentMountedRef.current) return;

      setVideos((previousVideos) =>
        previousVideos.map((item) =>
          item.id === video.id
            ? {
                ...item,
                watchedSeconds: position
              }
            : item
        )
      );

      setActiveVideo((previous) =>
        previous?.id === video.id
          ? {
              ...previous,
              watchedSeconds: position
            }
          : previous
      );

    } catch (error) {
      console.error("[VideoProgress] Save failed:", error);
    } finally {
      progressRequestRef.current = false;
    }
  };

  // ----------------------------------------------------
  // CLOSE CURRENT VIDEO SESSION
  // ----------------------------------------------------

  const closeCurrentVideoSession = async (
    reason = "UserClosed"
  ) => {
    const sessionId = sessionIdRef.current;

    if (!sessionId) return;

    if (progressSaveTimerRef.current) {
      clearInterval(progressSaveTimerRef.current);
      progressSaveTimerRef.current = null;
    }

    // Wait for an existing progress request.
    while (progressRequestRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    let eventType = "PageHidden";

    if (reason === "Completed") {
      eventType = "Ended";
    } else if (reason === "LessonChanged") {
      eventType = "Paused";
    }

    await saveCurrentProgress(
      eventType,
      false,
      reason
    );

    try {
      await batchService.endVideoSession(
        sessionId,
        reason
      );
    } catch (error) {
      console.error("[VideoProgress] End session failed:", error);
    }

    if (sessionIdRef.current === sessionId) {
      sessionIdRef.current = null;
      sessionVideoIdRef.current = null;
      sessionStartVideoIdRef.current = null;
    }

    isSessionPlayingRef.current = false;
    sessionReadyRef.current = false;

    if (componentMountedRef.current) {
      setSessionReady(false);
    }
  };

  // ----------------------------------------------------
  // START SESSION FOR SELECTED VIDEO
  // ----------------------------------------------------

  const startSelectedVideoSession = async (video) => {
    if (!video?.id) return;

    if (sessionStartVideoIdRef.current === video.id) {
      return;
    }

    // Do not start a second session while another is active.
    if (sessionIdRef.current) {
      await closeCurrentVideoSession("LessonChanged");
    }

    sessionStartVideoIdRef.current = video.id;

    sessionReadyRef.current = false;
    setSessionReady(false);

    let resumePosition = Math.max(
      0,
      Number(video.watchedSeconds || 0)
    );

    try {
      const progressResponse =
        await batchService.getVideoProgress(video.id);

      resumePosition = getPositionFromResponse(progressResponse);

      const percentage = getPercentageFromResponse(
        progressResponse
      );

      if (componentMountedRef.current) {
        setVideos((previousVideos) =>
          previousVideos.map((item) =>
            item.id === video.id
              ? {
                  ...item,
                  watchedSeconds: resumePosition,
                  progressPercentage: percentage
                }
              : item
          )
        );
      }
    } catch (error) {
      console.warn(
        "[VideoProgress] Could not fetch saved position:",
        error
      );
    }

    if (!componentMountedRef.current) return;

    if (activeVideoRef.current?.id !== video.id) {
      sessionStartVideoIdRef.current = null;
      return;
    }

    lastSavedPositionRef.current = resumePosition;

    setActiveVideo((previous) =>
      previous?.id === video.id
        ? {
            ...previous,
            watchedSeconds: resumePosition
          }
        : previous
    );

    setCurrentTime(resumePosition);

    // Correct YouTube resume position.
    try {
      const player = playerRef.current;

      if (
        playerReadyRef.current &&
        player &&
        typeof player.cueVideoById === "function"
      ) {
        player.cueVideoById({
          videoId: video.youtubeId,
          startSeconds: resumePosition
        });
      }
    } catch (error) {
      console.warn("[VideoProgress] Resume error:", error);
    }

    try {
      const sessionResponse =
        await batchService.startVideoSession(video.id);

      const sessionId =
        getSessionIdFromResponse(sessionResponse);

      if (!sessionId) {
        throw new Error("Session ID was not returned by server.");
      }

      if (
        !componentMountedRef.current ||
        activeVideoRef.current?.id !== video.id
      ) {
        await batchService.endVideoSession(
          sessionId,
          "LessonChanged"
        );

        sessionStartVideoIdRef.current = null;
        return;
      }

      sessionIdRef.current = sessionId;
      sessionVideoIdRef.current = video.id;

      sessionReadyRef.current = true;
      setSessionReady(true);

      console.log("[VideoProgress] Session started:", sessionId);

      // Handle playback that started before session creation.
      let currentlyPlaying = false;

      try {
        const player = playerRef.current;

        currentlyPlaying =
          playerReadyRef.current &&
          player &&
          window.YT &&
          player.getPlayerState() === window.YT.PlayerState.PLAYING;
      } catch {
        currentlyPlaying = false;
      }

      isSessionPlayingRef.current = currentlyPlaying;

      if (currentlyPlaying) {
        setIsPlaying(true);

        await saveCurrentProgress("Checkpoint", true);
      }

    } catch (error) {
      sessionStartVideoIdRef.current = null;

      sessionReadyRef.current = false;
      setSessionReady(false);

      console.error(
        "[VideoProgress] Session start failed:",
        error
      );
    }
  };

  // ----------------------------------------------------
  // FETCH VIDEOS
  // ----------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const fetchVideos = async () => {
      if (!batchId || batchId === "undefined") {
        setError("Batch ID is missing from the classroom URL.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response =
          await batchService.getStudentCourseVideos(batchId);

        if (!isMounted) return;

        const { result, videoList } = getVideoList(response);

        if (!Array.isArray(videoList)) {
          throw new Error("Invalid video response received from server.");
        }

        const formattedVideos = videoList.map((video, index) => {
          const databaseId = getDatabaseVideoId(video);

          const videoUrl = getYouTubeSource(video);
          const youtubeId = extractYouTubeId(videoUrl);

          return {
            id: databaseId,

            batchId: Number(
              video.batchId ?? video.BatchId ?? batchId
            ),

            batchName:
              video.batchName ??
              video.BatchName ??
              "",

            courseId: Number(
              video.courseId ??
              video.CourseId ??
              0
            ),

            courseName:
              video.courseName ??
              video.CourseName ??
              "",

            title:
              video.videoTitle ??
              video.VideoTitle ??
              video.title ??
              video.Title ??
              `Lesson ${index + 1}`,

            description:
              video.videoDescription ??
              video.VideoDescription ??
              video.description ??
              video.Description ??
              "",

            sequence: Number(
              video.sequence ??
              video.Sequence ??
              video.displayOrder ??
              video.DisplayOrder ??
              index + 1
            ),

            videoUrl,
            youtubeId,

            durationInSeconds: Number(
              video.durationSeconds ??
              video.DurationSeconds ??
              video.durationInSeconds ??
              video.DurationInSeconds ??
              0
            ),

            watchedSeconds: Number(
              video.watchedSeconds ??
              video.WatchedSeconds ??
              0
            ),

            progressPercentage: Number(
              video.progressPercentage ??
              video.ProgressPercentage ??
              0
            )
          };
        });

        const validVideos = formattedVideos
          .filter(
            (video) =>
              video.id > 0 &&
              Boolean(video.youtubeId)
          )
          .sort((a, b) => a.sequence - b.sequence);

        if (formattedVideos.length > 0 && validVideos.length === 0) {
          throw new Error(
            "Videos were received, but a valid database video ID or YouTube ID is missing. Check the API response fields."
          );
        }

        if (!isMounted) return;

        if (validVideos.length === 0) {
          setVideos([]);
          setActiveVideo(null);
          setError("");
          return;
        }

        setVideos(validVideos);

        const backendCurrentId = Number(
          result?.currentVideoId ??
          result?.CurrentVideoId ??
          0
        );

        const selectedVideo =
          validVideos.find(
            (video) => video.id === backendCurrentId
          ) ??
          validVideos.find(
            (video) => video.progressPercentage < 100
          ) ??
          validVideos[0];

        console.log(
          "[SecureVideoPlayer] Selected video:",
          selectedVideo
        );

        activeVideoRef.current = selectedVideo;
        setActiveVideo(selectedVideo);

      } catch (err) {
        console.error("[SecureVideoPlayer] Fetch error:", err);

        if (isMounted) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchVideos();

    return () => {
      isMounted = false;
    };
  }, [batchId, mode]);

  // ----------------------------------------------------
  // START SESSION WHEN LESSON CHANGES
  // ----------------------------------------------------

  useEffect(() => {
    if (!activeVideo?.id) return;

    startSelectedVideoSession(activeVideo);
  }, [activeVideo?.id]);

  // ----------------------------------------------------
  // AUTO SAVE EVERY 12 SECONDS
  // ----------------------------------------------------

  useEffect(() => {
    if (
      !isPlaying ||
      !sessionReady ||
      !sessionIdRef.current
    ) {
      return;
    }

    progressSaveTimerRef.current = setInterval(() => {
      saveCurrentProgress("Checkpoint", true);
    }, 12000);

    return () => {
      if (progressSaveTimerRef.current) {
        clearInterval(progressSaveTimerRef.current);
        progressSaveTimerRef.current = null;
      }
    };
  }, [isPlaying, sessionReady, activeVideo?.id]);

  // ----------------------------------------------------
  // SAVE WHEN TAB BECOMES HIDDEN
  // ----------------------------------------------------

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (sessionIdRef.current) {
          saveCurrentProgress(
            "PageHidden",
            false,
            "PageHidden"
          );
        }
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // ----------------------------------------------------
  // INITIALIZE YOUTUBE PLAYER
  // ----------------------------------------------------

  useEffect(() => {
    let mounted = true;
    let localPlayer = null;
    let localTimer = null;
    let readyTimeout = null;

    const initializePlayer = async () => {
      try {
        const YT = await loadYouTubeApi();

        if (
          !mounted ||
          isLoading ||
          !activeVideoRef.current ||
          !youtubeWrapperRef.current
        ) {
          return;
        }

        const youtubeHost = document.createElement("div");

        youtubeHost.style.width = "100%";
        youtubeHost.style.height = "100%";

        youtubeWrapperRef.current.replaceChildren(youtubeHost);

        readyTimeout = setTimeout(() => {
          if (!mounted || playerReadyRef.current) return;

          setPlayerLoading(false);
          setError(
            "YouTube player initialization timed out. Please check your internet connection."
          );
        }, 20000);

        localPlayer = new YT.Player(youtubeHost, {
          width: "100%",
          height: "100%",

          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            fs: 0,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },

          events: {
            onReady: (event) => {
              if (!mounted) return;

              clearTimeout(readyTimeout);

              playerRef.current = event.target;
              playerReadyRef.current = true;

              const player = event.target;
              const currentVideo = activeVideoRef.current;

              if (currentVideo?.youtubeId) {
                player.cueVideoById({
                  videoId: currentVideo.youtubeId,
                  startSeconds: Math.max(
                    0,
                    currentVideo.watchedSeconds || 0
                  )
                });
              }

              try {
                player.setVolume(isMuted ? 0 : volume * 100);
                player.setPlaybackRate(playbackSpeed);

                if (isMuted) {
                  player.mute();
                }
              } catch (error) {
                console.warn("Player settings error:", error);
              }

              setPlayerLoading(false);

              localTimer = setInterval(() => {
                if (!mounted || !playerReadyRef.current) return;

                try {
                  const time = player.getCurrentTime();
                  const total = player.getDuration();

                  if (Number.isFinite(time)) {
                    setCurrentTime(Math.floor(time));
                  }

                  if (Number.isFinite(total) && total > 0) {
                    setDuration(Math.floor(total));
                  }
                } catch {
                  // Player may be changing state.
                }
              }, 1000);

              timerRef.current = localTimer;
            },

            onStateChange: (event) => {
              if (!mounted) return;

              if (event.data === YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setPlayerLoading(false);

                isSessionPlayingRef.current = true;

                if (
                  sessionReadyRef.current &&
                  sessionIdRef.current
                ) {
                  saveCurrentProgress("Checkpoint", true);
                }

              } else if (event.data === YT.PlayerState.PAUSED) {
                setIsPlaying(false);

                isSessionPlayingRef.current = false;

                if (sessionIdRef.current) {
                  saveCurrentProgress("Paused", false);
                }

              } else if (event.data === YT.PlayerState.ENDED) {
                setIsPlaying(false);

                isSessionPlayingRef.current = false;

                const current = activeVideoRef.current;

                const currentIndex = videosRef.current.findIndex(
                  (video) => video.id === current?.id
                );

                const nextVideo = videosRef.current[currentIndex + 1];

                (async () => {
                  await closeCurrentVideoSession("Completed");

                  if (nextVideo && mounted) {
                    selectVideo(nextVideo);
                  }
                })();

              } else if (event.data === YT.PlayerState.BUFFERING) {
                setPlayerLoading(true);

              } else if (event.data === YT.PlayerState.CUED) {
                setPlayerLoading(false);
                setIsPlaying(false);
              }
            },

            onError: (event) => {
              if (!mounted) return;

              const messages = {
                2: "Invalid YouTube video ID.",
                5: "YouTube HTML5 player error.",
                100: "Video not found or private.",
                101: "Video owner has disabled embedding.",
                150: "Video owner has disabled embedding.",
                153: "YouTube could not identify the request. Check browser privacy settings."
              };

              setPlayerLoading(false);

              setError(
                messages[event.data] ||
                `YouTube player error: ${event.data}`
              );
            }
          }
        });

        playerRef.current = localPlayer;

      } catch (err) {
        console.error("YouTube initialization error:", err);

        if (mounted) {
          setPlayerLoading(false);
          setError(
            err.message || "Unable to initialize YouTube player."
          );
        }
      }
    };

    initializePlayer();

    return () => {
      mounted = false;

      if (readyTimeout) clearTimeout(readyTimeout);
      if (localTimer) clearInterval(localTimer);

      if (timerRef.current === localTimer) {
        timerRef.current = null;
      }

      playerReadyRef.current = false;

      if (playerRef.current === localPlayer) {
        playerRef.current = null;
      }

      try {
        localPlayer?.destroy();
      } catch (error) {
        console.warn("YouTube cleanup error:", error);
      }

      youtubeWrapperRef.current?.replaceChildren();
    };
  }, [isLoading]);

  // ----------------------------------------------------
  // LOAD SELECTED LESSON WITHOUT RECREATING PLAYER
  // ----------------------------------------------------

  useEffect(() => {
    activeVideoRef.current = activeVideo;

    if (!activeVideo?.youtubeId) return;

    const player = playerRef.current;

    if (!playerReadyRef.current || !player) return;

    setError("");
    setPlayerLoading(true);
    setIsPlaying(false);

    setCurrentTime(
      Math.max(0, activeVideo.watchedSeconds || 0)
    );

    setDuration(
      Math.max(0, activeVideo.durationInSeconds || 0)
    );

    try {
      player.cueVideoById({
        videoId: activeVideo.youtubeId,
        startSeconds: Math.max(
          0,
          activeVideo.watchedSeconds || 0
        )
      });
    } catch (error) {
      console.error("Lesson change error:", error);
      setPlayerLoading(false);
      setError("Unable to load the selected lesson.");
    }
  }, [activeVideo?.id, activeVideo?.youtubeId]);

  // ----------------------------------------------------
  // PLAYER CONTROLS
  // ----------------------------------------------------

  const togglePlay = useCallback(() => {
    const player = playerRef.current;

    if (!player || typeof player.getPlayerState !== "function") {
      return;
    }

    try {
      const YT = window.YT;
      const state = player.getPlayerState();

      if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } catch (error) {
      console.error("Play/pause error:", error);
    }
  }, []);

  const handleSeek = (event) => {
    const time = Number(event.target.value);

    setCurrentTime(time);

    const player = playerRef.current;

    if (!player || typeof player.seekTo !== "function") return;

    try {
      player.seekTo(time, true);
    } catch (error) {
      console.error("Seek error:", error);
    }
  };

  const toggleMute = () => {
    const player = playerRef.current;

    if (!player) return;

    try {
      if (isMuted) {
        player.unMute();
        player.setVolume(volume * 100);
        setIsMuted(false);
      } else {
        player.mute();
        setIsMuted(true);
      }
    } catch (error) {
      console.error("Mute error:", error);
    }
  };

  const handleVolumeChange = (event) => {
    const value = Number(event.target.value);

    setVolume(value);
    setIsMuted(value === 0);

    const player = playerRef.current;

    if (!player) return;

    try {
      if (value === 0) {
        player.mute();
      } else {
        player.unMute();
        player.setVolume(value * 100);
      }
    } catch (error) {
      console.error("Volume error:", error);
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);

    const player = playerRef.current;

    if (player && typeof player.setPlaybackRate === "function") {
      try {
        player.setPlaybackRate(speed);
      } catch (error) {
        console.error("Playback speed error:", error);
      }
    }

    setShowSpeedMenu(false);
  };

  const toggleFullscreen = async () => {
    const element = playerShellRef.current;

    if (!element) return;

    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // ----------------------------------------------------
  // SELECT LESSON
  // ----------------------------------------------------

  const selectVideo = async (video) => {
    if (!video?.id) return;

    if (activeVideoRef.current?.id === video.id) return;

    if (switchingVideoRef.current) return;

    switchingVideoRef.current = true;

    try {
      try {
        playerRef.current?.pauseVideo?.();
      } catch (error) {
        console.warn("Pause before lesson change failed:", error);
      }

      setIsPlaying(false);
      isSessionPlayingRef.current = false;

      await closeCurrentVideoSession("LessonChanged");

      setError("");
      setCurrentTime(0);

      setDuration(
        Math.max(0, video.durationInSeconds || 0)
      );

      lastSavedPositionRef.current = 0;

      activeVideoRef.current = video;
      setActiveVideo(video);

    } finally {
      switchingVideoRef.current = false;
    }
  };

  // ----------------------------------------------------
  // COMPONENT CLEANUP
  // ----------------------------------------------------

  useEffect(() => {
    componentMountedRef.current = true;

    return () => {
      componentMountedRef.current = false;

      if (progressSaveTimerRef.current) {
        clearInterval(progressSaveTimerRef.current);
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // ----------------------------------------------------
  // CURRENT / PREVIOUS / NEXT LESSON
  // ----------------------------------------------------

  const currentVideoIndex = videos.findIndex(
    (video) => video.id === activeVideo?.id
  );

  const previousVideo = videos[currentVideoIndex - 1];
  const nextVideo = videos[currentVideoIndex + 1];

  // ----------------------------------------------------
  // LOADING UI
  // ----------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2
          className="animate-spin text-blue-600"
          size={38}
        />

        <span className="ml-3 font-semibold text-slate-700">
          Loading course videos...
        </span>
      </div>
    );
  }

  // ----------------------------------------------------
  // ERROR UI
  // ----------------------------------------------------

  if (error && !activeVideo) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-7 text-center shadow-sm">
          <AlertCircle
            className="mx-auto mb-3 text-red-500"
            size={36}
          />

          <h2 className="mb-2 text-lg font-bold text-slate-800">
            Unable to load classroom
          </h2>

          <p className="text-sm text-slate-500">
            {error || "No published videos found for this batch."}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!activeVideo || videos.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl bg-white p-7 text-center shadow-sm">
          <BookOpen
            className="mx-auto mb-3 text-blue-600"
            size={36}
          />

          <h2 className="font-bold text-slate-800">
            No course videos available
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            No published videos were found for this batch.
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // PLAYER PROGRESS
  // ----------------------------------------------------

  const progress =
    duration > 0
      ? Math.min((currentTime / duration) * 100, 100)
      : 0;

  // ----------------------------------------------------
  // PLAYER UI
  // ----------------------------------------------------

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 font-sans text-slate-800 lg:h-screen lg:min-h-0 lg:flex-row lg:overflow-hidden">

      {/* LEFT PLAYER SECTION */}

      <div className="flex min-h-0 w-full flex-col p-3 lg:h-full lg:w-[70%] lg:p-6">

        {/* PLAYER SHELL */}

        <div
          ref={playerShellRef}
          className="group relative min-h-[250px] flex-1 overflow-hidden rounded-2xl bg-black shadow-xl"
        >
          <div
            ref={youtubeWrapperRef}
            className="absolute inset-0 z-0 h-full w-full"
          />

          {/* Loading */}

          {playerLoading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black">
              <Loader2
                className="animate-spin text-white"
                size={38}
              />
            </div>
          )}

          {/* Player Error */}

          {error && activeVideo && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/95 p-6 text-center">
              <AlertCircle
                size={36}
                className="mb-3 text-red-400"
              />

              <p className="max-w-md text-sm text-white">
                {error}
              </p>

              <button
                onClick={() => {
                  setError("");

                  const player = playerRef.current;

                  if (player && playerReadyRef.current) {
                    setPlayerLoading(true);

                    player.loadVideoById({
                      videoId: activeVideo.youtubeId,
                      startSeconds: Math.max(
                        0,
                        activeVideo.watchedSeconds || 0
                      )
                    });
                  }
                }}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Retry Video
              </button>
            </div>
          )}

          {/* Click Overlay */}

          {!error && (
            <div
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={togglePlay}
              aria-label="Play or pause video"
            />
          )}

          {/* Center Play Icon */}

          {!isPlaying && !playerLoading && !error && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow-2xl backdrop-blur-md">
                <Play
                  size={36}
                  fill="currentColor"
                  className="ml-1 text-white"
                />
              </div>
            </div>
          )}

          {/* CUSTOM CONTROLS */}

          <div
            className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 pt-20 transition-opacity ${
              isPlaying
                ? "opacity-0 group-hover:opacity-100"
                : "opacity-100"
            }`}
          >
            {/* Progress Bar */}

            <div className="relative mb-4 h-1.5 w-full rounded-full bg-white/25">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />

              <input
                type="range"
                min="0"
                max={duration || 0}
                value={Math.min(currentTime, duration || 0)}
                onChange={handleSeek}
                disabled={!duration || playerLoading}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Video progress"
              />
            </div>

            {/* Bottom Controls */}

            <div className="flex items-center justify-between text-white">

              <div className="flex items-center gap-4">

                <button
                  onClick={togglePlay}
                  disabled={playerLoading || Boolean(error)}
                  className="hover:text-blue-400 disabled:opacity-50"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause size={22} fill="currentColor" />
                  ) : (
                    <Play size={22} fill="currentColor" />
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX size={20} />
                    ) : (
                      <Volume2 size={20} />
                    )}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 cursor-pointer accent-blue-500"
                    aria-label="Volume"
                  />
                </div>

                <span className="font-mono text-xs text-slate-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="relative flex items-center gap-4">

                {/* Playback Speed */}

                <div className="relative">
                  <button
                    onClick={() =>
                      setShowSpeedMenu((previous) => !previous)
                    }
                    className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
                  >
                    <Settings2 size={14} />
                    {playbackSpeed}x
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute bottom-9 right-0 z-50 flex min-w-20 flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-xl">
                      {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => changeSpeed(speed)}
                          className={`px-3 py-2 text-left text-xs hover:bg-slate-700 ${
                            playbackSpeed === speed
                              ? "font-bold text-blue-400"
                              : "text-white"
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen */}

                <button
                  onClick={toggleFullscreen}
                  aria-label="Toggle fullscreen"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LESSON DETAILS */}

        <div className="mt-4 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2">

            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase text-blue-600">
              {activeVideo.courseName || "Course"}
            </span>

            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              Lesson {activeVideo.sequence}
            </span>

            {isRewatchMode && (
              <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                Rewatch Mode
              </span>
            )}
          </div>

          <h1 className="text-lg font-bold text-slate-800 lg:text-2xl">
            {activeVideo.title}
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {activeVideo.description || "No description available."}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={() => previousVideo && selectVideo(previousVideo)}
              disabled={!previousVideo}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous Lesson
            </button>

            <button
              onClick={() => nextVideo && selectVideo(nextVideo)}
              disabled={!nextVideo}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next Lesson →
            </button>
          </div>
        </div>

        {/* MOBILE COURSE PLAYLIST */}

        <div className="mt-4 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:hidden">

          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-slate-800">
                <BookOpen size={19} className="text-blue-600" />
                Course Lessons
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Select any lesson to start watching
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              {videos.length} Lessons
            </span>
          </div>

          <div className="max-h-[320px] space-y-2 overflow-y-auto p-3">
            {videos.map((video, index) => {
              const isActive = activeVideo.id === video.id;
              const isCompleted = video.progressPercentage >= 100;

              return (
                <button
                  key={video.id}
                  onClick={() => selectVideo(video)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    isActive
                      ? "border-blue-300 bg-blue-50 ring-1 ring-blue-500/20"
                      : "border-slate-100 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {isActive ? (
                      <Play size={16} fill="currentColor" />
                    ) : isCompleted ? (
                      <CheckCircle2 size={19} />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`line-clamp-2 text-sm font-semibold ${
                        isActive ? "text-blue-700" : "text-slate-700"
                      }`}
                    >
                      {video.title}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        Lesson {video.sequence}
                      </span>

                      <span className="text-[11px] text-slate-400">
                        •
                      </span>

                      <span className="text-[11px] text-slate-400">
                        {video.durationInSeconds
                          ? `${Math.ceil(video.durationInSeconds / 60)} min`
                          : "Duration unavailable"}
                      </span>
                    </div>

                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${
                          isCompleted ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            Math.max(video.progressPercentage || 0, 0),
                            100
                          )}%`
                        }}
                      />
                    </div>
                  </div>

                  {isActive && (
                    <span className="shrink-0 text-xs font-bold text-blue-600">
                      Playing
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT DESKTOP PLAYLIST */}

      <div className="hidden h-full w-[30%] flex-col border-l border-slate-200 bg-white lg:flex">

        <div className="border-b border-slate-100 bg-slate-50/70 p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <BookOpen
              size={20}
              className="text-blue-600"
            />
            Course Content
          </h2>

          <p className="mt-1 text-xs font-medium text-slate-500">
            {videos.length} Lessons in this batch
          </p>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto bg-slate-50 p-3">
          {videos.map((video, index) => {
            const isActive = activeVideo.id === video.id;
            const isCompleted = video.progressPercentage >= 100;

            return (
              <button
                key={video.id}
                onClick={() => selectVideo(video)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                  isActive
                    ? "border-blue-200 bg-white shadow-sm ring-1 ring-blue-500/20"
                    : "border-transparent hover:border-slate-200 hover:bg-white"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isActive ? (
                    <Play size={13} fill="currentColor" />
                  ) : isCompleted ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    index + 1
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-bold ${
                      isActive ? "text-blue-700" : "text-slate-700"
                    }`}
                  >
                    {video.title}
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock size={11} />
                      {video.durationInSeconds
                        ? `${Math.ceil(video.durationInSeconds / 60)} min`
                        : "Duration unavailable"}
                    </span>
                  </div>

                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${
                        isCompleted ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          Math.max(video.progressPercentage || 0, 0),
                          100
                        )}%`
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
