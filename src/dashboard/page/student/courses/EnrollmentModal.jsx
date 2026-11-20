import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { exploreCourseService } from "../../../services/exploreCourseService";

const money = (value) => {
  const num = Number(value);
  return num === 0 ? "Free" : `₹${num.toLocaleString("en-IN")}`;
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Load Razorpay script dynamically (fallback if not added to index.html)
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function EnrollmentModal({ course, onClose, onSuccess }) {
  const [step, setStep] = useState("confirm"); // 'confirm' | 'success'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const isFree =
    course.isFree ??
    course.IsFree ??
    Number(course.price ?? course.Price ?? 0) === 0;

  const batchId = course.batchId ?? course.BatchId;
  const courseId = course.courseId ?? course.CourseId;
  const batchName = course.batchName ?? course.BatchName ?? "Selected batch";
  const price = Number(course.price ?? course.Price ?? 0);

  /* ================================
     OPEN RAZORPAY CHECKOUT
  ================================= */
  const openRazorpayCheckout = async (data) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error(
        "Unable to load Razorpay. Please check your internet connection and try again."
      );
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: data.razorpayKeyId,
        amount: Math.round(Number(data.amount) * 100), // paise
        currency: data.currency || "INR",
        name: "Nexvara LMS",
        description: `Enrollment - ${batchName}`,
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          try {
            // ⚠️ Backend verification endpoint required
            await exploreCourseService.verifyPayment({
              enrollmentId: data.enrollmentId,
              paymentId: data.paymentId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            resolve({
              enrollmentId: data.enrollmentId,
              paymentStatus: "Paid",
            });
          } catch (err) {
            reject(
              new Error(
                err?.message ||
                  "Payment succeeded but verification failed. Please contact support with your payment reference."
              )
            );
          }
        },
        modal: {
          ondismiss: () => {
            reject(new Error("Payment cancelled. You can retry anytime."));
          },
        },
        theme: { color: "#7c3aed" },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (resp) => {
        reject(
          new Error(
            resp?.error?.description ||
              "Payment failed. Please try again."
          )
        );
      });

      razorpay.open();
    });
  };

  /* ================================
     MAIN ENROLL HANDLER
  ================================= */
  const handleEnroll = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const result = await exploreCourseService.enrollInBatch(
        batchId,
        courseId
      );
      const data = result?.data ?? result?.Data ?? {};

      const enrollmentId = data.enrollmentId ?? data.EnrollmentId;
      const paymentStatus = data.paymentStatus ?? data.PaymentStatus;
      const razorpayOrderId = data.razorpayOrderId ?? data.RazorpayOrderId;
      const razorpayKeyId = data.razorpayKeyId ?? data.RazorpayKeyId;
      const amount = data.amount ?? data.Amount;
      const currency = data.currency ?? data.Currency;
      const paymentId = data.paymentId ?? data.PaymentId;

      // ---- FREE COURSE ----
      if (isFree) {
        if (!enrollmentId) {
          throw new Error(
            "The server did not confirm your free enrollment. Please refresh and check your enrollment status."
          );
        }

        setStep("success");
        onSuccess({
          batchId,
          courseTitle: batchName,
          enrolledAt: new Date().toISOString(),
          paymentStatus: paymentStatus ?? "Free",
          enrollmentId,
        });
        return;
      }

      // ---- PAID COURSE ----
      if (!razorpayOrderId || !razorpayKeyId) {
        throw new Error(
          "Enrollment was created, but the payment order could not be initialized. Please check your enrollment status or contact support before retrying."
        );
      }

      const paymentResult = await openRazorpayCheckout({
        razorpayOrderId,
        razorpayKeyId,
        amount,
        currency,
        enrollmentId,
        paymentId,
      });

      setStep("success");
      onSuccess({
        batchId,
        courseTitle: batchName,
        enrolledAt: new Date().toISOString(),
        paymentStatus: paymentResult.paymentStatus || "Paid",
        enrollmentId: paymentResult.enrollmentId || enrollmentId,
      });
    } catch (error) {
      setApiError(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-white bg-white p-6 shadow-2xl sm:p-8"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-5 top-5 rounded-full bg-slate-100 p-2.5 text-slate-600 transition hover:bg-rose-100 hover:text-rose-600 outline-none focus:outline-none disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <AnimatePresence mode="wait" initial={false}>
          {/* 1. CONFIRMATION STEP */}
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-700">
                <Sparkles size={14} />{" "}
                {isFree ? "Free Enrollment" : "Batch Checkout"}
              </span>

              <h2 className="mt-4 pr-8 text-2xl font-black text-slate-900">
                {isFree
                  ? "Ready to start learning?"
                  : "Confirm your enrollment"}
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                You are about to enroll in{" "}
                <strong className="text-slate-800">{batchName}</strong>.{" "}
                {isFree
                  ? "No payment is required for this batch."
                  : "Please review the batch fee before proceeding."}
              </p>

              {/* Batch Info Card */}
              <div className="my-6 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Batch
                    </span>
                    <strong className="text-lg font-black text-slate-900">
                      {batchName}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Fee
                    </span>
                    <strong
                      className={`text-xl font-black ${
                        isFree ? "text-emerald-600" : "text-violet-700"
                      }`}
                    >
                      {money(price)}
                    </strong>
                  </div>
                </div>
                {(course.startDate ?? course.StartDate) && (
                  <div className="mt-4 flex items-center gap-2 border-t border-violet-100 pt-3 text-xs font-semibold text-slate-600">
                    <CalendarDays size={14} className="text-violet-500" />
                    Starts on{" "}
                    {formatDate(course.startDate ?? course.StartDate)}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {apiError && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-bold text-rose-600">
                  {apiError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl outline-none focus:outline-none disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />{" "}
                      Processing...
                    </>
                  ) : (
                    <>
                      {isFree
                        ? "Confirm Free Enrollment"
                        : "Proceed to Payment"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full rounded-xl py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 outline-none focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* 2. SUCCESS STEP */}
          {step === "success" && (
            <motion.div
              key="success"
              className="py-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { type: "spring", bounce: 0.5 } }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
              >
                <CheckCircle size={40} />
              </motion.div>

              <h2 className="mt-6 text-2xl font-black text-slate-900">
                Successfully Enrolled!
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                You have been successfully added to <br />
                <strong className="text-slate-800 text-base">{batchName}</strong>
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-bold text-white shadow-lg transition hover:bg-slate-800 outline-none focus:outline-none"
              >
                Go to My Courses <ArrowRight size={17} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}