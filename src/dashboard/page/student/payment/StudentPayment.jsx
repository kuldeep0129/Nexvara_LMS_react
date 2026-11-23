// StudentPayments.jsx
import React, { useMemo, useState } from "react";
import {
  CreditCard,
  Wallet,
  CheckCircle2,
  Clock3,
  XCircle,
  Search,
  Download,
  Eye,
  Receipt,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  AlertCircle,
  Smartphone,
  Landmark,
  CreditCard as CardIcon,
  RefreshCcw,
  Loader2,
  Inbox,
} from "lucide-react";

import BlobButton from "../../../../ui/BlobButton.jsx";
import { useStudentPayments } from "../../../hooks/student/useStudentPayments.js"; // path adjust karein

/* -------------------- Helpers -------------------- */

const formatAmount = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

/* -------------------- Sub-components -------------------- */

function StatusBadge({ status }) {
  const config = {
    Success: {
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    Pending: {
      icon: Clock3,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    Failed: {
      icon: XCircle,
      className: "bg-rose-50 text-rose-700 border-rose-200",
    },
  };

  const item = config[status] || config.Pending;
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${item.className}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

// Gateway icon (Razorpay / Stripe etc.) — fallback to card icon
function GatewayIcon({ gateway }) {
  const g = String(gateway || "").toLowerCase();
  if (g.includes("upi")) return <Smartphone size={17} />;
  if (g.includes("bank")) return <Landmark size={17} />;
  return <CardIcon size={17} />;
}

function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
      <div className="h-3 w-20 rounded bg-slate-100" />
      <div className="mt-3 h-6 w-28 rounded bg-slate-100" />
      <div className="mt-3 h-2 w-32 rounded bg-slate-100" />
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="relative flex items-center gap-4 overflow-hidden border-b border-slate-100 px-5 py-4">
      <div className="h-3 w-32 rounded bg-slate-100" />
      <div className="h-3 w-24 rounded bg-slate-100" />
      <div className="h-3 w-16 rounded bg-slate-100" />
      <div className="h-3 w-20 rounded bg-slate-100" />
      <div className="h-6 w-16 rounded-full bg-slate-100" />
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}

function EmptyState({ hasFilters, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-14 text-center animate-fade-in-up">
      <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
        <Inbox size={28} />
      </div>
      <h3 className="mt-4 font-bold text-slate-800">
        No payments found
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        {hasFilters
          ? "Try changing your search or filter options."
          : "Aapki koi payment record abhi tak nahi mili."}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
        >
          <RefreshCcw size={14} /> Reset Filters
        </button>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-700 sm:text-right">
        {value || "—"}
      </span>
    </div>
  );
}

/* -------------------- Main Page -------------------- */

export default function StudentPayments() {
  const { payments, summary, loading, error, refresh } = useStudentPayments();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gatewayFilter, setGatewayFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 4;

  /* ---- Filter options derived from API data ---- */
  const gateways = useMemo(() => {
    return ["All", ...new Set(payments.map((p) => p.paymentGateway).filter(Boolean))];
  }, [payments]);

  /* ---- Filtered list ---- */
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        String(p.transactionId || "").toLowerCase().includes(q) ||
        String(p.paymentGateway || "").toLowerCase().includes(q) ||
        String(p.enrollmentId || "").includes(q);

      const matchesStatus =
        statusFilter === "All" || p.status === statusFilter;

      const matchesGateway =
        gatewayFilter === "All" || p.paymentGateway === gatewayFilter;

      return matchesSearch && matchesStatus && matchesGateway;
    });
  }, [payments, search, statusFilter, gatewayFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const paginatedPayments = filteredPayments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setGatewayFilter("All");
    setPage(1);
  };

  const downloadInvoice = (payment) => {
    // Production: GET /api/Student/Payments/{id}/invoice
    alert(`Invoice download started for ${payment.transactionId}`);
  };

  const hasFilters =
    search || statusFilter !== "All" || gatewayFilter !== "All";

  /* -------------------- Render -------------------- */

  return (
    <div className="min-h-screen bg-[#f6f8fb] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
              <span>Student Dashboard</span>
              <span>/</span>
              <span className="text-slate-700">Payments</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Payments
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Manage your course payments, transactions, invoices and pending
              payments from one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <div className="flex h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-medium text-emerald-700">
              <ShieldCheck size={17} />
              Secure Payments
            </div>
          </div>
        </div>

        {/* ERROR BANNER */}
        {error && !loading && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 animate-fade-in-up">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-rose-600" />
            <div>
              <p className="text-sm font-semibold text-rose-800">
                Could not load payments
              </p>
              <p className="mt-1 text-xs text-rose-600">{error}</p>
            </div>
            <button
              onClick={refresh}
              className="ml-auto shrink-0 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              Retry
            </button>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <SummaryCard
                label="Total Paid"
                value={formatAmount(summary.totalPaid)}
                hint="Across all successful payments"
                icon={<IndianRupee size={19} />}
                tone="blue"
                delay="0.05s"
              />
              <SummaryCard
                label="Pending Amount"
                value={formatAmount(summary.pendingAmount)}
                hint="Requires your attention"
                icon={<Clock3 size={19} />}
                tone="amber"
                delay="0.1s"
              />
              <SummaryCard
                label="Successful"
                value={summary.successful}
                hint="Completed transactions"
                icon={<CheckCircle2 size={19} />}
                tone="emerald"
                delay="0.15s"
              />
              <SummaryCard
                label="Failed"
                value={summary.failed}
                hint="Transactions requiring retry"
                icon={<XCircle size={19} />}
                tone="rose"
                delay="0.2s"
              />
            </>
          )}
        </div>

        {/* PENDING ALERT */}
        {!loading && summary.pendingAmount > 0 && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm animate-fade-in-up">
            <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <AlertCircle size={21} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900">Payment Pending</h3>
                    <StatusBadge status="Pending" />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Complete your pending payment to continue course access.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 lg:justify-end">
                <div>
                  <p className="text-xs text-slate-500">Amount Due</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatAmount(summary.pendingAmount)}
                  </p>
                </div>
                <BlobButton variant="primary">
                  <CreditCard size={17} />
                  Pay Now
                </BlobButton>
              </div>
            </div>
          </div>
        )}

        {/* FILTERS */}
        <div
          className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-fade-in-up"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Payment History</h3>
              <p className="text-xs text-slate-500">
                {loading
                  ? "Loading transactions..."
                  : `${filteredPayments.length} transaction(s) found`}
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <RefreshCcw size={14} />
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search transaction / gateway..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            {/* Gateway */}
            <select
              value={gatewayFilter}
              onChange={(e) => {
                setGatewayFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
            >
              {gateways.map((g) => (
                <option key={g} value={g}>
                  {g === "All" ? "All Gateways" : g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">Transaction</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Gateway</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6}>
                        <SkeletonRow />
                      </td>
                    </tr>
                  ))
                ) : paginatedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState hasFilters={hasFilters} onReset={resetFilters} />
                    </td>
                  </tr>
                ) : (
                  paginatedPayments.map((payment, idx) => (
                    <tr
                      key={payment.id}
                      className="transition hover:bg-slate-50/70 animate-fade-in-up"
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {payment.transactionId}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Enrollment #{payment.enrollmentId ?? "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-slate-900">
                          {formatAmount(payment.amount)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="rounded-lg bg-slate-100 p-1.5">
                            <GatewayIcon gateway={payment.paymentGateway} />
                          </span>
                          {payment.paymentGateway}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">
                          {payment.dateLabel}
                        </p>
                        <p className="text-xs text-slate-400">
                          {payment.timeLabel}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          {payment.status === "Success" && (
                            <button
                              onClick={() => downloadInvoice(payment)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                              title="Download Invoice"
                            >
                              <Download size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE CARDS */}
        <div className="mt-5 space-y-3 lg:hidden">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : paginatedPayments.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white">
              <EmptyState hasFilters={hasFilters} onReset={resetFilters} />
            </div>
          ) : (
            paginatedPayments.map((payment, idx) => (
              <div
                key={payment.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {payment.transactionId}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      Enrollment #{payment.enrollmentId ?? "—"}
                    </p>
                  </div>
                  <StatusBadge status={payment.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-slate-400">Amount</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatAmount(payment.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Gateway</p>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-700">
                      <GatewayIcon gateway={payment.paymentGateway} />
                      {payment.paymentGateway}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Date</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {payment.dateLabel}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Time</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {payment.timeLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition active:scale-[0.98]"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  {payment.status === "Success" && (
                    <button
                      onClick={() => downloadInvoice(payment)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-sm font-semibold text-blue-600 transition active:scale-[0.98]"
                    >
                      <Download size={16} />
                      Invoice
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {!loading && filteredPayments.length > 0 && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <b className="text-slate-700">
                {(page - 1) * pageSize + 1}
              </b>{" "}
              -{" "}
              <b className="text-slate-700">
                {Math.min(page * pageSize, filteredPayments.length)}
              </b>{" "}
              of <b className="text-slate-700">{filteredPayments.length}</b>{" "}
              payments
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
              </button>
              <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}

        {/* SECURITY NOTE */}
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 text-blue-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Your payments are secure
              </h4>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Payments are processed through a secure payment gateway. Nexvara
                does not store your complete card or UPI credentials. Always
                verify the transaction status before making another payment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT DETAIL MODAL */}
      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl animate-pop"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Payment Details
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {selectedPayment.transactionId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-2xl bg-slate-50 p-5 text-center">
                <p className="text-xs text-slate-500">Paid Amount</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {formatAmount(selectedPayment.amount)}
                </p>
                <div className="mt-3">
                  <StatusBadge status={selectedPayment.status} />
                </div>
              </div>

              <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                <DetailRow
                  label="Enrollment ID"
                  value={selectedPayment.enrollmentId}
                />
                <DetailRow
                  label="Payment Gateway"
                  value={selectedPayment.paymentGateway}
                />
                <DetailRow
                  label="Payment Date"
                  value={`${selectedPayment.dateLabel}, ${selectedPayment.timeLabel}`}
                />
                <DetailRow
                  label="Transaction ID"
                  value={selectedPayment.transactionId}
                />
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                {selectedPayment.status === "Success" && (
                  <BlobButton
                    variant="secondary"
                    className="flex-1 justify-center"
                    onClick={() => downloadInvoice(selectedPayment)}
                  >
                    <Download size={17} />
                    Download Invoice
                  </BlobButton>
                )}
                {selectedPayment.status === "Failed" && (
                  <BlobButton variant="primary" className="flex-1 justify-center">
                    <CreditCard size={17} />
                    Retry Payment
                  </BlobButton>
                )}
                {selectedPayment.status === "Pending" && (
                  <BlobButton variant="primary" className="flex-1 justify-center">
                    <Wallet size={17} />
                    Complete Payment
                  </BlobButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------- Summary Card Sub-component -------------------- */

function SummaryCard({ label, value, hint, icon, tone, delay }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            {value}
          </h2>
        </div>
        <div className={`rounded-xl p-2.5 ${tones[tone]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-xs text-slate-400">{hint}</p>
    </div>
  );
}