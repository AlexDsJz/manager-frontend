import { useState } from 'react'
import Swal from 'sweetalert2'
import EventForm from '../components/events/EventForm'
import EventTable from '../components/events/EventTable'
import Modal from '../components/shared/Modal'
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useEvents'
import { extractError } from '../api/utils'

export default function AdminView() {
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading } = useEvents(search ? { search } : {})
  const events = data?.results ?? []

  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()

  // ── Handlers ──────────────────────────────────────────────────────────────

  function openCreate() {
    setEditingEvent(null)
    setShowModal(true)
  }

  function openEdit(event) {
    setEditingEvent(event)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingEvent(null)
  }

  async function handleSubmit(payload) {
    try {
      if (editingEvent) {
        await updateEvent.mutateAsync({ id: editingEvent.id, data: payload })
        Swal.fire({
          icon: 'success',
          title: 'Evento actualizado',
          text: `"${payload.name}" fue actualizado correctamente.`,
          timer: 2500,
          showConfirmButton: false,
        })
      } else {
        await createEvent.mutateAsync(payload)
        Swal.fire({
          icon: 'success',
          title: 'Evento creado',
          text: `"${payload.name}" está listo para recibir reservas.`,
          timer: 2500,
          showConfirmButton: false,
        })
      }
      closeModal()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: extractError(err),
        confirmButtonColor: '#dc3545',
      })
    }
  }

  async function handleDelete(event) {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar evento?',
      html: `
        <p class="mb-1">Se eliminará <strong>"${event.name}"</strong>.</p>
        <p class="text-muted small mb-0">Esta acción no se puede deshacer.</p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    })

    if (!result.isConfirmed) return

    try {
      await deleteEvent.mutateAsync(event.id)
      Swal.fire({
        icon: 'success',
        title: 'Evento eliminado',
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo eliminar',
        text: extractError(err),
        confirmButtonColor: '#dc3545',
      })
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    setSearch(searchInput.trim())
  }

  function clearSearch() {
    setSearchInput('')
    setSearch('')
  }

  const isMutating = createEvent.isPending || updateEvent.isPending

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="container-xl py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-0">Gestión de Eventos</h2>
          <p className="text-muted mb-0 small">
            {data?.count ?? 0} evento(s) registrado(s)
          </p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreate}>
          <span>＋</span>
          Nuevo Evento
        </button>
      </div>

      {/* Search bar */}
      <form className="d-flex gap-2 mb-4" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o código..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ maxWidth: 360 }}
        />
        <button type="submit" className="btn btn-outline-primary">
          Buscar
        </button>
        {search && (
          <button type="button" className="btn btn-outline-secondary" onClick={clearSearch}>
            Limpiar
          </button>
        )}
      </form>

      {/* Table card */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <EventTable
            events={events}
            isLoading={isLoading}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        show={showModal}
        onHide={closeModal}
        title={editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
        size="lg"
      >
        <EventForm
          initialValues={editingEvent}
          onSubmit={handleSubmit}
          isLoading={isMutating}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  )
}
