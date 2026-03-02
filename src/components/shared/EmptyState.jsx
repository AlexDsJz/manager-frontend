export default function EmptyState({ icon = '📋', title, description }) {
  return (
    <div className="text-center py-5 text-muted">
      <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>{icon}</div>
      <h5 className="mt-3 mb-1 fw-semibold">{title}</h5>
      {description && <p className="mb-0 small">{description}</p>}
    </div>
  )
}
