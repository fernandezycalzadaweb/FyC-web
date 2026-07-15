import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase, supabaseReady } from '../../lib/supabase'

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (supabaseReady) {
      supabase.auth.getSession().then(({ data }) => {
        setAuthed(!!data.session)
        setChecking(false)
      })
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setAuthed(!!session)
      })
      return () => listener.subscription.unsubscribe()
    } else {
      const mock = sessionStorage.getItem('fc_session')
      setAuthed(!!mock)
      setChecking(false)
    }
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-ink-deep flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-gold/40 border-t-gold animate-spin" />
      </div>
    )
  }

  return authed ? children : <Navigate to="/admin/login" replace />
}
