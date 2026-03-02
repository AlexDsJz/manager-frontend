import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navLinkClass = ({ isActive }) =>
  `nav-link px-3 rounded ${isActive ? 'active bg-primary bg-opacity-25' : ''}`

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow-sm">
      <div className="container-fluid px-4">
        <NavLink to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded bg-primary text-white fw-bold"
            style={{ width: 28, height: 28, fontSize: 14 }}
          >
            M
          </span>
          Manager
        </NavLink>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav ms-auto gap-1 align-items-md-center">

            {/* Regular user → Eventos */}
            {user && !isAdmin && (
              <li className="nav-item">
                <NavLink to="/events" className={navLinkClass}>
                  Eventos
                </NavLink>
              </li>
            )}

            {/* Admin → Administrador */}
            {user && isAdmin && (
              <li className="nav-item">
                <NavLink to="/admin" className={navLinkClass}>
                  Administrador
                </NavLink>
              </li>
            )}

            {/* Both → SAT Lista 69 */}
            {user && (
              <li className="nav-item">
                <NavLink to="/sat" className={navLinkClass}>
                  SAT Lista 69
                </NavLink>
              </li>
            )}

            {/* User chip + logout */}
            {user && (
              <li className="nav-item d-flex align-items-center gap-2 ms-2">
                <span className="badge bg-secondary bg-opacity-75 fw-normal">
                  {user.username}
                  {isAdmin && (
                    <span className="ms-1 badge bg-warning text-dark" style={{ fontSize: '0.65rem' }}>
                      admin
                    </span>
                  )}
                </span>
                <button
                  className="btn btn-sm btn-outline-light py-0 px-2"
                  onClick={logout}
                  title="Cerrar sesión"
                >
                  Salir
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
