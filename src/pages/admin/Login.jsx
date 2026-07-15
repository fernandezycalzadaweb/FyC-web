import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseReady } from '../../lib/supabase'
import { MOCK_ACCOUNTS, saveSession } from '../../lib/auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (supabaseReady) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (authError) throw new Error('Credenciales incorrectas.')
      } else {
        // Modo mock: desarrollo sin Supabase
        const account = MOCK_ACCOUNTS.find(
          (a) => a.email === form.email && a.password === form.password
        )
        if (!account) throw new Error('Credenciales incorrectas.')
        saveSession(account)
      }
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-deep flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-[7px] bg-leaf flex items-center justify-center text-paper font-serif font-bold text-lg mx-auto mb-4 select-none">
            FC
          </div>
          <p className="font-serif text-[15px] font-medium text-paper/80">Fernández y Calzada</p>
          <p className="mono-label text-[9.5px] text-paper/30 mt-1">Panel privado</p>
        </div>

        <div className="bg-card rounded-[5px] p-8 border border-mist/20">
          <h1 className="font-serif text-[20px] font-semibold mb-6 text-ink">Acceso</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="mono-label text-[10px] text-leaf-dark/70">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="px-3.5 py-2.5 rounded-[3px] border border-mist bg-white text-[14px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf/30 transition-colors"
                placeholder="usuario@fernandezycalzada.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="mono-label text-[10px] text-leaf-dark/70">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                className="px-3.5 py-2.5 rounded-[3px] border border-mist bg-white text-[14px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf/30 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-[12.5px] text-rust border border-rust/20 bg-rust/5 rounded-[3px] px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center mt-2 disabled:opacity-60"
            >
              {loading ? 'Accediendo…' : 'Entrar'}
            </button>
          </form>

          {!supabaseReady && (
            <p className="mono-label text-[9px] text-ink/35 text-center mt-5">
              Modo desarrollo · Supabase no conectado
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
