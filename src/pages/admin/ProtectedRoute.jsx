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
      <div style={{ minHeight: '100vh', background: '#FBFBFD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.08)', borderTopColor: '#1D1D1F', animation: 'spin 0.7s linear infinite' }} />
      </div>
    )
  }

  return authed ? children : <Navigate to="/admin/login" replace />
}
