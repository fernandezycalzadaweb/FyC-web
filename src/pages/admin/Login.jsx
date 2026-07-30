import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseReady } from '../../lib/supabase'
import { MOCK_ACCOUNTS, saveSession } from '../../lib/auth'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (supabaseReady) {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) { setError('Credenciales incorrectas.'); return }
        nav('/admin/dashboard')
      } else {
        const acc = MOCK_ACCOUNTS.find(
          (a) => a.email === email && a.password === password
        )
        if (!acc) { setError('Credenciales incorrectas.'); return }
        saveSession({ email: acc.email, name: acc.name, permissions: acc.permissions })
        nav('/admin/dashboard')
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
        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#1D1D1F', color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, marginBottom: 14,
            }}
          >
            FC
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Acceso privado
          </h1>
          <p style={{ fontSize: 13.5, color: '#6E6E73', marginTop: 5 }}>
            Fernández y Calzada
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="field-label">Contraseña</label>
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p style={{ fontSize: 13.5, color: '#E0566E', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: 4 }}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
