import LoadingSpinner from '../shared/LoadingSpinner'
import EmptyState from '../shared/EmptyState'

const fmtDate = (iso) =>
  new Date(iso).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

const fmtPrice = (price) =>
  Number(price).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

export default function EventTable({ events = [], isLoading, onEdit, onDelete }) {
  if (isLoading) return <LoadingSpinner text="Cargando eventos..." />

  if (!events.length) {
    return (
      <EmptyState
        icon="🗓️"
        title="Sin eventos"
        description="Crea el primer evento con el botón de arriba."
      />
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th className="text-center">Capacidad</th>
            <th className="text-center">Disponibles</th>
            <th className="text-end">Precio</th>
            <th className="text-center">Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>
                <code className="text-primary small">{event.event_code}</code>
              </td>
              <td className="fw-medium">{event.name}</td>
              <td className="text-muted small">{fmtDate(event.date)}</td>
              <td className="text-center">{event.total_capacity}</td>
              <td className="text-center">
                <span
                  className={`badge rounded-pill ${
                    event.available_spots === 0
                      ? 'bg-danger'
                      : event.available_spots <= event.total_capacity * 0.2
                      ? 'bg-warning text-dark'
                      : 'bg-success'
                  }`}
                >
                  {event.available_spots}
                </span>
              </td>
              <td className="text-end">{fmtPrice(event.ticket_price)}</td>
              <td className="text-center">
                {event.is_sold_out ? (
                  <span className="badge bg-danger">Agotado</span>
                ) : (
                  <span className="badge bg-success">Disponible</span>
                )}
              </td>
              <td className="text-center">
                <div className="d-flex gap-1 justify-content-center">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEdit(event)}
                    title="Editar evento"
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(event)}
                    title="Eliminar evento"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
