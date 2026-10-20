export default function StatusBadge({ status }) {
  const styles = {
    Active: 'bg-green-100 text-green-700 border-green-200',
    Upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
    Completed: 'bg-gray-100 text-gray-700 border-gray-200',
    Inactive: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${styles[status] || styles.Inactive}`}>
      {status}
    </span>
  );
}