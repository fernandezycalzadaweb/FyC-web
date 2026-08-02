import { useState } from 'react'
import Seo from '../components/Seo'
import { supabase, supabaseReady } from '../lib/supabase'

const INITIAL = { floristeria: '', mensaje: '', email: '', telefono: '' }
const WA_URL = 'https://wa.me/34608615272'

export default function Contacto() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | loading | ok | error

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
        telefono: form.telefono,
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

      {/* ── HERO strip ───────────────────────────────────────────── */}
      <div
        style={{
          background: 'rgba(140,191,63,0.07)',
          borderBottom: '1px solid rgba(140,191,63,0.14)',
          padding: '64px 24px 56px',
        }}
      >
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: '#4A7A34', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 12px' }}>
            Contacto
          </p>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 62px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.02,
              margin: '0 0 16px', maxWidth: '16ch',
            }}
          >
            Cuéntanos qué{' '}
            <span style={{ color: '#4A7A34' }}>necesitas.</span>
          </h1>
          <p style={{ fontSize: 16, color: '#6E6E73', margin: 0, maxWidth: '42ch', lineHeight: 1.6 }}>
            Respondemos en el mismo día. Sin mínimos ni compromisos.
          </p>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px 96px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 64, alignItems: 'start',
          }}
        >
          {/* ── Columna izquierda: datos de contacto ── */}
          <div>
            {/* Datos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 40 }}>
              {[
                {
                  label: 'Teléfono',
                  value: '923 18 22 22',
                  href: 'tel:923182222',
                  icon: '📞',
                },
                {
                  label: 'Email',
                  value: 'info@fernandezycalzada.com',
                  href: 'mailto:info@fernandezycalzada.com',
                  icon: '✉',
                },
                {
                  label: 'Dirección',
                  value: 'Calle Río Tera 2, 37003, Salamanca\n(Polígono Industrial El Tormes)',
                  href: null,
                  icon: '📍',
                },
              ].map(({ label, value, href, icon }) => (
                <div key={label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      background: 'rgba(140,191,63,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 17,
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        style={{ fontSize: 15.5, fontWeight: 600, color: '#1D1D1F', textDecoration: 'none', transition: 'color 0.1s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#4A7A34')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#1D1D1F')}
                      >
                        {value}
                      </a>
                    ) : (
                      <span style={{ fontSize: 15.5, fontWeight: 600, whiteSpace: 'pre-line' }}>{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp — separado y destacado */}
            <div
              style={{
                padding: '20px 22px', borderRadius: 16,
                background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}
            >
              <div
                style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(37,211,102,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                💬
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>WhatsApp</div>
                <div style={{ fontSize: 12.5, color: '#6E6E73' }}>Respuesta rápida por mensaje</div>
              </div>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ fontSize: 12.5, padding: '7px 14px', flexShrink: 0 }}
              >
                Abrir →
              </a>
            </div>
          </div>

          {/* ── Columna derecha: formulario ── */}
          <div>
            {status === 'ok' ? (
              <div
                style={{
                  padding: '40px 36px', borderRadius: 24,
                  background: 'rgba(74,122,52,0.07)',
                  border: '1px solid rgba(74,122,52,0.2)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>🌿</div>
                <strong style={{ fontSize: 20, display: 'block', marginBottom: 10, letterSpacing: '-0.01em' }}>
                  ¡Mensaje recibido!
                </strong>
                <p style={{ color: '#6E6E73', fontSize: 15, margin: 0, lineHeight: 1.6 }}>
                  Te respondemos en el mismo día.
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: '#fff', borderRadius: 24,
                  border: '1px solid rgba(0,0,0,0.08)',
                  padding: '32px 32px 36px',
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.015em', margin: '0 0 24px' }}>
                  Escríbenos
                </h2>
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* 1 Floristería */}
                  <div>
                    <label className="field-label">Nombre del negocio</label>
                    <input
                      className="field-input"
                      type="text"
                      name="floristeria"
                      value={form.floristeria}
                      onChange={onChange}
                      placeholder="Flores Carmen, S.L."
                      required
                      disabled={status === 'loading'}
                    />
                  </div>
                  {/* 2 Mensaje */}
                  <div>
                    <label className="field-label">¿Qué necesitas?</label>
                    <textarea
                      className="field-input"
                      name="mensaje"
                      value={form.mensaje}
                      onChange={onChange}
                      placeholder="Cuéntanos qué variedades te interesan o cualquier pregunta..."
                      rows={4}
                      required
                      disabled={status === 'loading'}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  {/* 3 Email */}
                  <div>
                    <label className="field-label">Email (opcional)</label>
                    <input
                      className="field-input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="tu@floristeria.com"
                      disabled={status === 'loading'}
                    />
                  </div>
                  {/* 4 Teléfono */}
                  <div>
                    <label className="field-label">Teléfono (opcional)</label>
                    <input
                      className="field-input"
                      type="tel"
                      name="telefono"
                      value={form.telefono}
                      onChange={onChange}
                      placeholder="923 000 000"
                      disabled={status === 'loading'}
                    />
                  </div>

                  {status === 'error' && (
                    <div
                      style={{
                        padding: '14px 16px', borderRadius: 12,
                        background: 'rgba(224,86,110,0.07)',
                        border: '1px solid rgba(224,86,110,0.2)',
                        fontSize: 13.5,
                      }}
                    >
                      No se pudo enviar el formulario. Escríbenos por{' '}
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
