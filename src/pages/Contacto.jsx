import { useState } from 'react'
import Seo from '../components/Seo'
import { supabase, supabaseReady } from '../lib/supabase'
import { useTrackVisit } from '../hooks/useTrackVisit'

const INITIAL = { floristeria: '', mensaje: '', email: '', telefono: '' }
const WA_URL = 'https://wa.me/34608615272'

// ── Iconos inline ──────────────────────────────────────────────────────────────
function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}
function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function IconPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

// ── Componente de ítem de contacto ─────────────────────────────────────────────
function ContactItem({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{
        width: 38, height: 38, borderRadius: 11, flexShrink: 0,
        background: 'rgba(140,191,63,0.12)', color: '#4A7A34',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
          {label}
        </div>
        {children}
      </div>
    </div>
  )
}

function ContactLink({ href, children }) {
  return (
    <a
      href={href}
      style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', textDecoration: 'none', transition: 'color 0.12s' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#4A7A34')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#1D1D1F')}
    >
      {children}
    </a>
  )
}

// ── Mapa OpenStreetMap ─────────────────────────────────────────────────────────
// Coordenadas: Polígono Industrial El Tormes, Salamanca (sur de la ciudad)
function MapEmbed() {
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', marginTop: 6 }}>
      <iframe
        title="Localización Fernández y Calzada"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-5.685%2C40.932%2C-5.648%2C40.958&layer=mapnik&marker=40.944%2C-5.664"
        width="100%"
        height="180"
        style={{ display: 'block', border: 'none' }}
        loading="lazy"
      />
    </div>
  )
}

// ── Página ─────────────────────────────────────────────────────────────────────
export default function Contacto() {
  useTrackVisit('/contacto')

  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle')

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    if (supabaseReady) {
      const { error } = await supabase.from('mensajes_contacto').insert({
        nombre: form.floristeria,
        floristeria: form.floristeria,
        email: form.email || null,
        telefono: form.telefono || null,
        mensaje: form.mensaje,
      })
      setStatus(error ? 'error' : 'ok')
    } else {
      setStatus('ok')
    }
  }

  return (
    <>
      <Seo path="/contacto" />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 96px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 64, alignItems: 'start',
        }}>

          {/* ── Columna izquierda ─────────────────────────────────── */}
          <div>
            <p style={{ fontSize: 12.5, fontWeight: 700, color: '#4A7A34', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 12px' }}>
              Contacto
            </p>
            <h1 style={{
              fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.05,
              margin: '0 0 12px',
            }}>
              Cuéntanos qué{' '}
              <span style={{ color: '#4A7A34' }}>necesitas.</span>
            </h1>
            <p style={{ fontSize: 15.5, color: '#6E6E73', margin: '0 0 40px', lineHeight: 1.6 }}>
              Respondemos en el mismo día. Sin mínimos ni compromisos.
            </p>

            {/* Lista de contacto */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26, marginBottom: 32 }}>
              <ContactItem icon={<IconPhone />} label="Teléfono">
                <ContactLink href="tel:923182222">923 18 22 22</ContactLink>
              </ContactItem>

              <ContactItem icon={<IconMail />} label="Email">
                <ContactLink href="mailto:info@fernandezycalzada.com">
                  info@fernandezycalzada.com
                </ContactLink>
              </ContactItem>

              {/* WhatsApp — mismo tratamiento que teléfono y email */}
              <ContactItem icon={<IconWhatsApp />} label="WhatsApp">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F' }}>
                    Responderemos lo más rápido posible
                  </span>
                  <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12.5, fontWeight: 600, color: '#4A7A34', textDecoration: 'none', whiteSpace: 'nowrap' }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                  >
                    Abrir →
                  </a>
                </div>
              </ContactItem>

              {/* Dirección + mapa */}
              <ContactItem icon={<IconPin />} label="Dirección">
                <span style={{ fontSize: 15, fontWeight: 600, display: 'block', whiteSpace: 'pre-line' }}>
                  {'Calle Río Tera 2, 37003, Salamanca\n(Polígono Industrial El Tormes)'}
                </span>
                <MapEmbed />
              </ContactItem>
            </div>
          </div>

          {/* ── Columna derecha: formulario ───────────────────────── */}
          <div>
            {status === 'ok' ? (
              <div style={{
                padding: '40px 36px', borderRadius: 24,
                background: 'rgba(74,122,52,0.07)',
                border: '1px solid rgba(74,122,52,0.2)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>🌿</div>
                <strong style={{ fontSize: 20, display: 'block', marginBottom: 10, letterSpacing: '-0.01em' }}>
                  ¡Mensaje recibido!
                </strong>
                <p style={{ color: '#6E6E73', fontSize: 15, margin: 0, lineHeight: 1.6 }}>
                  Te respondemos en el mismo día.
                </p>
              </div>
            ) : (
              <div style={{
                background: '#fff', borderRadius: 24,
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '32px 32px 36px',
              }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.015em', margin: '0 0 24px' }}>
                  Escríbenos
                </h2>
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  <div>
                    <label className="field-label">¿Quién nos escribe?</label>
                    <input
                      className="field-input"
                      type="text"
                      name="floristeria"
                      value={form.floristeria}
                      onChange={onChange}
                      placeholder="Floristería Carmen"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div>
                    <label className="field-label">¿Qué necesitas?</label>
                    <textarea
                      className="field-input"
                      name="mensaje"
                      value={form.mensaje}
                      onChange={onChange}
                      placeholder="Cuéntanos qué flor o planta buscas y para cuándo la necesitas"
                      rows={4}
                      required
                      disabled={status === 'loading'}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label className="field-label">Email de contacto</label>
                    <input
                      className="field-input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="tu@floristeria.com"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div>
                    <label className="field-label">Teléfono de contacto</label>
                    <input
                      className="field-input"
                      type="tel"
                      name="telefono"
                      value={form.telefono}
                      onChange={onChange}
                      placeholder="923 000 000"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  {status === 'error' && (
                    <div style={{
                      padding: '14px 16px', borderRadius: 12,
                      background: 'rgba(224,86,110,0.07)',
                      border: '1px solid rgba(224,86,110,0.2)',
                      fontSize: 13.5,
                    }}>
                      No se pudo enviar. Escríbenos por{' '}
                      <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#4A7A34', fontWeight: 600 }}>WhatsApp</a>{' '}
                      o al{' '}
                      <a href="mailto:info@fernandezycalzada.com" style={{ color: '#4A7A34', fontWeight: 600 }}>email</a>.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === 'loading'}
                    style={{ marginTop: 4, opacity: status === 'loading' ? 0.6 : 1 }}
                  >
                    {status === 'loading' ? 'Enviando…' : 'Enviar consulta'}
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
