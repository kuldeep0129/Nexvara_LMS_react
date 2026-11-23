import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertCircle, ArrowRight, BookOpen, CalendarDays, CheckCircle2,
  Clock3, FileQuestion, Loader2, RefreshCw, Search, Sparkles, Timer
} from "lucide-react";
import { studentAssessmentService } from "../../../services/student/studentAssessmentService";

const read = (obj, camel, pascal, fallback = null) => obj?.[camel] ?? obj?.[pascal] ?? fallback;
const dateText = (value) => value ? new Date(value).toLocaleString("en-IN", {
  day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
}) : "Schedule not specified";
const number = (value) => Number(value ?? 0);

export default function AssessmentList({ view = "available" }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await studentAssessmentService.getMyAssessments();
      const list = Array.isArray(response)
        ? response
        : read(response, "assessments", "Assessments", read(response, "items", "Items", []));
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || "Unable to load assessments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const mapped = useMemo(() => items.map((item) => ({
    id: read(item, "id", "Id"),
    title: read(item, "title", "Title", "Untitled assessment"),
    description: read(item, "description", "Description", "Complete this assessment within the given time."),
    courseName: read(item, "courseName", "CourseName", "Course assessment"),
    batchName: read(item, "batchName", "BatchName", "Enrolled batch"),
    totalMarks: number(read(item, "totalMarks", "TotalMarks", 0)),
    passingMarks: number(read(item, "passingMarks", "PassingMarks", 0)),
    duration: number(read(item, "durationInMinutes", "DurationInMinutes", 0)),
    questions: number(read(item, "totalQuestions", "TotalQuestions", 0)),
    startAt: read(item, "startAt", "StartAt"),
    endAt: read(item, "endAt", "EndAt"),
    status: read(item, "status", "Status", "Available"),
    hasAttempt: Boolean(read(item, "hasAttempt", "HasAttempt", false)),
    isSubmitted: Boolean(read(item, "isSubmitted", "IsSubmitted", false)),
  })), [items]);

  const filtered = useMemo(() => mapped.filter((item) => {
    const matchesSearch = `${item.title} ${item.courseName} ${item.batchName}`.toLowerCase().includes(search.toLowerCase());
    const matchesView = view === "upcoming"
      ? String(item.status).toLowerCase() === "upcoming"
      : String(item.status).toLowerCase() === "available";
    return matchesSearch && matchesView;
  }), [mapped, search, view]);

  const start = (id) => navigate(`/student/assessments/attempt/${id}`);
  const isUpcoming = view === "upcoming";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#21164F] via-[#4935A5] to-[#7667DE] p-6 text-white shadow-xl sm:p-8">
        <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-violet-100"><Sparkles size={14} /> Student assessment center</div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{isUpcoming ? "Upcoming Assessments" : "Available Assessments"}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100">{isUpcoming ? "Prepare in advance and be ready when your assessment window opens." : "Your assessments are ready. Review the instructions and start when you are prepared."}</p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3"><p className="text-xs text-violet-100">{isUpcoming ? "Upcoming" : "Available"}</p><p className="mt-1 text-2xl font-bold">{filtered.length}</p></div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3"><p className="text-xs text-violet-100">Total found</p><p className="mt-1 text-2xl font-bold">{mapped.length}</p></div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">{isUpcoming ? "Your assessment schedule" : "Ready to take"}</h2><p className="text-sm text-slate-500">Assessment information is loaded from your student account.</p></div>
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1 sm:w-72"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assessments..." className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" /></div>
          <button onClick={load} className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><RefreshCw size={16} /> <span className="hidden sm:inline">Refresh</span></button>
        </div>
      </div>

      {loading && <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white"><Loader2 className="animate-spin text-violet-600" size={34} /><p className="mt-3 text-sm text-slate-500">Loading assessments...</p></div>}
      {!loading && error && <div className="rounded-3xl border border-rose-100 bg-rose-50 p-7 text-center"><AlertCircle className="mx-auto text-rose-500" size={32} /><h3 className="mt-3 font-bold text-rose-800">Unable to load assessments</h3><p className="mt-1 text-sm text-rose-700">{error}</p><button onClick={load} className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Try again</button></div>}
      {!loading && !error && filtered.length === 0 && <div className="rounded-3xl border border-slate-100 bg-white px-5 py-16 text-center"><FileQuestion className="mx-auto text-slate-300" size={42} /><h3 className="mt-4 text-lg font-bold text-slate-800">No {isUpcoming ? "upcoming" : "available"} assessments</h3><p className="mt-1 text-sm text-slate-500">{search ? "Try another search term." : "New assessments assigned to your enrolled batches will appear here."}</p></div>}

      {!loading && !error && filtered.length > 0 && <div className="grid gap-5 xl:grid-cols-2">{filtered.map((item) => (
        <article key={item.id} className="group rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-6">
          <div className="flex items-start justify-between gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><BookOpen size={22} /></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${isUpcoming ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{item.status}</span></div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
          <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{item.description}</p>
          <div className="mt-4 flex flex-wrap gap-2"><span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">{item.courseName}</span><span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">{item.batchName}</span></div>
          <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric icon={<Timer size={15}/>} label="Duration" value={`${item.duration} min`} />
            <Metric icon={<FileQuestion size={15}/>} label="Questions" value={item.questions || "—"} />
            <Metric icon={<AwardIcon/>} label="Total marks" value={item.totalMarks} />
            <Metric icon={<CheckCircle2 size={15}/>} label="Passing" value={item.passingMarks} />
          </div>
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span className="inline-flex items-center gap-1.5"><CalendarDays size={14}/> {isUpcoming ? "Starts" : "Window starts"}: {dateText(item.startAt)}</span><span className="inline-flex items-center gap-1.5"><Clock3 size={14}/> Ends: {dateText(item.endAt)}</span></div>
          <div className="mt-5 flex items-center justify-between gap-3"><span className="text-xs font-medium text-slate-500">{item.isSubmitted ? "Already submitted" : item.hasAttempt ? "Attempt in progress / available" : "Not attempted yet"}</span><button disabled={isUpcoming || item.isSubmitted || !item.id} onClick={() => start(item.id)} className="inline-flex items-center gap-2 rounded-xl bg-[#6D5BD0] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:bg-[#5845BD] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">{item.hasAttempt ? "Resume assessment" : "Start assessment"}<ArrowRight size={16}/></button></div>
        </article>
      ))}</div>}
    </div>
  );
}

function Metric({ icon, label, value }) {
  return <div className="rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-1.5 text-slate-400">{icon}<span className="text-[11px] font-medium">{label}</span></div><p className="mt-1 text-sm font-bold text-slate-800">{value}</p></div>;
}
function AwardIcon() { return <CheckCircle2 size={15}/>; }
