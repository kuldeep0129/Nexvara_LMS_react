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
  CalendarDays,
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
} from "lucide-react";

import BlobButton from "../../../../ui/BlobButton.jsx";

const PAYMENTS = [
  {
    id: 1,
    transactionId: "NXV-TXN-2026-001284",
    course: "ASP.NET Core Web API",
    batch: "Backend Pro Batch - 01",
    amount: 14999,
    status: "Success",
    method: "UPI",
    date: "20 Oct 2026",
    time: "10:42 AM",
    invoice: "INV-2026-001284",
    paymentGateway: "Razorpay",
    paidFor: "Course Enrollment",
    receiptEmail: "kuldeep@example.com",
  },
  {
    id: 2,
    transactionId: "NXV-TXN-2026-001167",
    course: "React Advanced",
    batch: "Frontend Mastery - 03",
    amount: 9999,
    status: "Success",
    method: "Credit Card",
    date: "05 Oct 2026",
    time: "03:18 PM",
    invoice: "INV-2026-001167",
    paymentGateway: "Razorpay",
    paidFor: "Course Enrollment",
    receiptEmail: "kuldeep@example.com",
  },
  {
    id: 3,
    transactionId: "NXV-TXN-2026-000982",
    course: "Interview Preparation",
    batch: "Placement Booster - 02",
    amount: 4999,
    status: "Pending",
    method: "UPI",
    date: "28 Sep 2026",
    time: "11:25 AM",
    invoice: "INV-2026-000982",
    paymentGateway: "Razorpay",
    paidFor: "Course Enrollment",
    receiptEmail: "kuldeep@example.com",
  },
  {
    id: 4,
    transactionId: "NXV-TXN-2026-000871",
    course: "Full Stack Development",
    batch: "Full Stack Pro - 01",
    amount: 19999,
    status: "Failed",
    method: "Debit Card",
    date: "18 Sep 2026",
    time: "05:42 PM",
    invoice: "INV-2026-000871",
    paymentGateway: "Razorpay",
    paidFor: "Course Enrollment",
    receiptEmail: "kuldeep@example.com",
  },
  {
    id: 5,
    transactionId: "NXV-TXN-2026-000752",
    course: "SQL & Database Mastery",
    batch: "Database Pro - 01",
    amount: 5999,
    status: "Success",
    method: "Net Banking",
    date: "02 Sep 2026",
    time: "01:10 PM",
    invoice: "INV-2026-000752",
    paymentGateway: "Razorpay",
    paidFor: "Course Enrollment",
    receiptEmail: "kuldeep@example.com",
  },
  {
    id: 6,
    transactionId: "NXV-TXN-2026-000624",
    course: "Git & GitHub",
    batch: "Developer Essentials",
    amount: 2499,
    status: "Success",
    method: "UPI",
    date: "20 Aug 2026",
    time: "09:20 AM",
    invoice: "INV-2026-000624",
    paymentGateway: "Razorpay",
    paidFor: "Course Enrollment",
    receiptEmail: "kuldeep@example.com",
  },
];

const PENDING_PAYMENT = {
  course: "Interview Preparation",
  batch: "Placement Booster - 02",
  amount: 4999,
  dueDate: "30 Sep 2026",
};

const formatAmount = (amount) =>
  `₹${amount.toLocaleString("en-IN")}`;

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

function PaymentMethodIcon({ method }) {
  if (method === "UPI") {
    return <Smartphone size={17} />;
  }

  if (method === "Net Banking") {
    return <Landmark size={17} />;
  }

  return <CardIcon size={17} />;
}

export default function StudentPayments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [page, setPage] = useState(1);

  const pageSize = 4;

  const courses = useMemo(() => {
    return ["All", ...new Set(PAYMENTS.map((item) => item.course))];
  }, []);

  const filteredPayments = useMemo(() => {
    return PAYMENTS.filter((payment) => {
      const matchesSearch =
        payment.course.toLowerCase().includes(search.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(search.toLowerCase()) ||
        payment.invoice.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" || payment.method === methodFilter;

      const matchesCourse =
        courseFilter === "All" || payment.course === courseFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod &&
        matchesCourse
      );
    });
  }, [search, statusFilter, methodFilter, courseFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / pageSize)
  );

  const paginatedPayments = filteredPayments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPaid = PAYMENTS.filter(
    (p) => p.status === "Success"
  ).reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = PAYMENTS.filter(
    (p) => p.status === "Pending"
  ).reduce((sum, p) => sum + p.amount, 0);

  const successfulPayments = PAYMENTS.filter(
    (p) => p.status === "Success"
  ).length;

  const failedPayments = PAYMENTS.filter(
    (p) => p.status === "Failed"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setMethodFilter("All");
    setCourseFilter("All");
    setPage(1);
  };

  const downloadInvoice = (payment) => {
    // Production:
    // window.open(`/api/student/payments/${payment.id}/invoice`, "_blank");

    alert(`Invoice download started: ${payment.invoice}`);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              Manage your course payments, transactions, invoices and
              pending payments from one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-medium text-emerald-700">
              <ShieldCheck size={17} />
              Secure Payments
            </div>
          </div>
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Paid
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  {formatAmount(totalPaid)}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <IndianRupee size={19} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Across all successful payments
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Pending Amount
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  {formatAmount(pendingAmount)}
                </h2>
              </div>

              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <Clock3 size={19} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Requires your attention
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Successful
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  {successfulPayments}
                </h2>
              </div>

              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <CheckCircle2 size={19} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Completed transactions
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Failed
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  {failedPayments}
                </h2>
              </div>

              <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
                <XCircle size={19} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Transactions requiring retry
            </p>
          </div>
        </div>

        {/* =====================================================
            PENDING PAYMENT
        ====================================================== */}
        {pendingAmount > 0 && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <AlertCircle size={21} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900">
                      Payment Pending
                    </h3>

                    <StatusBadge status="Pending" />
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Complete your payment to continue your course access.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span>
                      Course:{" "}
                      <b className="text-slate-700">
                        {PENDING_PAYMENT.course}
                      </b>
                    </span>

                    <span>
                      Batch:{" "}
                      <b className="text-slate-700">
                        {PENDING_PAYMENT.batch}
                      </b>
                    </span>

                    <span>
                      Due:{" "}
                      <b className="text-slate-700">
                        {PENDING_PAYMENT.dueDate}
                      </b>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 lg:justify-end">
                <div>
                  <p className="text-xs text-slate-500">Amount Due</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatAmount(PENDING_PAYMENT.amount)}
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

        {/* =====================================================
            FILTER SECTION
        ====================================================== */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">
                Payment History
              </h3>

              <p className="text-xs text-slate-500">
                View and manage all your transactions.
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

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
                placeholder="Search transaction..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            {/* Course */}
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white"
            >
              {courses.map((course) => (
                <option key={course}>{course}</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white"
            >
              <option>All</option>
              <option>Success</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>

            {/* Method */}
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white"
            >
              <option>All</option>
              <option>UPI</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Net Banking</option>
            </select>
          </div>
        </div>

        {/* =====================================================
            DESKTOP TABLE
        ====================================================== */}
        <div className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">Transaction</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {paginatedPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {payment.transactionId}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {payment.invoice}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {payment.course}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {payment.batch}
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
                          <PaymentMethodIcon method={payment.method} />
                        </span>
                        {payment.method}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700">
                        {payment.date}
                      </p>
                      <p className="text-xs text-slate-400">
                        {payment.time}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={payment.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setSelectedPayment(payment)
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>

                        {payment.status === "Success" && (
                          <button
                            onClick={() =>
                              downloadInvoice(payment)
                            }
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                            title="Download Invoice"
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedPayments.length === 0 && (
            <EmptyState />
          )}
        </div>

        {/* =====================================================
            MOBILE CARDS
        ====================================================== */}
        <div className="mt-5 space-y-3 lg:hidden">

          {paginatedPayments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {payment.course}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    {payment.transactionId}
                  </p>
                </div>

                <StatusBadge status={payment.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">

                <div>
                  <p className="text-[11px] text-slate-400">
                    Amount
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatAmount(payment.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-slate-400">
                    Payment Method
                  </p>

                  <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-700">
                    <PaymentMethodIcon method={payment.method} />
                    {payment.method}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {payment.date}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-slate-400">
                    Invoice
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {payment.invoice}
                  </p>
                </div>

              </div>

              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">

                <button
                  onClick={() => setSelectedPayment(payment)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600"
                >
                  <Eye size={16} />
                  View Details
                </button>

                {payment.status === "Success" && (
                  <button
                    onClick={() => downloadInvoice(payment)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-sm font-semibold text-blue-600"
                  >
                    <Download size={16} />
                    Invoice
                  </button>
                )}

              </div>
            </div>
          ))}

          {paginatedPayments.length === 0 && (
            <EmptyState />
          )}
        </div>

        {/* =====================================================
            PAGINATION
        ====================================================== */}
        {filteredPayments.length > 0 && (
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
              of{" "}
              <b className="text-slate-700">
                {filteredPayments.length}
              </b>{" "}
              payments
            </p>

            <div className="flex items-center gap-2">

              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
              </button>

              <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600">
                {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={17} />
              </button>

            </div>
          </div>
        )}

        {/* =====================================================
            SECURITY INFO
        ====================================================== */}
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
                Payments are processed through a secure payment gateway.
                Nexvara does not store your complete card or UPI credentials.
                Always verify the transaction status before making another
                payment.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* =======================================================
          PAYMENT DETAIL MODAL
      ======================================================== */}
      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >

            {/* Modal Header */}
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

              {/* Amount */}
              <div className="rounded-2xl bg-slate-50 p-5 text-center">
                <p className="text-xs text-slate-500">
                  Paid Amount
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {formatAmount(selectedPayment.amount)}
                </p>

                <div className="mt-3">
                  <StatusBadge status={selectedPayment.status} />
                </div>
              </div>

              {/* Details */}
              <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200">

                <DetailRow
                  label="Course"
                  value={selectedPayment.course}
                />

                <DetailRow
                  label="Batch"
                  value={selectedPayment.batch}
                />

                <DetailRow
                  label="Payment Method"
                  value={selectedPayment.method}
                />

                <DetailRow
                  label="Payment Date"
                  value={`${selectedPayment.date}, ${selectedPayment.time}`}
                />

                <DetailRow
                  label="Invoice Number"
                  value={selectedPayment.invoice}
                />

                <DetailRow
                  label="Payment Gateway"
                  value={selectedPayment.paymentGateway}
                />

                <DetailRow
                  label="Paid For"
                  value={selectedPayment.paidFor}
                />

                <DetailRow
                  label="Receipt Email"
                  value={selectedPayment.receiptEmail}
                />

              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">

                {selectedPayment.status === "Success" && (
                  <BlobButton
                    variant="secondary"
                    className="flex-1 justify-center"
                    onClick={() =>
                      downloadInvoice(selectedPayment)
                    }
                  >
                    <Download size={17} />
                    Download Invoice
                  </BlobButton>
                )}

                {selectedPayment.status === "Failed" && (
                  <BlobButton
                    variant="primary"
                    className="flex-1 justify-center"
                  >
                    <CreditCard size={17} />
                    Retry Payment
                  </BlobButton>
                )}

                {selectedPayment.status === "Pending" && (
                  <BlobButton
                    variant="primary"
                    className="flex-1 justify-center"
                  >
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

/* ============================================================
   HELPERS
============================================================ */

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-xs text-slate-400">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-700 sm:text-right">
        {value}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
      <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
        <Receipt size={28} />
      </div>

      <h3 className="mt-4 font-bold text-slate-800">
        No payments found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Try changing your search or filter options.
      </p>
    </div>
  );
}