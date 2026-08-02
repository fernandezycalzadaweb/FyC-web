import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseReady } from '../../lib/supabase'
import { MOCK_ACCOUNTS, saveSession } from '../../lib/auth'

const ADMIN_EMAIL = 'admin@fernandezycalzada.com'

export default function Login() {
  const nav = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (supabaseReady) {
        const { data, error: authErr } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password })
        if (authErr || !data.user) {
          setError('Contraseña incorrecta.')
          return
        }

        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('role, nombre')
          .eq('id', data.user.id)
          .single()

        if (profileErr) {
          setError('No se pudo leer el perfil de usuario.')
          await supabase.auth.signOut()
          return
        }

        saveSession({ email: data.user.email, name: profile.nombre ?? data.user.email, role: profile.role })
        nav('/admin')
      } else {
        const acc = MOCK_ACCOUNTS.find((a) => a.email === ADMIN_EMAIL && a.password === password)
        if (!acc) {
          setError('Contraseña incorrecta.')
          return
        }
        saveSession({ email: acc.email, name: acc.name, role: acc.role })
        nav('/admin')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '24px',
        background: '#FBFBFD',
      }}
    >
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img
            src="/logo-fc.png"
            alt="Fernández y Calzada"
            style={{ height: 32, width: 'auto', display: 'block', margin: '0 auto 16px' }}
          />
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Acceso privado
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="field-label">Contraseña</label>
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              autoFocus
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p style={{ fontSize: 13.5, color: '#E0566E', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: 4, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
