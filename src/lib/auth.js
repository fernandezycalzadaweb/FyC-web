export const ROLES = {
  ADMINISTRADOR: 'administrador',
  EMPRESA: 'empresa',
}

// Mock accounts — only used when Supabase is not configured
export const MOCK_ACCOUNTS = [
  { email: 'admin@fernandezycalzada.com', password: 'admin', name: 'Alberto',             role: ROLES.ADMINISTRADOR },
  { email: 'fyc@fernandezycalzada.com',   password: 'fyc',   name: 'Fernández y Calzada', role: ROLES.EMPRESA },
]

// features: 'catalogo' | 'mensajes' | 'metricas' | 'cuentas'
// administrador: everything
// empresa: catalogo + metricas only
export function canAccess(session, feature) {
  if (!session?.role) return false
  if (session.role === ROLES.ADMINISTRADOR) return true
  if (session.role === ROLES.EMPRESA) return feature === 'catalogo' || feature === 'metricas'
  return false
}

export function getSession() {
  try {
    const raw = sessionStorage.getItem('fc_session')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveSession({ email, name, role }) {
  sessionStorage.setItem('fc_session', JSON.stringify({ email, name, role }))
}

export function clearSession() {
  sessionStorage.removeItem('fc_session')
}
