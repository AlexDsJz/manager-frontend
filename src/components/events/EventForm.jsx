import { useState, useEffect } from 'react'

const EVENT_CODE_REGEX = /^EVT-\d{4}-[A-Z]{2}$/

const EMPTY = {
  event_code: '',
  name: '',
  date: '',
  total_capacity: '',
  ticket_price: '',
}

function validate(values) {
  const errors = {}

  if (!values.event_code.trim()) {
    errors.event_code = 'El código es requerido.'
  } else if (!EVENT_CODE_REGEX.test(values.event_code.trim().toUpperCase())) {
    errors.event_code = 'Formato: EVT-AAAA-XX  (4 dígitos + 2 letras mayúsculas). Ej: EVT-2024-MX'
  }

  if (!values.name.trim()) {
    errors.name = 'El nombre es requerido.'
  } else if (values.name.trim().length < 5) {
    errors.name = 'Mínimo 5 caracteres.'
  } else if (values.name.trim().length > 100) {
    errors.name = 'Máximo 100 caracteres.'
  }

  if (!values.date) {
    errors.date = 'La fecha y hora son requeridas.'
  } else if (new Date(values.date) <= new Date()) {
    errors.date = 'La fecha debe ser futura.'
  }

  const cap = Number(values.total_capacity)
  if (values.total_capacity === '') {
    errors.total_capacity = 'La capacidad es requerida.'
  } else if (!Number.isInteger(cap) || cap <= 0) {
    errors.total_capacity = 'Debe ser un entero mayor a 0.'
  }

  const price = Number(values.ticket_price)
  if (values.ticket_price === '') {
    errors.ticket_price = 'El precio es requerido.'
  } else if (isNaN(price) || price < 0) {
    errors.ticket_price = 'El precio no puede ser negativo.'
  }

  return errors
}

/** Convert ISO date string from API to datetime-local input value */
function toDateLocal(isoStr) {
  const d = new Date(isoStr)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16)
}

export default function EventForm({ initialValues = null, onSubmit, isLoading, onCancel }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Populate form when editing an existing event
  useEffect(() => {
    if (initialValues) {
      setValues({
        event_code: initialValues.event_code,
        name: initialValues.name,
        date: toDateLocal(initialValues.date),
        total_capacity: String(initialValues.total_capacity),
        ticket_price: String(initialValues.ticket_price),
      })
    } else {
      setValues(EMPTY)
    }
    setErrors({})
    setTouched({})
  }, [initialValues])

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, ...validate({ ...values, [name]: value }) }))
    }
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors(validate(values))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const allTouched = Object.keys(EMPTY).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    onSubmit({
      event_code: values.event_code.trim().toUpperCase(),
      name: values.name.trim(),
      date: new Date(values.date).toISOString(),
      total_capacity: Number(values.total_capacity),
      ticket_price: parseFloat(Number(values.ticket_price).toFixed(2)),
    })
  }

  const fieldClass = (name) => {
    if (!touched[name]) return 'form-control'
    return `form-control ${errors[name] ? 'is-invalid' : 'is-valid'}`
  }

  const minDate = new Date(Date.now() + 60_000).toISOString().slice(0, 16)

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        {/* Event Code */}
        <div className="col-md-6">
          <label htmlFor="event_code" className="form-label fw-medium">
            Código de Evento <span className="text-danger">*</span>
          </label>
          <input
            id="event_code"
            type="text"
            name="event_code"
            className={fieldClass('event_code')}
            value={values.event_code}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="EVT-2024-MX"
            autoComplete="off"
          />
          {errors.event_code && touched.event_code ? (
            <div className="invalid-feedback">{errors.event_code}</div>
          ) : (
            <div className="form-text text-muted">Formato: EVT-AAAA-XX</div>
          )}
        </div>

        {/* Name */}
        <div className="col-md-6">
          <label htmlFor="name" className="form-label fw-medium">
            Nombre <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            className={fieldClass('name')}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Concierto de Navidad"
            maxLength={100}
          />
          {errors.name && touched.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
          <div className="form-text text-muted text-end">{values.name.length}/100</div>
        </div>

        {/* Date */}
        <div className="col-md-4">
          <label htmlFor="date" className="form-label fw-medium">
            Fecha y Hora <span className="text-danger">*</span>
          </label>
          <input
            id="date"
            type="datetime-local"
            name="date"
            className={fieldClass('date')}
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
            min={minDate}
          />
          {errors.date && touched.date && (
            <div className="invalid-feedback">{errors.date}</div>
          )}
        </div>

        {/* Capacity */}
        <div className="col-md-4">
          <label htmlFor="total_capacity" className="form-label fw-medium">
            Capacidad Total <span className="text-danger">*</span>
          </label>
          <input
            id="total_capacity"
            type="number"
            name="total_capacity"
            className={fieldClass('total_capacity')}
            value={values.total_capacity}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1"
            step="1"
          />
          {errors.total_capacity && touched.total_capacity && (
            <div className="invalid-feedback">{errors.total_capacity}</div>
          )}
        </div>

        {/* Ticket Price */}
        <div className="col-md-4">
          <label htmlFor="ticket_price" className="form-label fw-medium">
            Precio por Boleto <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              id="ticket_price"
              type="number"
              name="ticket_price"
              className={fieldClass('ticket_price')}
              value={values.ticket_price}
              onChange={handleChange}
              onBlur={handleBlur}
              min="0"
              step="0.01"
            />
            {errors.ticket_price && touched.ticket_price && (
              <div className="invalid-feedback">{errors.ticket_price}</div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
        {onCancel && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary px-4" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Guardando...
            </>
          ) : initialValues ? (
            'Actualizar Evento'
          ) : (
            'Crear Evento'
          )}
        </button>
      </div>
    </form>
  )
}
