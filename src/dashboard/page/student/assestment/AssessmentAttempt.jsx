import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock3, FileQuestion, Loader2, Send } from "lucide-react";
import { studentAssessmentService } from "../../../services/student/studentAssessmentService";

const read = (obj, camel, pascal, fallback = null) => obj?.[camel] ?? obj?.[pascal] ?? fallback;
const unwrapList = (obj, camel, pascal) => read(obj, camel, pascal, []);
const fmtTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export default function AssessmentAttempt() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      setLoading(true);
      setError("");
      try {
        const started = await studentAssessmentService.startAssessment(assessmentId);
        const details = await studentAssessmentService.getAssessmentDetails(assessmentId);
        if (!active) return;
        const startedAt = read(started, "startedAt", "StartedAt");
        const expiresAt = read(started, "expiresAt", "ExpiresAt") || (
          startedAt && Number(read(details, "durationInMinutes", "DurationInMinutes", 0))
            ? new Date(new Date(startedAt).getTime() + Number(read(details, "durationInMinutes", "DurationInMinutes")) * 60000).toISOString()
            : null
        );
        setAttempt({
          id: read(started, "attemptId", "AttemptId"),
          startedAt,
          expiresAt,
        });
        setAssessment({
          id: read(details, "id", "Id", Number(assessmentId)),
          title: read(details, "title", "Title", "Assessment"),
          description: read(details, "description", "Description", ""),
          totalMarks: read(details, "totalMarks", "TotalMarks", 0),
          duration: read(details, "durationInMinutes", "DurationInMinutes", 0),
          questions: unwrapList(details, "questions", "Questions").map((q) => ({
            id: read(q, "id", "Id"),
            text: read(q, "questionText", "QuestionText", ""),
            type: Number(read(q, "questionType", "QuestionType", 1)),
            marks: read(q, "marks", "Marks", 0),
            options: unwrapList(q, "options", "Options").map((o) => ({
              id: read(o, "id", "Id"),
              text: read(o, "optionText", "OptionText", ""),
            })),
          })),
        });
        if (expiresAt) setSecondsLeft(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)));
      } catch (err) {
        if (active) setError(err.message || "Unable to open this assessment.");
      } finally {
        if (active) setLoading(false);
      }
    };
    initialize();
    return () => { active = false; };
  }, [assessmentId]);

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return undefined;
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft === null ? null : secondsLeft > 0]);

  const questions = assessment?.questions || [];
  const current = questions[activeIndex];
  const answeredCount = useMemo(() => Object.values(answers).filter((a) => a.selectedOptionId != null || String(a.answerText || "").trim()).length, [answers]);

  const updateAnswer = (questionId, patch) => setAnswers((previous) => ({
    ...previous,
    [questionId]: { selectedOptionId: null, answerText: "", ...previous[questionId], ...patch },
  }));

  const submit = useCallback(async (auto = false) => {
    if (!attempt?.id || submitting) return;
    if (!auto && !window.confirm(`Submit your assessment? You have answered ${answeredCount} of ${questions.length} questions.`)) return;
    setSubmitting(true);
    try {
      const payload = {
        answers: questions.map((question) => ({
          questionId: question.id,
          selectedOptionId: answers[question.id]?.selectedOptionId ?? null,
          answerText: answers[question.id]?.answerText?.trim() || null,
        })),
      };
      await studentAssessmentService.submitAssessment(attempt.id, payload);
      toast.success("Assessment submitted successfully.");
      navigate("/student/assessments/results", { replace: true });
    } catch (err) {
      toast.error(err.message || "Unable to submit assessment.");
      setSubmitting(false);
    }
  }, [attempt, submitting, answeredCount, questions, answers, navigate]);

  useEffect(() => {
    if (secondsLeft === 0 && attempt?.id && !submitting) submit(true);
  }, [secondsLeft, attempt?.id, submitting, submit]);

  if (loading) return <div className="flex min-h-[60vh] flex-col items-center justify-center"><Loader2 size={36} className="animate-spin text-violet-600"/><p className="mt-3 text-sm text-slate-500">Preparing your assessment...</p></div>;
  if (error) return <div className="mx-auto max-w-2xl rounded-3xl border border-rose-100 bg-white p-8 text-center"><AlertCircle size={36} className="mx-auto text-rose-500"/><h2 className="mt-3 text-xl font-bold text-slate-800">Cannot start assessment</h2><p className="mt-2 text-sm text-slate-600">{error}</p><button onClick={() => navigate(-1)} className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white">Go back</button></div>;
  if (!assessment || !questions.length) return <div className="rounded-3xl bg-white p-10 text-center"><FileQuestion className="mx-auto text-slate-300" size={40}/><h2 className="mt-3 font-bold text-slate-800">No questions found</h2><p className="mt-1 text-sm text-slate-500">Please contact your instructor.</p></div>;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-[#24164F] to-[#6D5BD0] p-5 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div><button onClick={() => navigate(-1)} className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-100 hover:text-white"><ArrowLeft size={14}/> Back</button><h1 className="text-xl font-black sm:text-2xl">{assessment.title}</h1><p className="mt-1 text-sm text-violet-100">Read each question carefully before submitting.</p></div>
        <div className={`flex items-center gap-3 self-start rounded-2xl border px-4 py-3 sm:self-auto ${secondsLeft !== null && secondsLeft < 300 ? "border-rose-300 bg-rose-500/20" : "border-white/20 bg-white/10"}`}><Clock3 size={21}/><div><p className="text-[11px] text-violet-100">Time remaining</p><p className="font-mono text-xl font-bold tabular-nums">{secondsLeft === null ? "--:--" : fmtTime(secondsLeft)}</p></div></div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3"><span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">Question {activeIndex + 1} of {questions.length}</span><span className="text-xs font-semibold text-slate-500">{current.marks} marks</span></div>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${((activeIndex + 1) / questions.length) * 100}%` }}/></div>
          <h2 className="text-lg font-bold leading-7 text-slate-900">{current.text}</h2>
          {current.type === 4 ? (
            <textarea value={answers[current.id]?.answerText || ""} onChange={(e) => updateAnswer(current.id, { answerText: e.target.value })} rows={7} placeholder="Write your answer here..." className="mt-6 w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"/>
          ) : (
            <>
            {current.type === 2 && <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">Note: Your current AssessmentAnswers table stores one SelectedOptionId per question. Multiple-choice questions are therefore presented as single-select until the backend schema supports multiple selections.</p>}
            <div className="mt-6 space-y-3">{current.options.map((option, index) => {
              const selected = String(answers[current.id]?.selectedOptionId ?? "") === String(option.id);
              return <label key={option.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${selected ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100" : "border-slate-200 hover:border-violet-200 hover:bg-slate-50"}`}><input type="radio" name={`question-${current.id}`} checked={selected} onChange={() => updateAnswer(current.id, { selectedOptionId: option.id })} className="h-4 w-4 accent-violet-600"/><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">{String.fromCharCode(65 + index)}</span><span className="text-sm font-medium text-slate-700">{option.text}</span></label>;
            })}</div>
            </>
          )}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5"><button disabled={activeIndex === 0} onClick={() => setActiveIndex((v) => v - 1)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-40"><ArrowLeft size={16}/> Previous</button>{activeIndex < questions.length - 1 ? <button onClick={() => setActiveIndex((v) => v + 1)} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700">Next question <ArrowRight size={16}/></button> : <button disabled={submitting} onClick={() => submit(false)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60">{submitting ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>} Submit assessment</button>}</div>
        </section>

        <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><h3 className="font-bold text-slate-800">Question overview</h3><p className="mt-1 text-xs text-slate-500">Select a number to move to that question.</p><div className="mt-4 grid grid-cols-5 gap-2">{questions.map((question, index) => { const answered = answers[question.id]?.selectedOptionId != null || String(answers[question.id]?.answerText || "").trim(); return <button key={question.id} onClick={() => setActiveIndex(index)} className={`flex h-10 items-center justify-center rounded-xl text-sm font-bold transition ${index === activeIndex ? "bg-violet-600 text-white" : answered ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{index + 1}</button>; })}</div><div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500"><p className="flex items-center justify-between"><span>Answered</span><strong className="text-emerald-600">{answeredCount}/{questions.length}</strong></p><p className="flex items-center justify-between"><span>Not answered</span><strong>{questions.length - answeredCount}</strong></p></div><button disabled={submitting} onClick={() => submit(false)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"><CheckCircle2 size={17}/> Submit test</button><p className="mt-3 text-center text-[11px] leading-4 text-slate-400">Your answers will be submitted once. Review them before final submission.</p></aside>
      </div>
    </div>
  );
}
