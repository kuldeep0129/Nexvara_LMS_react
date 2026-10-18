import api from './api.js';

export async function getActiveAnnouncements(signal) {
  const response = await api.get(
    '/WebstiteUI/active-Anouncement',
    { signal }
  );

  const result = response.data;

  // API response: { data: {...}, success: false, message: "..." }
  // Screenshot mein HTTP status 200 hai, isliye success:false
  // ko akela failure nahi maana jayega.
  const items = result?.data;

  if (!items) {
    return [];
  }

  const announcements = Array.isArray(items)
    ? items
    : [items];

  return announcements.filter(
    (item) =>
      item &&
      item.isActive !== false &&
      item.status?.toLowerCase() !== 'expired'
  );
}