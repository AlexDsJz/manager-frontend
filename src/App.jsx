import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/shared/Navbar'
import ProtectedRoute from './components/shared/ProtectedRoute'
import LoginView from './views/LoginView'
import AdminView from './views/AdminView'
import UserView from './views/UserView'
import SATView from './views/SATView'

function RootRedirect() {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={isAdmin ? '/admin' : '/events'} replace />
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginView />} />

          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <UserView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sat"
            element={
              <ProtectedRoute>
                <SATView />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </main>
    </>
  )
}
