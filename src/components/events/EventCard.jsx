const fmtDate = (iso) =>
  new Date(iso).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })

const fmtPrice = (price) =>
  Number(price) === 0
    ? 'Gratis'
    : Number(price).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

export default function EventCard({ event, onReserve }) {
  const soldOut = event.is_sold_out || event.available_spots === 0
  const lowStock =
    !soldOut && event.available_spots <= Math.ceil(event.total_capacity * 0.15)

  return (
    <div className="card h-100 border-0 shadow-sm event-card">
      {/* Color bar on top */}
      <div
        className={`rounded-top`}
        style={{
          height: 4,
          background: soldOut
            ? '#dc3545'
            : lowStock
            ? '#ffc107'
            : 'linear-gradient(90deg, #0d6efd, #6610f2)',
        }}
      />

      <div className="card-body d-flex flex-column p-4">
        {/* Event Code + sold-out badge */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <code className="text-muted small">{event.event_code}</code>
          {soldOut && (
            <span className="badge bg-danger">Agotado</span>
          )}
          {!soldOut && lowStock && (
            <span className="badge bg-warning text-dark">Últimos lugares</span>
          )}
        </div>

        {/* Name */}
        <h5 className="card-title fw-bold mb-1 text-dark">{event.name}</h5>

        {/* Date */}
        <p className="text-muted small mb-3">
          <span className="me-1">📅</span>
          {fmtDate(event.date)}
        </p>

        {/* Stats */}
        <div className="row g-2 mt-auto mb-3">
          <div className="col-6">
            <div className="bg-light rounded p-2 text-center">
              <div className="fw-bold text-primary fs-5">{fmtPrice(event.ticket_price)}</div>
              <div className="text-muted" style={{ fontSize: '0.7rem' }}>por boleto</div>
            </div>
          </div>
          <div className="col-6">
            <div className="bg-light rounded p-2 text-center">
              <div
                className={`fw-bold fs-5 ${
                  soldOut ? 'text-danger' : lowStock ? 'text-warning' : 'text-success'
                }`}
              >
                {event.available_spots}
              </div>
              <div className="text-muted" style={{ fontSize: '0.7rem' }}>disponibles</div>
            </div>
          </div>
        </div>

        {/* Reserve button */}
        <button
          className={`btn w-100 fw-semibold ${soldOut ? 'btn-secondary' : 'btn-primary'}`}
          disabled={soldOut}
          onClick={() => !soldOut && onReserve(event)}
        >
          {soldOut ? 'Agotado' : 'Reservar boletos'}
        </button>
      </div>
    </div>
  )
}
