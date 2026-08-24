import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'
import AdminLogin from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ProtectedRoute from './pages/admin/ProtectedRoute'
import AvisoLegal from './pages/AvisoLegal'
import Privacidad from './pages/Privacidad'
import Cookies from './pages/Cookies'
import Producto from './pages/Producto'
import QuienesSomos from './pages/QuienesSomos'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <HelmetProvider>
      <ScrollToTop />
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
                  <Route path="/catalogo/:slug" element={<Producto />} />
                  <Route path="/nosotros" element={<Nosotros />} />
                  <Route path="/quienes-somos" element={<QuienesSomos />} />
                  <Route path="/contacto" element={<Contacto />} />
                  <Route path="/aviso-legal" element={<AvisoLegal />} />
                  <Route path="/privacidad" element={<Privacidad />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
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
