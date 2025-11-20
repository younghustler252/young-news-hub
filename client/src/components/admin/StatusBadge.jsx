const StatusBadge = ({ status }) => {
  const statusMap = {
    active: { text: "Active", color: "green" },
    banned: { text: "Banned", color: "red" },
    approved: { text: "Approved", color: "green" },
    rejected: { text: "Rejected", color: "red" },
    pending: { text: "Pending", color: "gray" },
  };

  const { text, color } = statusMap[status] || { text: status, color: "gray" };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full border flex items-center gap-1 bg-${color}-50 border-${color}-200 text-${color}-700`}
    >
      {text}
    </span>
  );
};
export default StatusBadge;
