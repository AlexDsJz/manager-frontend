import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import Modal from '../shared/Modal'
import { useCreateReservation } from '../../hooks/useReservations'
import { extractError } from '../../api/utils'

const fmtPrice = (price) =>
  Number(price) === 0
    ? 'Gratis'
    : Number(price).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}
  if (!values.buyer_email.trim()) {
    errors.buyer_email = 'El correo es requerido.'
  } else if (!EMAIL_REGEX.test(values.buyer_email.trim())) {
    errors.buyer_email = 'Ingresa un correo electrónico válido.'
  }
  const count = Number(values.ticket_count)
  if (!values.ticket_count) {
    errors.ticket_count = 'La cantidad es requerida.'
  } else if (count < 1 || count > 5) {
    errors.ticket_count = 'Puedes reservar entre 1 y 5 boletos.'
  }
  return errors
}

export default function ReservationModal({ event, show, onHide }) {
  const [values, setValues] = useState({ buyer_email: '', ticket_count: '1' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const createReservation = useCreateReservation()

  useEffect(() => {
    if (show) {
      setValues({ buyer_email: '', ticket_count: '1' })
      setErrors({})
      setTouched({})
    }
  }, [show])

  if (!event) return null

  const total =
    Number(event.ticket_price) * Number(values.ticket_count || 0)

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) setErrors(validate({ ...values, [name]: value }))
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors(validate(values))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ buyer_email: true, ticket_count: true })
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    try {
      await createReservation.mutateAsync({
        event: event.id,
        buyer_email: values.buyer_email.trim().toLowerCase(),
        ticket_count: Number(values.ticket_count),
      })

      onHide()
      Swal.fire({
        icon: 'success',
        title: '¡Reserva exitosa!',
        html: `
          <p class="mb-1">Se reservaron <strong>${values.ticket_count} boleto(s)</strong> para:</p>
          <p class="fw-semibold text-primary mb-1">${event.name}</p>
          <p class="text-muted small mb-0">Confirmación enviada a <strong>${values.buyer_email}</strong></p>
        `,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0d6efd',
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al reservar',
        text: extractError(err),
        confirmButtonColor: '#dc3545',
      })
    }
  }

  const fieldClass = (name) => {
    if (!touched[name]) return 'form-control'
    return `form-control ${errors[name] ? 'is-invalid' : 'is-valid'}`
  }

  const maxTickets = Math.min(5, event.available_spots)

  return (
    <Modal show={show} onHide={onHide} title="Reservar boletos">
      {/* Event summary */}
      <div className="alert alert-primary d-flex gap-3 align-items-start py-3 mb-4">
        <span style={{ fontSize: '1.5rem' }}>🎫</span>
        <div>
          <div className="fw-bold">{event.name}</div>
          <div className="small text-muted">
            {new Date(event.date).toLocaleString('es-MX', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </div>
          <div className="small mt-1">
            <span className="me-2">Precio: <strong>{fmtPrice(event.ticket_price)}</strong></span>
            <span>Disponibles: <strong>{event.available_spots}</strong></span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="mb-3">
          <label htmlFor="buyer_email" className="form-label fw-medium">
            Correo electrónico <span className="text-danger">*</span>
          </label>
          <input
            id="buyer_email"
            type="email"
            name="buyer_email"
            className={fieldClass('buyer_email')}
            value={values.buyer_email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="ejemplo@correo.com"
            autoComplete="email"
          />
          {errors.buyer_email && touched.buyer_email && (
            <div className="invalid-feedback">{errors.buyer_email}</div>
          )}
        </div>

        {/* Ticket count */}
        <div className="mb-4">
          <label htmlFor="ticket_count" className="form-label fw-medium">
            Cantidad de boletos <span className="text-danger">*</span>
          </label>
          <input
            id="ticket_count"
            type="number"
            name="ticket_count"
            className={fieldClass('ticket_count')}
            value={values.ticket_count}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1"
            max={maxTickets}
            step="1"
          />
          {errors.ticket_count && touched.ticket_count ? (
            <div className="invalid-feedback">{errors.ticket_count}</div>
          ) : (
            <div className="form-text text-muted">Máximo 5 boletos por compra.</div>
          )}
        </div>

        {/* Total */}
        {Number(event.ticket_price) > 0 && (
          <div className="d-flex justify-content-between align-items-center bg-light rounded p-3 mb-4">
            <span className="text-muted">Total estimado</span>
            <span className="fw-bold fs-5 text-primary">
              {total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
            </span>
          </div>
        )}

        <div className="d-flex gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onHide}
            disabled={createReservation.isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary px-4"
            disabled={createReservation.isPending}
          >
            {createReservation.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Procesando...
              </>
            ) : (
              'Confirmar reserva'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
