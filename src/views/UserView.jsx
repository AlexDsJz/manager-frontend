import { useState } from 'react'
import EventCard from '../components/events/EventCard'
import ReservationModal from '../components/reservations/ReservationModal'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import EmptyState from '../components/shared/EmptyState'
import { useEvents } from '../hooks/useEvents'

export default function UserView() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [ordering, setOrdering] = useState('date')

  const { data, isLoading, isError } = useEvents({
    ...(search && { search }),
    ordering,
  })

  const events = data?.results ?? []

  function handleSearch(e) {
    e.preventDefault()
    setSearch(searchInput.trim())
  }

  function clearSearch() {
    setSearchInput('')
    setSearch('')
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="container-xl py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Eventos Disponibles</h2>
        <p className="text-muted mb-0 small">
          Explora los eventos y reserva tus boletos en segundos.
        </p>
      </div>

      {/* Filters bar */}
      <div className="d-flex flex-column flex-sm-row gap-2 mb-4">
        <form className="d-flex gap-2 flex-grow-1" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar evento..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-primary flex-shrink-0">
            Buscar
          </button>
          {search && (
            <button
              type="button"
              className="btn btn-outline-secondary flex-shrink-0"
              onClick={clearSearch}
            >
              ✕
            </button>
          )}
        </form>

        <select
          className="form-select flex-shrink-0"
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          style={{ maxWidth: 220 }}
          aria-label="Ordenar por"
        >
          <option value="date">Ordenar: Fecha ↑</option>
          <option value="-date">Ordenar: Fecha ↓</option>
          <option value="ticket_price">Precio ↑</option>
          <option value="-ticket_price">Precio ↓</option>
          <option value="-available_spots">Más disponibles</option>
        </select>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner text="Cargando eventos..." />
      ) : isError ? (
        <div className="alert alert-danger">
          Error al conectar con el servidor. Verifica que el backend esté activo.
        </div>
      ) : !events.length ? (
        <EmptyState
          icon="🎭"
          title={search ? 'Sin resultados' : 'No hay eventos aún'}
          description={
            search
              ? `No se encontraron eventos para "${search}".`
              : 'Próximamente se publicarán nuevos eventos.'
          }
        />
      ) : (
        <>
          <p className="text-muted small mb-3">{data?.count ?? 0} evento(s)</p>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {events.map((event) => (
              <div key={event.id} className="col">
                <EventCard event={event} onReserve={setSelectedEvent} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Reservation modal */}
      <ReservationModal
        event={selectedEvent}
        show={Boolean(selectedEvent)}
        onHide={() => setSelectedEvent(null)}
      />
    </div>
  )
}
