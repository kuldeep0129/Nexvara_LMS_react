import { useCallback, useEffect, useMemo, useState } from "react";
import { studentService } from "../../services/student/studentService";

const read = (obj, camel, pascal, fallback = undefined) =>
  obj?.[camel] ?? obj?.[pascal] ?? fallback;

const getPayload = (response) =>
  read(response, "data", "Data", response);

// Normalize a single payment item from backend
const normalizePayment = (item) => {
  const amount = Number(read(item, "amount", "Amount", 0) || 0);
  const paidAtRaw = read(item, "paidAt", "PaidAt", null);

  let paidAt = null;
  if (paidAtRaw) {
    const parsed = new Date(paidAtRaw);
    if (!Number.isNaN(parsed.getTime())) paidAt = parsed;
  }

  return {
    id: read(item, "id", "Id"),
    enrollmentId: read(item, "enrollmentId", "EnrollmentId", null),
    amount,
    paymentGateway: read(item, "paymentGateway", "PaymentGateway", "—"),
    // Backend status can be "Success" / "Pending" / "Failed"
    status: normalizeStatus(read(item, "paymentStatus", "PaymentStatus", "")),
    transactionId: read(item, "transactionId", "TransactionId", "—"),
    paidAt,
    // Derived display fields
    dateLabel: paidAt
      ? paidAt.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—",
    timeLabel: paidAt
      ? paidAt.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",
  };
};

// Map backend status to UI status
const normalizeStatus = (status) => {
  const value = String(status || "").trim().toLowerCase();
  if (value === "success" || value === "paid" || value === "completed")
    return "Success";
  if (value === "pending" || value === "processing" || value === "initiated")
    return "Pending";
  if (value === "failed" || value === "cancelled" || value === "declined")
    return "Failed";
  // Unknown → Pending (safe default)
  return "Pending";
};

export const useStudentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  const fetchPayments = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const response = await studentService.getMyPayments({ signal });
      const payload = getPayload(response);

      const rawItems = Array.isArray(payload)
        ? payload
        : read(payload, "items", "Items", []);

      const safeItems = Array.isArray(rawItems) ? rawItems : [];
      setPayments(safeItems.map(normalizePayment));
    } catch (err) {
      if (err.name === "AbortError") return;
      setPayments([]);
      setError(err.message || "Unable to load payment history.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [refreshIndex]);

  useEffect(() => {
    const controller = new AbortController();
    fetchPayments(controller.signal);
    return () => controller.abort();
  }, [fetchPayments]);

  const refresh = useCallback(() => {
    setRefreshIndex((v) => v + 1);
  }, []);

  // -------- Derived Summary --------
  const summary = useMemo(() => {
    return payments.reduce(
      (acc, p) => {
        if (p.status === "Success") {
          acc.totalPaid += p.amount;
          acc.successful += 1;
        } else if (p.status === "Pending") {
          acc.pendingAmount += p.amount;
        } else if (p.status === "Failed") {
          acc.failed += 1;
        }
        acc.total += 1;
        return acc;
      },
      {
        totalPaid: 0,
        pendingAmount: 0,
        successful: 0,
        failed: 0,
        total: 0,
      }
    );
  }, [payments]);

  return {
    payments,
    summary,
    loading,
    error,
    refresh,
  };
};