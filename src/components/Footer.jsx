import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink-deep text-paper/45 text-xs">
      <div className="max-w-[1180px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          {/* Marca */}
          <div>
            <Link to="/" className="inline-flex no-underline mb-3 group">
              {/*
                El logo tiene texto oscuro sobre fondo transparente — no es visible sobre ink-deep.
                Se presenta sobre un fondo paper con radio generoso, como una etiqueta física,
                no como un parche técnico. El borde sutil lo integra con la estética del sitio.
              */}
              <span
                className="inline-flex rounded-xl px-3 py-2 transition-opacity duration-150 group-hover:opacity-80"
                style={{
                  background: 'rgba(241,236,221,0.92)',
                  boxShadow: '0 0 0 1px rgba(241,236,221,0.12)',
                }}
              >
                <img
                  src="/logo-fc.png"
                  alt="Fernández y Calzada S.L."
                  className="h-8 w-auto"
                  style={{ maxWidth: '138px' }}
                />
              </span>
            </Link>
            <p className="text-paper/40 leading-relaxed max-w-[22rem]">
              Mayoristas de flor cortada y planta natural con sede en Salamanca.
              Suministro a floristerías y viveros de España.
            </p>
          </div>

          {/* Columnas */}
          <div className="flex gap-12 md:gap-16">
            <div>
              <p className="mono-label text-paper/30 text-[10px] mb-3">Empresa</p>
              <ul className="space-y-2">
                {[
                  { to: '/nosotros', label: 'Quiénes somos' },
                  { to: '/catalogo', label: 'Catálogo' },
                  { to: '/contacto', label: 'Contacto' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="no-underline hover:text-paper/70 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mono-label text-paper/30 text-[10px] mb-3">Legal</p>
              <ul className="space-y-2">
                {[
                  { to: '/aviso-legal', label: 'Aviso legal' },
                  { to: '/privacidad',  label: 'Privacidad' },
                  { to: '/cookies',     label: 'Cookies' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="no-underline hover:text-paper/70 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-paper/10 pt-6 flex flex-col sm:flex-row sm:justify-between gap-2">
          <span>© {year} Fernández y Calzada S.L. · CIF B37319829 · Calle Río Tera 2, 37003 Salamanca</span>
          <Link to="/admin" className="no-underline hover:text-paper/60 transition-colors">
            Acceso privado
          </Link>
        </div>
      </div>
    </footer>
  )
}
