
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SecureVideoPlayer from "./SecureVideoPlayer";

export default function ClassroomPage() {
  const { batchId } = useParams();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode") || "enter";

  console.log("Classroom URL Batch ID:", batchId);
  console.log("Classroom Mode:", mode);

  return (
    <SecureVideoPlayer
      batchId={batchId}
      mode={mode}
    />
  );
}
