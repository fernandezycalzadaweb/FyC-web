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
        {children}
      </div>
    </>
  )
}
