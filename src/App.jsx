import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'
import AdminLogin from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ProtectedRoute from './pages/admin/ProtectedRoute'

export default function App() {
  return (
    <HelmetProvider>
      <Routes>
        {/* Admin — layout propio, sin Nav/Footer públicos */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Web pública */}
        <Route
          path="/*"
          element={
            <>
              <Nav />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalogo" element={<Catalogo />} />
                  <Route path="/nosotros" element={<Nosotros />} />
                  <Route path="/contacto" element={<Contacto />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </HelmetProvider>
  )
}
