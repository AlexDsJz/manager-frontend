import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { extractError } from '../api/utils'

export default function LoginView() {
  const { login, user, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  // Already logged in → redirect to the right place
  if (user) {
    navigate(isAdmin ? '/admin' : '/events', { replace: true })
    return null
  }

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!values.username || !values.password) return

    setLoading(true)
    try {
      await login(values.username, values.password)
      // AuthContext updates `user`; redirect handled by the effect above
      navigate(isAdmin ? '/admin' : '/events', { replace: true })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: extractError(err) || 'Usuario o contraseña incorrectos.',
        confirmButtonColor: '#dc3545',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', background: '#f4f6f9' }}
    >
      <div className="card border-0 shadow" style={{ width: '100%', maxWidth: 420 }}>
        {/* Header strip */}
        <div
          className="rounded-top"
          style={{ height: 5, background: 'linear-gradient(90deg, #0d6efd, #6610f2)' }}
        />

        <div className="card-body p-4 p-md-5">
          {/* Logo + title */}
          <div className="text-center mb-4">
            <span
              className="d-inline-flex align-items-center justify-content-center rounded bg-primary text-white fw-bold mb-3"
              style={{ width: 48, height: 48, fontSize: 22 }}
            >
              M
            </span>
            <h4 className="fw-bold mb-0">Manager</h4>
            <p className="text-muted small mt-1">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-medium">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                name="username"
                className="form-control"
                value={values.username}
                onChange={handleChange}
                autoFocus
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-medium">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-control"
                value={values.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading || !values.username || !values.password}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Verificando...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
