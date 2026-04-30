function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{capitalize(status)}</span>;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default StatusBadge;
