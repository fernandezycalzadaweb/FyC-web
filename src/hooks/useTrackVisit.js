import { useEffect } from 'react'
import { supabase, supabaseReady } from '../lib/supabase'

export function useTrackVisit(pagina) {
  useEffect(() => {
    if (!supabaseReady) return
    supabase.from('analytics_visitas').insert({
      pagina,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    })
    // Fire-and-forget: errors silently ignored to never interrumpir la UX
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
