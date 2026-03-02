/**
 * Extracts a human-readable error message from an Axios error.
 * Handles DRF field errors, non_field_errors, and generic error keys.
 */
export function extractError(err) {
  if (!err.response) {
    return 'Error de conexión. Verifica que el servidor esté activo.'
  }

  const { data } = err.response

  if (typeof data === 'string') return data
  if (data?.error) return data.error
  if (data?.detail) return data.detail

  // DRF field-level validation errors: { field: ['msg', ...], ... }
  if (typeof data === 'object') {
    const lines = Object.entries(data).map(([field, msgs]) => {
      const arr = Array.isArray(msgs) ? msgs : [String(msgs)]
      const label = field === 'non_field_errors' ? '' : `${field}: `
      return `${label}${arr.join(', ')}`
    })
    if (lines.length) return lines.join('\n')
  }

  return `Error ${err.response.status}`
}
