import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  X,
  CheckCircle,
  CreditCard,
  GraduationCap,
  Sparkles,
  Users,
  SlidersHorizontal,
  ChevronDown,
  Laptop,
  BadgeCheck,
  Flame,
  RotateCcw,
} from "lucide-react";

/* =========================================================
   DEMO COURSE DATA
========================================================= */

const courses = [
  {
    id: 1,
    title: ".NET Full Stack Development",
    category: "Development",
    description:
      "Learn C#, ASP.NET Core, SQL Server and React through practical projects.",
    duration: "16 Weeks",
    level: "Intermediate",
    price: 0,
    rating: 4.9,
    reviews: 128,
    seatsLeft: 8,
    mode: "Online",
    color: "violet",
    skills: ["C#", "ASP.NET Core", "SQL Server"],
  },
  {
    id: 2,
    title: "React & Next.js",
    category: "Development",
    description:
      "Build modern responsive applications using React and Next.js.",
    duration: "10 Weeks",
    level: "Beginner+",
    price: 4999,
    rating: 4.8,
    reviews: 96,
    seatsLeft: 5,
    mode: "Hybrid",
    color: "blue",
    skills: ["React", "Next.js", "JavaScript"],
  },
  {
    id: 3,
    title: "AI & Machine Learning",
    category: "AI & ML",
    description:
      "Explore AI fundamentals and develop practical machine learning projects.",
    duration: "14 Weeks",
    level: "Intermediate",
    price: 7999,
    rating: 4.9,
    reviews: 84,
    seatsLeft: 12,
    mode: "Online",
    color: "pink",
    skills: ["Python", "Machine Learning", "AI"],
  },
  {
    id: 4,
    title: "Data Analytics",
    category: "Analytics",
    description:
      "Learn SQL, Excel, Power BI and data visualization techniques.",
    duration: "12 Weeks",
    level: "Beginner",
    price: 0,
    rating: 4.7,
    reviews: 73,
    seatsLeft: 3,
    mode: "Offline",
    color: "orange",
    skills: ["SQL", "Excel", "Power BI"],
  },
  {
    id: 5,
    title: "Cloud & DevOps",
    category: "Cloud",
    description:
      "Understand cloud infrastructure, deployment and CI/CD workflows.",
    duration: "8 Weeks",
    level: "Beginner+",
    price: 3499,
    rating: 4.6,
    reviews: 61,
    seatsLeft: 16,
    mode: "Online",
    color: "cyan",
    skills: ["Cloud", "Docker", "CI/CD"],
  },
  {
    id: 6,
    title: "Python Programming",
    category: "Development",
    description:
      "Start programming with Python and build your coding foundation.",
    duration: "6 Weeks",
    level: "Beginner",
    price: 0,
    rating: 4.8,
    reviews: 112,
    seatsLeft: 10,
    mode: "Hybrid",
    color: "green",
    skills: ["Python", "OOP", "Projects"],
  },
];

const categories = [
  "All Courses",
  "Development",
  "AI & ML",
  "Analytics",
  "Cloud",
];

const money = (value) =>
  value === 0 ? "Free" : `₹${value.toLocaleString("en-IN")}`;

const courseGradients = {
  violet: "from-violet-100 via-purple-100 to-indigo-100",
  blue: "from-sky-100 via-blue-100 to-indigo-100",
  pink: "from-pink-100 via-rose-100 to-purple-100",
  orange: "from-amber-100 via-orange-100 to-yellow-100",
  cyan: "from-cyan-100 via-teal-100 to-sky-100",
  green: "from-emerald-100 via-green-100 to-teal-100",
};

const courseAccent = {
  violet: "text-violet-600",
  blue: "text-blue-600",
  pink: "text-pink-600",
  orange: "text-orange-600",
  cyan: "text-cyan-600",
  green: "text-emerald-600",
};

/* =========================================================
   REUSABLE FILTER SELECT
========================================================= */

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block min-w-0 text-xs font-extrabold tracking-wide text-slate-600">
      {label}

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* =========================================================
   ENROLLMENT MODAL
========================================================= */

function EnrollmentModal({ course, onClose, onSuccess }) {
  const [step, setStep] = useState("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // FIX: Escape key + body scroll lock
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const finish = () => {
    onSuccess({
      courseId: course.id,
      courseTitle: course.title,
      enrolledAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Enroll in ${course.title}`}
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/70 bg-white p-5 shadow-2xl sm:p-7"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close enrollment"
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-rose-100 hover:text-rose-600"
        >
          <X size={18} />
        </button>

        <AnimatePresence mode="wait" initial={false}>
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-700">
                <GraduationCap size={14} />
                Course enrollment
              </span>

              <h2 className="mt-4 pr-8 text-2xl font-black text-slate-900">
                Start learning today
              </h2>

              <p className="mt-1 text-sm text-slate-500">{course.title}</p>

              <div className="my-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-violet-50 to-cyan-50 p-4">
                <span className="text-sm font-semibold text-slate-600">
                  Course fee
                </span>

                <strong className="text-xl font-black text-slate-900">
                  {money(course.price)}
                </strong>
              </div>

              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  setStep(course.price > 0 ? "payment" : "success");
                }}
              >
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Full name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />

                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Mobile number"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Continue
                  <ArrowRight size={17} />
                </button>
              </form>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                DEMO MODE
              </span>

              <h2 className="mt-3 text-2xl font-black text-slate-900">
                Demo payment
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                No real transaction will occur. This is only a frontend demo.
              </p>

              <div className="my-5 flex items-center gap-3 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-cyan-50 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                  <CreditCard size={20} />
                </div>

                <div>
                  <span className="block text-sm font-bold text-slate-800">
                    UPI / Card Demo
                  </span>
                  <span className="text-xs text-slate-500">
                    Demo checkout
                  </span>
                </div>

                <strong className="ml-auto text-lg font-black">
                  {money(course.price)}
                </strong>
              </div>

              <button
                type="button"
                onClick={() => setStep("success")}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-200 transition hover:brightness-110"
              >
                Simulate Payment Success
              </button>

              <button
                type="button"
                onClick={() => setStep("form")}
                className="mt-3 w-full rounded-xl py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
              >
                Back to enrollment
              </button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              className="py-5 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle size={34} />
              </div>

              <h2 className="mt-4 text-2xl font-black text-slate-900">
                You're enrolled!
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {course.price
                  ? "Demo payment completed."
                  : "Your free enrollment is confirmed."}
              </p>

              <button
                type="button"
                onClick={finish}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-200 transition hover:brightness-110"
              >
                Go to My Courses
                <ArrowRight size={17} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   EXPLORE COURSES
========================================================= */

export default function ExploreCourses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Courses");
  const [priceFilter, setPriceFilter] = useState("all");
  const [enrollmentFilter, setEnrollmentFilter] = useState("all");
  const [level, setLevel] = useState("all");
  const [mode, setMode] = useState("all");
  const [sort, setSort] = useState("popular");

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [enrolled, setEnrolled] = useState([]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses
      .filter((course) => {
        const matchesSearch =
          !query ||
          [
            course.title,
            course.description,
            course.category,
            ...course.skills,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query);

        const matchesCategory =
          category === "All Courses" || course.category === category;

        const matchesPrice =
          priceFilter === "all" ||
          (priceFilter === "free" && course.price === 0) ||
          (priceFilter === "paid" && course.price > 0);

        const matchesLevel = level === "all" || course.level === level;

        const matchesMode = mode === "all" || course.mode === mode;

        const isEnrolled = enrolled.some(
          (item) => item.courseId === course.id
        );

        const matchesEnrollment =
          enrollmentFilter === "all" ||
          (enrollmentFilter === "enrolled" && isEnrolled) ||
          (enrollmentFilter === "not-enrolled" && !isEnrolled);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesPrice &&
          matchesLevel &&
          matchesMode &&
          matchesEnrollment
        );
      })
      .sort((a, b) => {
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;

        return b.reviews - a.reviews;
      });
  }, [
    search,
    category,
    priceFilter,
    enrollmentFilter,
    level,
    mode,
    sort,
    enrolled,
  ]);

  const handleSuccess = (result) => {
    setEnrolled((previous) => [
      result,
      ...previous.filter((item) => item.courseId !== result.courseId),
    ]);
  };

  // FIX: stable close handler so modal effect doesn't re-run every render
  const closeModal = useCallback(() => setSelected(null), []);

  const reset = () => {
    setSearch("");
    setCategory("All Courses");
    setPriceFilter("all");
    setEnrollmentFilter("all");
    setLevel("all");
    setMode("all");
    setSort("popular");
    setFiltersOpen(false); // FIX: panel bhi band
  };

  const activeFilterCount = [
    category !== "All Courses",
    priceFilter !== "all",
    enrollmentFilter !== "all",
    level !== "all",
    mode !== "all",
  ].filter(Boolean).length;

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-violet-50/40 text-slate-900">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative isolate overflow-hidden border-b border-violet-100 bg-gradient-to-br from-violet-50 via-white to-cyan-50">
        <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl sm:h-96 sm:w-96" />

        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-[11px] font-bold tracking-[.16em] text-violet-700 shadow-sm">
              <Sparkles size={14} />
              YOUR NEXT SKILL STARTS HERE
            </span>

            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Explore Courses.
              <br />

              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Unlock Your Potential.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Learn from mentors, practice with real projects, and build skills
              that move your career forward.
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 sm:gap-5">
              {[
                ["6+", "Learning Tracks"],
                ["Project", "Based Learning"],
                ["Flexible", "Learning Modes"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm backdrop-blur sm:p-4"
                >
                  <strong className="block text-lg font-black text-slate-900 sm:text-2xl">
                    {value}
                  </strong>

                  <span className="mt-1 block text-[11px] text-slate-500 sm:text-xs">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* HERO VISUAL */}

          <motion.div
            className="relative mx-auto flex min-h-56 w-full max-w-md items-center justify-center sm:min-h-72"
            initial={{ opacity: 0, scale: 0.85, rotate: 4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute h-52 w-52 rounded-full border border-violet-200 bg-gradient-to-br from-violet-200/70 to-cyan-100/70 shadow-[0_0_100px_rgba(139,92,246,.15)] sm:h-64 sm:w-64" />

            <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white bg-gradient-to-br from-violet-100 to-cyan-100 text-violet-600 shadow-xl sm:h-40 sm:w-40">
              <GraduationCap size={66} />
            </div>

            <motion.div
              className="absolute left-0 top-6 flex items-center gap-2 rounded-2xl border border-white bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Star size={15} className="text-amber-500" />
              Mentor-led learning
            </motion.div>

            <motion.div
              className="absolute bottom-5 right-0 flex items-center gap-2 rounded-2xl border border-white bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur"
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
            >
              <CheckCircle size={15} className="text-emerald-500" />
              Build real projects
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          COURSE CATALOG
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-extrabold tracking-[.18em] text-violet-600">
              COURSE CATALOG
            </span>

            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Find your learning path
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Choose a course that fits your goals and start building.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm">
            <BookOpen size={19} className="text-violet-600" />

            <strong className="text-lg">{filteredCourses.length}</strong>

            <span className="text-sm text-slate-500">
              courses available
            </span>
          </div>
        </div>

        {/* SEARCH / FILTER / SORT */}

        <div className="mt-7 flex flex-col gap-3 lg:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
            <Search size={19} className="shrink-0 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courses, skills..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            aria-expanded={filtersOpen}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
          >
            <SlidersHorizontal size={17} className="text-violet-600" />

            Filters

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}

            <ChevronDown
              size={15}
              className={`transition ${filtersOpen ? "rotate-180" : ""}`}
            />
          </button>

          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
            <span className="whitespace-nowrap text-slate-500">Sort:</span>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="min-w-0 flex-1 bg-transparent font-semibold text-slate-800 outline-none"
            >
              <option value="popular">Most popular</option>
              <option value="rating">Top rated</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        {/* FILTER PANEL */}

        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              key="filter-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-4 sm:p-5">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-extrabold tracking-wide text-slate-600">
                      COURSE FEE
                    </span>

                    <span className="text-[11px] text-slate-400">
                      Select price
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "All", value: "all" },
                      { label: "Free", value: "free" },
                      { label: "Paid", value: "paid" },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.value}
                        onClick={() => setPriceFilter(item.value)}
                        className={`rounded-xl px-3 py-3 text-sm font-bold transition ${
                          priceFilter === item.value
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <FilterSelect
                    label="ENROLLMENT STATUS"
                    value={enrollmentFilter}
                    onChange={setEnrollmentFilter}
                    options={[
                      { label: "All Courses", value: "all" },
                      { label: "Enrolled", value: "enrolled" },
                      { label: "Not Enrolled", value: "not-enrolled" },
                    ]}
                  />

                  <FilterSelect
                    label="LEVEL"
                    value={level}
                    onChange={setLevel}
                    options={[
                      { label: "All levels", value: "all" },
                      { label: "Beginner", value: "Beginner" },
                      { label: "Beginner+", value: "Beginner+" },
                      { label: "Intermediate", value: "Intermediate" },
                    ]}
                  />

                  <FilterSelect
                    label="LEARNING MODE"
                    value={mode}
                    onChange={setMode}
                    options={[
                      { label: "All modes", value: "all" },
                      { label: "Online", value: "Online" },
                      { label: "Offline", value: "Offline" },
                      { label: "Hybrid", value: "Hybrid" },
                    ]}
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <RotateCcw size={14} />
                    Clear all filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CATEGORY CHIPS */}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                category === item
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* ACTIVE FILTER SUMMARY */}

        {(category !== "All Courses" ||
          priceFilter !== "all" ||
          enrollmentFilter !== "all" ||
          level !== "all" ||
          mode !== "all" ||
          search) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Active:
            </span>

            {category !== "All Courses" && (
              <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700">
                {category}
              </span>
            )}

            {priceFilter !== "all" && (
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                {priceFilter === "free" ? "Free" : "Paid"}
              </span>
            )}

            {enrollmentFilter !== "all" && (
              <span className="rounded-full bg-cyan-100 px-3 py-1.5 text-xs font-bold text-cyan-700">
                {enrollmentFilter === "enrolled"
                  ? "Enrolled"
                  : "Not Enrolled"}
              </span>
            )}

            {level !== "all" && (
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
                {level}
              </span>
            )}

            {mode !== "all" && (
              <span className="rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700">
                {mode}
              </span>
            )}

            {search && (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                Search: {search}
              </span>
            )}

            <button
              type="button"
              onClick={reset}
              className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
            >
              <X size={13} />
              Clear
            </button>
          </div>
        )}

        {/* COURSE CARDS */}

        {filteredCourses.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course, index) => {
              const isEnrolled = enrolled.some(
                (item) => item.courseId === course.id
              );

              const low = course.seatsLeft <= 5;

              const tone =
                courseGradients[course.color] || courseGradients.violet;

              const accent =
                courseAccent[course.color] || courseAccent.violet;

              return (
                // FIX: `layout` / `whileHover` / `exit` hata diye.
                // Hover ab pure CSS se hota hai, isliye re-render aur
                // background-tab par koi flicker/hide nahi hoga.
                <motion.article
                  key={course.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: Math.min(index, 6) * 0.04,
                  }}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70"
                >
                  {/* CARD HEADER */}

                  <div
                    className={`relative overflow-hidden bg-gradient-to-br ${tone} p-5 sm:p-6`}
                  >
                    <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/50 transition-transform duration-500 group-hover:scale-125" />

                    <div className="relative flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white bg-white/80 shadow-sm ${accent}`}
                      >
                        <BookOpen size={25} />
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold tracking-wider ${
                          course.price === 0
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-violet-100 text-violet-700"
                        }`}
                      >
                        {course.price === 0 ? "FREE COURSE" : "PAID COURSE"}
                      </span>
                    </div>

                    <div className="relative mt-6 flex items-center justify-between gap-2">
                      <span className="rounded-full border border-white/80 bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {course.category}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700">
                        <Star
                          size={14}
                          fill="currentColor"
                          className="text-amber-500"
                        />

                        {course.rating}

                        <span className="font-medium text-slate-500">
                          ({course.reviews})
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* CARD BODY */}

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-lg font-extrabold leading-snug text-slate-900 sm:text-xl">
                      {course.title}
                    </h3>

                    <p className="mt-2 min-h-[3rem] text-sm leading-6 text-slate-500">
                      {course.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {course.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={14} className="text-violet-500" />
                        {course.duration}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap size={14} className="text-violet-500" />
                        {course.level}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Laptop size={14} className="text-violet-500" />
                        {course.mode}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 font-semibold ${
                          low ? "text-rose-600" : "text-slate-500"
                        }`}
                      >
                        <Users size={14} />
                        {course.seatsLeft} seats left
                      </span>
                    </div>

                    <div
                      className={`mt-3 flex items-center gap-1.5 text-[11px] font-bold ${
                        low ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      {low ? (
                        <>
                          <Flame size={14} />
                          Filling fast
                        </>
                      ) : (
                        <>
                          <BadgeCheck size={14} />
                          Enrollment open
                        </>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <strong className="text-xl font-black text-slate-900">
                          {money(course.price)}
                        </strong>

                        {course.price > 0 && (
                          <small className="mt-0.5 block text-[10px] text-slate-400">
                            one-time fee
                          </small>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelected(course)}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition sm:text-sm ${
                          isEnrolled
                            ? "border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200 hover:brightness-110"
                        }`}
                      >
                        {isEnrolled ? "Enrolled" : "Enroll Now"}

                        {isEnrolled ? (
                          <CheckCircle size={15} />
                        ) : (
                          <ArrowRight size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50 via-white to-cyan-50 px-5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-500 shadow-sm">
              <Search size={27} />
            </div>

            <h3 className="mt-4 text-lg font-extrabold text-slate-900">
              No courses found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search or update your filters.
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:brightness-110"
            >
              <RotateCcw size={15} />
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* BOTTOM CTA */}

      <section className="relative mx-4 mb-10 overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-cyan-50 px-5 py-8 shadow-sm sm:mx-6 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-7xl">
        <div className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full bg-violet-200/50 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-extrabold tracking-[.16em] text-violet-600">
              START YOUR JOURNEY
            </span>

            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              Your future starts with one course.
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Explore a skill, practice it, and build something amazing.
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-extrabold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:brightness-110 sm:self-center"
          >
            Browse Courses
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* MODAL */}

      <AnimatePresence>
        {selected && (
          <EnrollmentModal
            key={selected.id}
            course={selected}
            onClose={closeModal}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </main>
  );
}