import { useState } from 'react'
import { useCesta } from '../context/CestaContext'

const WA_NUMBER = '34608615272'
const MAIL_ADDRESS = 'info@fernandezycalzada.com'

function buildWaUrl(items) {
  const msg = [
    '¡Hola! 👋 Nos gustaría consultar disponibilidad y precio de estas variedades:',
    '',
    ...items.map((n) => `• ${n}`),
    '',
    '¿Nos confirmáis cuando podáis? ¡Gracias!',
  ].join('\n')
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

function buildMailUrl(items) {
  const body = [
    'Hola, nos gustaría consultar disponibilidad y precio de estas variedades:',
    '',
    ...items.map((n) => `• ${n}`),
    '',
    '¿Nos confirmáis cuando podáis? Gracias.',
  ].join('\n')
  return `mailto:${MAIL_ADDRESS}?subject=${encodeURIComponent('Consulta de disponibilidad')}&body=${encodeURIComponent(body)}`
}

export default function CestaBar() {
  const { items, remove, clear, count } = useCesta()
  const [open, setOpen] = useState(false)

  if (count === 0) return null

  const handleSend = () => {
    window.open(buildWaUrl(items), '_blank', 'noopener,noreferrer')
    clear()
    setOpen(false)
  }

  const handleMailSend = () => {
    window.location.href = buildMailUrl(items)
    clear()
    setOpen(false)
  }

  return (
    <>
      {/* Backdrop — detrás del panel, encima del resto */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 59,
          background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(3px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Panel deslizante desde abajo */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.14)',
          padding: '8px 24px 32px',
          maxHeight: '75vh',
          overflowY: 'auto',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.28s ease',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* Tirador visual */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, marginBottom: 16 }}>
          <div style={{ width: 36, height: 4, borderRadius: 100, background: 'rgba(0,0,0,0.12)' }} />
        </div>

        {/* Cabecera del panel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>
            Tu consulta
            <span style={{ fontWeight: 500, fontSize: 14, color: '#6E6E73', marginLeft: 8 }}>
              ({count} {count === 1 ? 'variedad' : 'variedades'})
            </span>
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            style={{
              background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%',
              width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, cursor: 'pointer', color: '#6E6E73', lineHeight: 1,
            }}
          >×</button>
        </div>

        {/* Lista de productos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {items.map((nombre) => (
            <div key={nombre} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '11px 16px', borderRadius: 14,
              background: 'rgba(140,191,63,0.07)',
              border: '1px solid rgba(140,191,63,0.2)',
            }}>
              <span style={{ fontSize: 14.5, fontWeight: 600 }}>{nombre}</span>
              <button
                onClick={() => remove(nombre)}
                aria-label={`Quitar ${nombre}`}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#6E6E73', fontSize: 18, lineHeight: 1, padding: '2px 6px',
                  borderRadius: '50%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1D1D1F')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6E73')}
              >×</button>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleSend}
              style={{
                flex: 1, padding: '13px 16px', borderRadius: 100,
                background: '#25D366', border: 'none',
                fontSize: 13.5, fontWeight: 700, cursor: 'pointer', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
            <button
              onClick={handleMailSend}
              style={{
                flex: 1, padding: '13px 16px', borderRadius: 100,
                background: '#4A7FC1', border: 'none',
                fontSize: 13.5, fontWeight: 700, cursor: 'pointer', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Correo
            </button>
          </div>
          <button
            onClick={() => { clear(); setOpen(false) }}
            style={{
              padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(0,0,0,0.14)', background: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#6E6E73',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
          >
            Vaciar consulta
          </button>
        </div>
      </div>

      {/* Barra flotante — visible siempre, el panel la tapa al abrirse */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 24, height: 24, borderRadius: 100, padding: '0 7px',
            background: '#8CBF3F', color: '#fff',
            fontSize: 11, fontWeight: 800,
          }}>
            {count}
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1F' }}>
            {count === 1 ? '1 variedad en tu consulta' : `${count} variedades en tu consulta`}
          </span>
        </div>
        <button
          onClick={() => setOpen(true)}
          style={{
            background: '#8CBF3F', border: 'none', borderRadius: 100,
            padding: '9px 18px', fontSize: 13, fontWeight: 700,
            color: '#fff', cursor: 'pointer', flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          Ver consulta →
        </button>
      </div>
    </>
  )
}
