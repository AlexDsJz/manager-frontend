export default function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="d-flex align-items-center justify-content-center py-5 gap-3">
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: '2rem', height: '2rem' }}
      >
        <span className="visually-hidden">Cargando</span>
      </div>
      <span className="text-muted fs-6">{text}</span>
    </div>
  )
}
