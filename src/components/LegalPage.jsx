export default function LegalPage({ title, children }) {
  return (
    <>
      {/* Header */}
      <div style={{ padding: '64px 0 48px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Legal
          </p>
          <h1
            style={{
              fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800,
              letterSpacing: '-0.025em', margin: 0, maxWidth: '28ch',
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '56px 24px 96px' }}>
        {/* Draft warning */}
        <div
          style={{
            display: 'flex', gap: 14,
            border: '1px solid rgba(201,138,31,0.3)',
            background: 'rgba(201,138,31,0.06)',
            borderRadius: 16, padding: '16px 20px', marginBottom: 48,
          }}
        >
          <span style={{ flexShrink: 0, color: '#C98A1F', lineHeight: 1.6 }} aria-hidden>⚠</span>
          <p style={{ fontSize: 13, color: '#6E6E73', lineHeight: 1.65, margin: 0 }}>
            Borrador funcional basado en datos reales de la empresa. Antes de publicar, que alguien
            de Fernández y Calzada (o un asesor / gestoría) lo revise, especialmente los datos de
            inscripción en el Registro Mercantil que faltan por completar.
          </p>
        </div>

        {children}
      </div>
    </>
  )
}
