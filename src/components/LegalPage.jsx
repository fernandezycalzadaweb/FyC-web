export default function LegalPage({ title, children }) {
  return (
    <>
      {/* Cabecera oscura — mismo patrón que Catálogo / Nosotros */}
      <div
        className="text-paper py-12 md:py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #14261E 0%, #0E1C15 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage:
              'repeating-linear-gradient(115deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 36px)',
          }}
        />
        <div className="relative max-w-[1180px] mx-auto px-6">
          <span className="eyebrow text-[11px] text-gold/70 mb-4">Legal</span>
          <h1
            className="font-serif font-semibold text-paper leading-tight max-w-[28ch]"
            style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', letterSpacing: '-0.02em' }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="max-w-[740px] mx-auto px-6 py-14 md:py-20">
        {/* Aviso de borrador */}
        <div className="flex gap-3.5 border border-gold/30 bg-gold/5 rounded-[4px] px-5 py-4 mb-12">
          <span className="text-gold text-base flex-shrink-0 leading-relaxed" aria-hidden>⚠</span>
          <p className="text-[13px] text-ink/60 leading-relaxed">
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
