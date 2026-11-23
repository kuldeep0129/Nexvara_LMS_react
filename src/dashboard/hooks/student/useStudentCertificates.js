import { useCallback, useEffect, useState } from "react";
import { studentService } from "../../services/student/studentService";

const pick = (obj, ...keys) => {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null) return obj[key];
  }
  return undefined;
};

const unwrapList = (response) => {
  const data = pick(response, "data", "Data") ?? response;
  if (Array.isArray(data)) return data;
  const items = pick(data, "items", "Items", "certificates", "Certificates");
  return Array.isArray(items) ? items : [];
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const normalizeCertificate = (item) => {
  const issuedAt = pick(item, "issuedAt", "IssuedAt");
  const isRevoked = Boolean(pick(item, "isRevoked", "IsRevoked"));
  return {
    id: pick(item, "id", "Id"),
    courseId: pick(item, "courseId", "CourseId"),
    course: pick(item, "courseName", "CourseName") || "Course completion",
    studentName: pick(item, "studentName", "StudentName") || "Student",
    certificateId: pick(item, "certificateNumber", "CertificateNumber") || "—",
    verificationCode: pick(item, "verificationCode", "VerificationCode") || "",
    issuedAt,
    issuedDate: formatDate(issuedAt),
    certificateUrl: pick(item, "certificateUrl", "CertificateUrl") || "",
    isRevoked,
    status: isRevoked ? "Revoked" : "Verified",
  };
};

export default function useStudentCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const response = await studentService.getMyCertificates({ signal });
      setCertificates(unwrapList(response).map(normalizeCertificate));
    } catch (err) {
      if (err?.name !== "AbortError") {
        setError(err?.message || "Unable to load certificates.");
        setCertificates([]);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  return { certificates, loading, error, refresh: () => refresh() };
}
