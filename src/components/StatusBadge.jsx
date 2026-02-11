import './StatusBadge.css';

const STATUS_CONFIG = {
  pending: { label: 'Pending', className: 'status-badge--pending' },
  approved: { label: 'Approved', className: 'status-badge--approved' },
  rejected: { label: 'Rejected', className: 'status-badge--rejected' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
