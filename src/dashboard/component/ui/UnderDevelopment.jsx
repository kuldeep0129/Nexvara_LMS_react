
import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Hammer,
  Code2,
  Rocket,
  ArrowLeft,
  Clock3,
  Layers3,
  CheckCircle2,
} from "lucide-react";

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 3, 0],
  },
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export default function UnderDevelopment({
  title = "Something Great Is Coming!",
  description = "We're currently working on this page to bring you a better experience. Our team is building something useful for your learning journey. Stay tuned!",
  subtitle = "PAGE UNDER DEVELOPMENT",
  onBack,
  showBackButton = false,
}) {
  return (
    <div className="relative flex min-h-[75vh] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-white via-violet-50/40 to-sky-50/60 px-4 py-12 sm:px-8">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-200/30 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-sky-200/40 blur-[100px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(#64748b 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-3xl text-center"
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-600" />
          </span>

          <span className="text-[10px] font-extrabold tracking-[0.16em] text-violet-700 sm:text-xs">
            {subtitle}
          </span>
        </motion.div>

        {/* Animated illustration */}
        <div className="relative mx-auto mt-10 flex h-64 w-full max-w-md items-center justify-center sm:h-72">

          {/* Main circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-52 w-52 rounded-full border border-dashed border-violet-200 sm:h-60 sm:w-60"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-64 w-64 rounded-full border border-sky-100 sm:h-72 sm:w-72"
          />

          {/* Central illustration */}
          <motion.div
            {...floatingAnimation}
            className="relative flex h-36 w-36 items-center justify-center rounded-[32px] border border-white bg-white shadow-[0_20px_70px_-20px_rgba(109,40,217,0.25)] sm:h-40 sm:w-40"
          >
            <div className="absolute inset-3 rounded-[25px] bg-gradient-to-br from-violet-50 to-sky-50" />

            <div className="relative flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200">
                <Hammer size={31} strokeWidth={1.8} />
              </div>

              <div className="mt-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
              </div>
            </div>
          </motion.div>

          {/* Floating development cards */}
          <motion.div
            {...floatingAnimation}
            transition={{
              ...floatingAnimation.transition,
              delay: 0.5,
            }}
            className="absolute left-2 top-9 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-100 bg-white text-violet-600 shadow-lg sm:left-6"
          >
            <Code2 size={22} />
          </motion.div>

          <motion.div
            {...floatingAnimation}
            transition={{
              ...floatingAnimation.transition,
              delay: 1,
            }}
            className="absolute right-2 top-12 flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-100 bg-white text-sky-600 shadow-lg sm:right-6"
          >
            <Rocket size={22} />
          </motion.div>

          <motion.div
            {...floatingAnimation}
            transition={{
              ...floatingAnimation.transition,
              delay: 1.5,
            }}
            className="absolute bottom-7 left-8 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-600 shadow-lg sm:left-12"
          >
            <CheckCircle2 size={20} />
          </motion.div>

          <motion.div
            {...floatingAnimation}
            transition={{
              ...floatingAnimation.transition,
              delay: 0.8,
            }}
            className="absolute bottom-8 right-8 flex h-11 w-11 items-center justify-center rounded-xl border border-amber-100 bg-white text-amber-500 shadow-lg sm:right-12"
          >
            <Sparkles size={20} />
          </motion.div>
        </div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            {description}
          </p>

          {/* Development status */}
          <div className="mx-auto mt-8 flex max-w-sm items-center gap-3 rounded-2xl border border-violet-100 bg-white/80 p-4 text-left shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Layers3 size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-slate-800">
                Our team is working on it
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Better features. Better experience.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-violet-600">
              <Clock3 size={15} />
              <span className="text-[10px] font-bold">Coming Soon</span>
            </div>
          </div>

          {/* Animated loading line */}
          <div className="mx-auto mt-7 h-1.5 w-44 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-500 to-sky-500"
              animate={{ x: [-90, 180, -90] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <p className="mt-3 text-[10px] font-semibold tracking-wide text-slate-400">
            CRAFTING SOMETHING BETTER FOR YOU
          </p>

          {showBackButton && (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBack}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
            >
              <ArrowLeft size={15} />
              Go Back
            </motion.button>
          )}
        </motion.div>

        {/* Footer */}
        <p className="mt-12 text-[10px] font-medium text-slate-400">
          Made with care by{" "}
          <span className="font-extrabold text-violet-600">
            Nexvara Technologies
          </span>
        </p>
      </motion.div>
    </div>
  );
}
