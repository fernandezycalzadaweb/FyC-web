// Permissions system — add new permissions here, add new accounts to MOCK_ACCOUNTS.
// When Supabase is connected, these mock accounts are bypassed and permissions
// come from the `profiles` table's permissions column (jsonb array).

export const PERMISSIONS = {
  CATALOGO_EDIT:  'catalogo.edit',
  MENSAJES_VIEW:  'mensajes.view',
  METRICAS_VIEW:  'metricas.view',
  CUENTAS_MANAGE: 'cuentas.manage',
}

export const MOCK_ACCOUNTS = [
  {
    email: 'admin@fernandezycalzada.com',
    password: 'admin',
    name: 'Alberto',
    permissions: [
      PERMISSIONS.CATALOGO_EDIT,
      PERMISSIONS.MENSAJES_VIEW,
      PERMISSIONS.METRICAS_VIEW,
      PERMISSIONS.CUENTAS_MANAGE,
    ],
  },
  {
    email: 'fyc@fernandezycalzada.com',
    password: 'fyc',
    name: 'Fernández y Calzada',
    permissions: [
      PERMISSIONS.CATALOGO_EDIT,
      PERMISSIONS.METRICAS_VIEW,
    ],
  },
]

export function getSession() {
  try {
    const raw = sessionStorage.getItem('fc_session')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveSession({ email, name, permissions }) {
  sessionStorage.setItem('fc_session', JSON.stringify({ email, name, permissions }))
}

export function clearSession() {
  sessionStorage.removeItem('fc_session')
}

export function hasPerm(session, perm) {
  return session?.permissions?.includes(perm) ?? false
}
