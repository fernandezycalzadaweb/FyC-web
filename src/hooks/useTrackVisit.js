import { useEffect } from 'react'
import { supabase, supabaseReady } from '../lib/supabase'

export function useTrackVisit(pagina) {
  useEffect(() => {
    if (!supabaseReady) return
    supabase.from('analytics_visitas').insert({
      pagina,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    }).then(() => {}) // .then() necesario para que Supabase ejecute la petición HTTP
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
