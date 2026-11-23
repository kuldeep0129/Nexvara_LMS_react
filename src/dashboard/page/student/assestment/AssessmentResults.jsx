import { useCallback, useEffect, useState } from "react";
import { Award, CheckCircle2, Clock3, FileQuestion, Loader2, RefreshCw, XCircle } from "lucide-react";
import { studentAssessmentService } from "../../../services/student/studentAssessmentService";

const read = (obj, camel, pascal, fallback = null) => obj?.[camel] ?? obj?.[pascal] ?? fallback;
const dateText = (value) => value ? new Date(value).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

export default function AssessmentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await studentAssessmentService.getMyAssessmentResults();
      const list = Array.isArray(response) ? response : read(response, "results", "Results", read(response, "attempts", "Attempts", null));
      setResults(Array.isArray(list) ? list : (response && read(response, "attemptId", "AttemptId") ? [response] : []));
    } catch (err) { setError(err.message || "Unable to load results."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return <div className="mx-auto max-w-7xl space-y-6">
    <section className="rounded-[28px] bg-gradient-to-br from-[#21164F] via-[#4935A5] to-[#7667DE] p-6 text-white shadow-xl sm:p-8"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><Award size={25}/></div><div><h1 className="text-2xl font-black">Assessment Results</h1><p className="mt-1 text-sm text-violet-100">Review your submitted assessments and scores.</p></div></div></section>
    <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-slate-800">Your performance</h2><p className="text-sm text-slate-500">Results from your assessment attempts.</p></div><button onClick={load} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600"><RefreshCw size={15}/> Refresh</button></div>
    {loading && <div className="flex min-h-64 items-center justify-center rounded-3xl bg-white"><Loader2 className="animate-spin text-violet-600" size={32}/></div>}
    {!loading && error && <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center text-sm text-rose-700">{error}<button onClick={load} className="ml-3 font-bold underline">Retry</button></div>}
    {!loading && !error && results.length === 0 && <div className="rounded-3xl border border-slate-100 bg-white py-16 text-center"><FileQuestion className="mx-auto text-slate-300" size={42}/><h3 className="mt-4 font-bold text-slate-800">No results yet</h3><p className="mt-1 text-sm text-slate-500">Your submitted assessment results will appear here.</p></div>}
    {!loading && !error && results.length > 0 && <div className="grid gap-5 lg:grid-cols-2">{results.map((item, index) => {
      const id = read(item, "attemptId", "AttemptId", index);
      const passed = Boolean(read(item, "isPassed", "IsPassed", false));
      const marks = Number(read(item, "obtainedMarks", "ObtainedMarks", 0));
      const total = Number(read(item, "totalMarks", "TotalMarks", 0));
      const percentage = Number(read(item, "percentage", "Percentage", total ? marks / total * 100 : 0));
      return <article key={id} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Assessment result</p><h3 className="mt-1 text-lg font-bold text-slate-900">{read(item, "assessmentTitle", "AssessmentTitle", "Assessment")}</h3></div><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${passed ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{passed ? <CheckCircle2 size={14}/> : <XCircle size={14}/>} {passed ? "Passed" : "Not passed"}</span></div>
        <div className="mt-5 grid grid-cols-3 gap-3"><div className="rounded-2xl bg-violet-50 p-3"><p className="text-[11px] text-violet-600">Score</p><p className="mt-1 text-xl font-black text-violet-900">{marks}<span className="text-sm font-semibold">/{total}</span></p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-[11px] text-slate-500">Percentage</p><p className="mt-1 text-xl font-black text-slate-900">{percentage.toFixed(1)}%</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-[11px] text-slate-500">Passing marks</p><p className="mt-1 text-xl font-black text-slate-900">{read(item, "passingMarks", "PassingMarks", "—")}</p></div></div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${passed ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}/></div>
        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:flex-row sm:justify-between"><span className="inline-flex items-center gap-1.5"><Clock3 size={14}/> Started: {dateText(read(item, "startedAt", "StartedAt"))}</span><span>Submitted: {dateText(read(item, "submittedAt", "SubmittedAt"))}</span></div>
      </article>;
    })}</div>}
  </div>;
}
