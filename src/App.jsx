import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import AdminView from './views/AdminView'
import UserView from './views/UserView'
import SATView from './views/SATView'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<UserView />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/sat" element={<SATView />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/events" replace />} />
        </Routes>
      </main>
    </>
  )
}
