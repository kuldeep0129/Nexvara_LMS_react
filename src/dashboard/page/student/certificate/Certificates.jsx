import { useMemo, useState } from "react";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  Download,
  Eye,
  FileBadge2,
  GraduationCap,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

/* =========================================================
   DEMO DATA
========================================================= */

const certificates = [
  {
    id: 1,
    certificateId: "NXV-CERT-2026-00128",
    course: "ASP.NET Core Mastery",
    category: "Web Development",
    issuedDate: "20 Oct 2026",
    completionDate: "18 Oct 2026",
    duration: "12 Weeks",
    score: "92%",
    grade: "A+",
    status: "Verified",
    instructor: "Rahul Sharma",
  },
  {
    id: 2,
    certificateId: "NXV-CERT-2026-00112",
    course: "React Advanced",
    category: "Frontend Development",
    issuedDate: "05 Oct 2026",
    completionDate: "02 Oct 2026",
    duration: "10 Weeks",
    score: "89%",
    grade: "A",
    status: "Verified",
    instructor: "Priya Verma",
  },
  {
    id: 3,
    certificateId: "NXV-CERT-2026-00094",
    course: "Interview Preparation",
    category: "Career Preparation",
    issuedDate: "22 Sep 2026",
    completionDate: "20 Sep 2026",
    duration: "8 Weeks",
    score: "86%",
    grade: "A",
    status: "Verified",
    instructor: "Amit Kumar",
  },
  {
    id: 4,
    certificateId: "NXV-CERT-2026-00071",
    course: "Full Stack Development",
    category: "Full Stack",
    issuedDate: "10 Aug 2026",
    completionDate: "08 Aug 2026",
    duration: "16 Weeks",
    score: "91%",
    grade: "A+",
    status: "Verified",
    instructor: "Rahul Sharma",
  },
];

/* =========================================================
   FILTER OPTIONS
========================================================= */

const courses = [
  "All Courses",
  "ASP.NET Core Mastery",
  "React Advanced",
  "Interview Preparation",
  "Full Stack Development",
];

/* =========================================================
   BLOB BUTTON
========================================================= */

function BlobButton({
  children,
  icon,
  variant = "primary",
  className = "",
  onClick,
}) {
  const variants = {
    primary:
      "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",

    secondary:
      "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",

    blue:
      "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${variants[variant]} ${className}`}
    >
      <span className="pointer-events-none absolute -right-5 -top-5 h-10 w-10 rounded-full bg-white/70 blur-md transition group-hover:scale-150" />

      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
}

/* =========================================================
   VERIFIED BADGE
========================================================= */

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
      <BadgeCheck size={13} />
      VERIFIED
    </span>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon,
  label,
  value,
  helper,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-400">
            {label}
          </p>

          <p className="mt-0.5 text-xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-slate-400">
            {helper}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CERTIFICATE CARD
========================================================= */

function CertificateCard({
  certificate,
  onView,
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md">
      {/* Certificate Preview */}

      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-100/70 blur-2xl" />

        <div className="relative rounded-xl border border-white bg-white/90 p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Award size={19} />
            </div>

            <VerifiedBadge />
          </div>

          <div className="mt-5 text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Certificate of Completion
            </p>

            <p className="mt-3 text-lg font-black text-slate-800">
              Kuldeep Tiwari
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              has successfully completed
            </p>

            <p className="mt-2 line-clamp-2 text-sm font-bold text-emerald-700">
              {certificate.course}
            </p>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-3 text-center">
            <p className="text-[9px] font-mono text-slate-400">
              {certificate.certificateId}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase text-emerald-600">
              {certificate.category}
            </p>

            <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900">
              {certificate.course}
            </h3>
          </div>

          <div className="rounded-xl bg-slate-50 px-2.5 py-1.5 text-center">
            <p className="text-[9px] text-slate-400">
              Grade
            </p>

            <p className="text-xs font-black text-emerald-600">
              {certificate.grade}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-[9px] text-slate-400">
              Issued
            </p>

            <p className="mt-1 text-[11px] font-semibold text-slate-700">
              {certificate.issuedDate}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-[9px] text-slate-400">
              Score
            </p>

            <p className="mt-1 text-[11px] font-semibold text-slate-700">
              {certificate.score}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <BlobButton
            variant="secondary"
            icon={<Eye size={15} />}
            className="flex-1"
            onClick={() => onView(certificate)}
          >
            View
          </BlobButton>

          <BlobButton
            variant="primary"
            icon={<Download size={15} />}
            className="flex-1"
          >
            Download
          </BlobButton>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function StudentCertificates() {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [selectedCertificate, setSelectedCertificate] =
    useState(null);

  const filteredCertificates = useMemo(() => {
    return certificates.filter((item) => {
      const searchText =
        `${item.course} ${item.category} ${item.certificateId}`.toLowerCase();

      const matchesSearch =
        !search ||
        searchText.includes(search.toLowerCase());

      const matchesCourse =
        course === "All Courses" ||
        item.course === course;

      return matchesSearch && matchesCourse;
    });
  }, [search, course]);

  const clearFilters = () => {
    setSearch("");
    setCourse("All Courses");
  };

  const latestCertificate = certificates[0];

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                <span>Student Dashboard</span>
                <span>/</span>
                <span className="font-medium text-slate-600">
                  Certificates
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  My Certificates
                </h1>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                  VERIFIED
                </span>
              </div>

              <p className="mt-1.5 text-sm text-slate-500">
                Manage your course completion certificates.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-3">
              <p className="text-[11px] text-emerald-600">
                Total Certificates
              </p>

              <p className="text-2xl font-black text-emerald-700">
                {certificates.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">

        {/* SUMMARY */}

        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          <SummaryCard
            icon={<Award size={19} />}
            label="Certificates"
            value={certificates.length}
            helper="Earned certificates"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <SummaryCard
            icon={<GraduationCap size={19} />}
            label="Completed Courses"
            value={certificates.length}
            helper="Successfully completed"
            iconClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            icon={<BadgeCheck size={19} />}
            label="Verified"
            value={
              certificates.filter(
                (x) => x.status === "Verified"
              ).length
            }
            helper="Verified certificates"
            iconClass="bg-purple-50 text-purple-600"
          />

          <SummaryCard
            icon={<FileBadge2 size={19} />}
            label="Latest Score"
            value={latestCertificate.score}
            helper={latestCertificate.course}
            iconClass="bg-amber-50 text-amber-600"
          />
        </section>

        {/* LATEST CERTIFICATE */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            {/* Certificate */}

            <div className="relative flex-1 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-1">
              <div className="rounded-xl border border-white bg-white p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Award size={22} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                        Nexvara Institute
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Certificate of Completion
                      </p>
                    </div>
                  </div>

                  <VerifiedBadge />
                </div>

                <div className="py-8 text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    This certificate is proudly presented to
                  </p>

                  <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                    Kuldeep Tiwari
                  </h2>

                  <div className="mx-auto mt-4 h-px w-20 bg-emerald-200" />

                  <p className="mt-5 text-xs text-slate-400">
                    For successfully completing
                  </p>

                  <h3 className="mt-2 text-xl font-black text-emerald-700">
                    {latestCertificate.course}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400">
                    Issued on {latestCertificate.issuedDate}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[9px] text-slate-400">
                      Certificate ID
                    </p>

                    <p className="mt-1 break-all text-[10px] font-bold text-slate-700">
                      {latestCertificate.certificateId}
                    </p>
                  </div>

                  <div className="text-left sm:text-center">
                    <p className="text-[9px] text-slate-400">
                      Score
                    </p>

                    <p className="mt-1 text-xs font-black text-emerald-600">
                      {latestCertificate.score}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-[9px] text-slate-400">
                      Grade
                    </p>

                    <p className="mt-1 text-xs font-black text-emerald-600">
                      {latestCertificate.grade}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="w-full lg:w-72">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                Latest Certificate
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                {latestCertificate.course}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your latest successfully completed course certificate
                is verified and ready to download.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span className="text-xs text-slate-400">
                    Completion
                  </span>

                  <span className="text-xs font-bold text-slate-700">
                    {latestCertificate.completionDate}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span className="text-xs text-slate-400">
                    Duration
                  </span>

                  <span className="text-xs font-bold text-slate-700">
                    {latestCertificate.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span className="text-xs text-slate-400">
                    Instructor
                  </span>

                  <span className="text-xs font-bold text-slate-700">
                    {latestCertificate.instructor}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <BlobButton
                  icon={<Download size={16} />}
                  className="w-full"
                >
                  Download Certificate
                </BlobButton>

                <BlobButton
                  variant="secondary"
                  icon={<Eye size={16} />}
                  className="w-full"
                  onClick={() =>
                    setSelectedCertificate(
                      latestCertificate
                    )
                  }
                >
                  View Certificate
                </BlobButton>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH */}

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search certificate or course..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="relative md:w-72">
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                {courses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </section>

        {/* ALL CERTIFICATES */}

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              All Certificates
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredCertificates.length} certificate
              {filteredCertificates.length !== 1
                ? "s"
                : ""}{" "}
              available.
            </p>
          </div>

          {filteredCertificates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCertificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  onView={setSelectedCertificate}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Award size={26} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                No certificates found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or course filter.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* VERIFICATION */}

        <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <ShieldCheck size={21} />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">
                Certificate Verification
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Every certificate contains a unique certificate ID
                that can be used to verify its authenticity.
              </p>
            </div>

            <BlobButton
              variant="blue"
              icon={<ShieldCheck size={15} />}
              className="w-full sm:w-auto"
            >
              Verify Certificate
            </BlobButton>
          </div>
        </section>
      </main>

      {/* ===================================================
          VIEW CERTIFICATE MODAL
      =================================================== */}

      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                  Certificate Preview
                </p>

                <h2 className="mt-1 text-base font-bold text-slate-900">
                  {selectedCertificate.course}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCertificate(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Certificate */}

            <div className="p-5 sm:p-8">
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-2">
                <div className="rounded-xl border border-white bg-white p-6 sm:p-10">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <Award size={28} />
                    </div>

                    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-600">
                      Nexvara Institute
                    </p>

                    <h2 className="mt-5 text-2xl font-black text-slate-900 sm:text-4xl">
                      Certificate of Completion
                    </h2>

                    <p className="mt-7 text-xs text-slate-400">
                      This certificate is proudly presented to
                    </p>

                    <h3 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                      Kuldeep Tiwari
                    </h3>

                    <div className="mx-auto mt-4 h-px w-24 bg-emerald-200" />

                    <p className="mt-6 text-xs text-slate-400">
                      for successfully completing
                    </p>

                    <p className="mt-2 text-xl font-black text-emerald-700 sm:text-2xl">
                      {selectedCertificate.course}
                    </p>

                    <p className="mx-auto mt-4 max-w-xl text-xs leading-5 text-slate-400">
                      The learner has successfully completed the
                      required course curriculum and demonstrated the
                      required learning outcomes.
                    </p>
                  </div>

                  <div className="mt-10 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-[9px] uppercase text-slate-400">
                        Certificate ID
                      </p>

                      <p className="mt-1 break-all text-[10px] font-bold text-slate-700">
                        {selectedCertificate.certificateId}
                      </p>
                    </div>

                    <div className="text-left sm:text-center">
                      <p className="text-[9px] uppercase text-slate-400">
                        Issued
                      </p>

                      <p className="mt-1 text-[10px] font-bold text-slate-700">
                        {selectedCertificate.issuedDate}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-[9px] uppercase text-slate-400">
                        Grade
                      </p>

                      <p className="mt-1 text-[10px] font-black text-emerald-600">
                        {selectedCertificate.grade}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <BlobButton
                  variant="secondary"
                  onClick={() =>
                    setSelectedCertificate(null)
                  }
                >
                  Close
                </BlobButton>

                <BlobButton
                  icon={<Download size={15} />}
                >
                  Download PDF
                </BlobButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}