import { useMemo, useState } from "react";
import {
  Award,
  BadgeCheck,
  Download,
  Eye,
  FileBadge2,
  GraduationCap,
  Search,
  ShieldCheck,
  X,
  RefreshCw,
} from "lucide-react";
import useStudentCertificates from "../../../hooks/student/useStudentCertificates";
import { studentService } from "../../../services/student/studentService";
import CertificateTemplate from "../../../component/ui/CertificateTemplate.jsx";

function BlobButton({ children, icon, variant = "primary", className = "", onClick, disabled = false, type = "button" }) {
  const variants = {
    primary: "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    secondary: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
    blue: "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}>
      <span className="pointer-events-none absolute -right-5 -top-5 h-10 w-10 rounded-full bg-white/70 blur-md transition group-hover:scale-150" />
      <span className="relative z-10 flex items-center gap-2">{icon}{children}</span>
    </button>
  );
}

function VerifiedBadge({ revoked = false }) {
  return revoked ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700">REVOKED</span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
      <BadgeCheck size={13} /> VERIFIED
    </span>
  );
}

function SummaryCard({ icon, label, value, helper, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xs text-slate-400">{label}</p>
          <p className="mt-0.5 text-xl font-black text-slate-900">{value}</p>
          <p className="mt-0.5 truncate text-[10px] text-slate-400">{helper}</p>
        </div>
      </div>
    </div>
  );
}

function CertificateCard({ certificate, onView, onDownload }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-100/70 blur-2xl" />
        <div className="relative rounded-xl border border-white bg-white/90 p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Award size={19} /></div>
            <VerifiedBadge revoked={certificate.isRevoked} />
          </div>
          <div className="mt-5 text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Certificate of Completion</p>
            <p className="mt-3 text-lg font-black text-slate-800">{certificate.studentName}</p>
            <p className="mt-1 text-[10px] text-slate-400">has successfully completed</p>
            <p className="mt-2 line-clamp-2 text-sm font-bold text-emerald-700">{certificate.course}</p>
          </div>
          <div className="mt-5 border-t border-slate-100 pt-3 text-center">
            <p className="break-all text-[9px] font-mono text-slate-400">{certificate.certificateId}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase text-emerald-600">COURSE COMPLETION</p>
            <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900">{certificate.course}</h3>
          </div>
          <div className="rounded-xl bg-slate-50 px-2.5 py-1.5 text-center">
            <p className="text-[9px] text-slate-400">Status</p>
            <p className={`text-xs font-black ${certificate.isRevoked ? "text-red-600" : "text-emerald-600"}`}>{certificate.isRevoked ? "Revoked" : "Valid"}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-[9px] text-slate-400">Issued</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-700">{certificate.issuedDate}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-[9px] text-slate-400">Certificate ID</p>
            <p className="mt-1 break-all text-[10px] font-semibold text-slate-700">{certificate.certificateId}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <BlobButton variant="secondary" icon={<Eye size={15} />} className="flex-1" onClick={() => onView(certificate)}>View</BlobButton>
          <BlobButton variant="primary" icon={<Download size={15} />} className="flex-1" onClick={() => onDownload(certificate)}>Download</BlobButton>
        </div>
      </div>
    </article>
  );
}

export default function StudentCertificates() {
  const { certificates, loading, error, refresh } = useStudentCertificates();
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [verifyId, setVerifyId] = useState("");
  const [verification, setVerification] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const courses = useMemo(() => ["All Courses", ...new Set(certificates.map((item) => item.course))], [certificates]);
  const filteredCertificates = useMemo(() => certificates.filter((item) => {
    const text = `${item.course} ${item.certificateId} ${item.verificationCode}`.toLowerCase();
    return (!search || text.includes(search.toLowerCase())) && (course === "All Courses" || item.course === course);
  }), [certificates, search, course]);

  const activeCertificates = certificates.filter((item) => !item.isRevoked);
  const latestCertificate = activeCertificates[0] || certificates[0] || null;

  const clearFilters = () => { setSearch(""); setCourse("All Courses"); };

  const downloadCertificate = (certificate) => {
    if (certificate.certificateUrl) {
      window.open(certificate.certificateUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setSelectedCertificate(certificate);
  };

  const printCertificate = () => window.print();

  const verify = async (event) => {
    event.preventDefault();
    const code = verifyId.trim();
    if (!code) {
      setVerification({ ok: false, message: "Please enter a certificate verification code." });
      return;
    }
    setVerifying(true);
    setVerification(null);
    try {
      const response = await studentService.verifyCertificate(code);
      const data = response?.data ?? response?.Data ?? response;
      const isValid = Boolean(data?.isValid ?? data?.IsValid);
      setVerification({
        ok: isValid,
        message: isValid ? "Certificate is valid." : "This certificate is not valid or has been revoked.",
        studentName: data?.studentName ?? data?.StudentName,
        courseName: data?.courseName ?? data?.CourseName,
        issuedAt: data?.issuedAt ?? data?.IssuedAt,
      });
    } catch (err) {
      setVerification({ ok: false, message: err?.message || "Unable to verify certificate." });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><span>Student Dashboard</span><span>/</span><span className="font-medium text-slate-600">Certificates</span></div>
            <div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">My Certificates</h1><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">LIVE DATA</span></div>
            <p className="mt-1.5 text-sm text-slate-500">View, download and verify your course completion certificates.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-3"><p className="text-[11px] text-emerald-600">Total Certificates</p><p className="text-2xl font-black text-emerald-700">{certificates.length}</p></div>
            <button type="button" onClick={refresh} title="Refresh certificates" className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"><RefreshCw size={17} /></button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {error && <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"><span>{error}</span><BlobButton variant="secondary" onClick={refresh}>Try Again</BlobButton></div>}

        <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <SummaryCard icon={<Award size={19} />} label="Certificates" value={loading ? "—" : certificates.length} helper="Issued to your account" iconClass="bg-emerald-50 text-emerald-600" />
          <SummaryCard icon={<GraduationCap size={19} />} label="Valid Certificates" value={loading ? "—" : activeCertificates.length} helper="Not revoked" iconClass="bg-blue-50 text-blue-600" />
          <SummaryCard icon={<FileBadge2 size={19} />} label="Latest Issue" value={latestCertificate?.issuedDate || "—"} helper={latestCertificate?.course || "No certificate issued yet"} iconClass="bg-amber-50 text-amber-600" />
        </section>

        {latestCertificate && (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-emerald-600">Latest Certificate Preview</p>
                <CertificateTemplate certificate={latestCertificate} />
              </div>
              <div className="w-full lg:w-72">
                <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">Latest Certificate</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{latestCertificate.course}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Your certificate has been issued by {"Nexvara Institute"}. The certificate number and verification code are linked to the official record.</p>
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span className="text-xs text-slate-400">Issued</span><span className="text-xs font-bold text-slate-700">{latestCertificate.issuedDate}</span></div>
                  <div className="rounded-xl bg-slate-50 p-3"><span className="text-xs text-slate-400">Certificate ID</span><p className="mt-1 break-all text-xs font-bold text-slate-700">{latestCertificate.certificateId}</p></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span className="text-xs text-slate-400">Status</span><VerifiedBadge revoked={latestCertificate.isRevoked} /></div>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <BlobButton icon={<Download size={16} />} className="w-full" onClick={() => downloadCertificate(latestCertificate)}>Download Certificate</BlobButton>
                  <BlobButton variant="secondary" icon={<Eye size={16} />} className="w-full" onClick={() => setSelectedCertificate(latestCertificate)}>View Certificate</BlobButton>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search certificate or course..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100" /></div>
            <select value={course} onChange={(e) => setCourse(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 md:w-72">{courses.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </div>
        </section>

        <section>
          <div className="mb-4"><h2 className="text-lg font-bold text-slate-900">All Certificates</h2><p className="mt-1 text-sm text-slate-500">{loading ? "Loading your certificates..." : `${filteredCertificates.length} certificate${filteredCertificates.length !== 1 ? "s" : ""} available.`}</p></div>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((x) => <div key={x} className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}</div>
          ) : filteredCertificates.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredCertificates.map((certificate) => <CertificateCard key={certificate.id} certificate={certificate} onView={setSelectedCertificate} onDownload={downloadCertificate} />)}</div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Award size={26} /></div><h3 className="mt-4 text-base font-bold text-slate-900">{certificates.length ? "No certificates found" : "No certificates issued yet"}</h3><p className="mt-2 text-sm text-slate-500">{certificates.length ? "Try changing your search or course filter." : "When your course certificate is issued, it will appear here automatically."}</p>{certificates.length > 0 && <button type="button" onClick={clearFilters} className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Clear Filters</button>}</div>
          )}
        </section>

        <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"><ShieldCheck size={21} /></div><div className="flex-1"><h3 className="text-sm font-bold text-slate-900">Certificate Verification</h3><p className="mt-1 text-xs leading-5 text-slate-500">Enter the verification code printed on a certificate to check its authenticity using the public verification API.</p></div></div>
          <form onSubmit={verify} className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={verifyId} onChange={(e) => setVerifyId(e.target.value)} placeholder="Enter verification code" className="h-11 min-w-0 flex-1 rounded-xl border border-blue-100 bg-white px-4 text-sm outline-none focus:border-blue-400" /><BlobButton type="submit" variant="blue" icon={<ShieldCheck size={15} />} disabled={verifying}>{verifying ? "Verifying..." : "Verify Certificate"}</BlobButton></form>
          {verification && <div className={`mt-3 rounded-xl border p-3 text-sm ${verification.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}><p className="font-bold">{verification.message}</p>{verification.ok && <div className="mt-1 text-xs"><p>Holder: {verification.studentName || "—"}</p><p>Course: {verification.courseName || "—"}</p></div>}</div>}
        </section>
      </main>

      {selectedCertificate && (
        <div className="certificate-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-6">
          <div className="max-h-[96vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 print:hidden"><div><p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">Certificate Preview</p><h2 className="mt-1 text-base font-bold text-slate-900">{selectedCertificate.course}</h2></div><button type="button" onClick={() => setSelectedCertificate(null)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition hover:bg-slate-100"><X size={18} /></button></div>
            <div id="certificate-print-area" className="p-4 sm:p-8"><CertificateTemplate certificate={selectedCertificate} /></div>
            <div className="mt-1 flex flex-col gap-2 border-t border-slate-100 p-5 sm:flex-row sm:justify-end print:hidden"><BlobButton variant="secondary" onClick={() => setSelectedCertificate(null)}>Close</BlobButton><BlobButton icon={<Download size={15} />} onClick={printCertificate}>Print / Save as PDF</BlobButton></div>
          </div>
        </div>
      )}
    </div>
  );
}
