import './PriorityBadge.css';

const PRIORITY_CONFIG = {
  low: { label: 'Low', className: 'priority-badge--low' },
  medium: { label: 'Medium', className: 'priority-badge--medium' },
  high: { label: 'High', className: 'priority-badge--high' },
};

export default function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;

  return (
    <span className={`priority-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
