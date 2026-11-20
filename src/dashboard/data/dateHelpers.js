// Timezone-safe date/time helpers for API strings like "2026-10-30T00:00:00"

// Parse API date string -> local Date object (no timezone shift)
export const parseApiDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, y, m, d] = match;
  return new Date(Number(y), Number(m) - 1, Number(d));
};

// "2026-10-30T00:00:00" -> "2026-10-30"  (for <input type="date">)
export const toInputDate = (dateStr) => {
  if (!dateStr) return '';
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : '';
};

// "2026-10-30T00:00:00" -> "30 Oct 2026"  (for display)
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = parseApiDate(dateStr);
  if (!d) return 'N/A';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// "2026-10-30" (from input) -> "2026-10-30T00:00:00"  (for API payload)
export const toApiDate = (inputDateStr) => {
  if (!inputDateStr) return null;
  return `${inputDateStr}T00:00:00`;
};

// "02:35:00" -> "2:35 AM"  (for display)
export const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  const [hour, minute] = timeString.split(':');
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHour = h % 12 || 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

// "HH:mm" (from input) -> "HH:mm:ss"  (for API payload)
export const toApiTime = (timeStr) => {
  if (!timeStr) return '00:00:00';
  return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
};

// "02:35:00" -> "02:35"  (for <input type="time">)
export const toInputTime = (timeStr) => {
  if (!timeStr) return '09:00';
  return timeStr.length >= 5 ? timeStr.substring(0, 5) : timeStr;
};