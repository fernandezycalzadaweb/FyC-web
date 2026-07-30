import { useState } from 'react'
import Seo from '../components/Seo'
import { supabase, supabaseReady } from '../lib/supabase'

const INITIAL = { floristeria: '', telefono: '', mensaje: '' }
const WA_URL = 'https://wa.me/34608615272'

export default function Contacto() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | loading | ok | error
  const [errorMsg, setErrorMsg] = useState('')

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    if (supabaseReady) {
      const { error } = await supabase.from('mensajes_contacto').insert({
        nombre: form.floristeria,
        floristeria: form.floristeria,
        telefono: form.telefono,
        mensaje: form.mensaje,
      })

      if (error) {
        setStatus('error')
        setErrorMsg(error.message)
      } else {
        setStatus('ok')
      }
    } else {
      // Supabase not configured — show success anyway (dev mode)
      setStatus('ok')
    }
  }

  return (
    <>
      <Seo path="/contacto" />
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 96px' }}>

        <h1
          style={{
            fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800,
            letterSpacing: '-0.025em', margin: '0 0 56px',
          }}
        >
          Hablemos
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 64,
          }}
        >
          {/* Left: contact info */}
          <div>
            <p style={{ fontSize: 16, color: '#6E6E73', margin: '0 0 40px', lineHeight: 1.65 }}>
              Puedes escribirnos por WhatsApp, llamarnos o mandarnos un email.
              Respondemos en el mismo día.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {[
                { label: 'Teléfono / WhatsApp', value: '923 18 22 22', href: WA_URL },
                { label: 'Email', value: 'info@fernandezycalzada.com', href: 'mailto:info@fernandezycalzada.com' },
                { label: 'Dirección', value: 'Salamanca, España', href: null },
              ].map(({ label, value, href }) => (
                <div key={label}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#6E6E73', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      style={{ fontSize: 17, fontWeight: 600, color: '#1D1D1F', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#4A7A34')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#1D1D1F')}
                    >
                      {value}
                    </a>
                  ) : (
                    <span style={{ fontSize: 17, fontWeight: 600 }}>{value}</span>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40 }}>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Abrir WhatsApp
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div>
            {status === 'ok' ? (
              <div
                style={{
                  padding: '32px 28px', borderRadius: 20,
                  background: 'rgba(74,122,52,0.07)',
                  border: '1px solid rgba(74,122,52,0.18)',
                }}
              >
                <strong style={{ fontSize: 17, display: 'block', marginBottom: 8 }}>
                  ¡Mensaje recibido!
                </strong>
                <p style={{ color: '#6E6E73', fontSize: 14, margin: 0 }}>
                  Te respondemos en el mismo día.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label className="field-label">Nombre de la floristería</label>
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
                <div>
                  <label className="field-label">Tel. / WhatsApp</label>
                  <input
                    className="field-input"
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={onChange}
                    placeholder="600 000 000"
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
                    placeholder="Cuéntanos qué variedades te interesan o cualquier pregunta..."
                    rows={5}
                    required
                    disabled={status === 'loading'}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {status === 'error' && (
                  <div
                    style={{
                      padding: '14px 16px', borderRadius: 12,
                      background: 'rgba(224,86,110,0.07)',
                      border: '1px solid rgba(224,86,110,0.2)',
                      fontSize: 13.5, color: '#1D1D1F',
                    }}
                  >
                    No se pudo enviar el formulario. Escríbenos directamente por{' '}
                    <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#4A7A34', fontWeight: 600 }}>
                      WhatsApp
                    </a>{' '}
                    o al <a href="mailto:info@fernandezycalzada.com" style={{ color: '#4A7A34', fontWeight: 600 }}>email</a>.
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={status === 'loading'}
                  style={{ alignSelf: 'flex-start', opacity: status === 'loading' ? 0.6 : 1 }}
                >
                  {status === 'loading' ? 'Enviando…' : 'Consultar disponibilidad'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </>
  )
}
