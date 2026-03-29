const colors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  IN_REVIEW: 'bg-blue-100 text-blue-800',
};
export default function StatusBadge({ status }) {
  return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status]||''}`}>{status}</span>;
}
