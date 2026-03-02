import { NavLink } from 'react-router-dom'

export default function Navbar() {
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
          <ul className="navbar-nav ms-auto gap-1">
            <li className="nav-item">
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `nav-link px-3 rounded ${isActive ? 'active bg-primary bg-opacity-25' : ''}`
                }
              >
                Eventos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nav-link px-3 rounded ${isActive ? 'active bg-primary bg-opacity-25' : ''}`
                }
              >
                Administrador
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/sat"
                className={({ isActive }) =>
                  `nav-link px-3 rounded ${isActive ? 'active bg-primary bg-opacity-25' : ''}`
                }
              >
                SAT Lista 69
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
