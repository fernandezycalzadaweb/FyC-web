import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink-deep text-paper/45 text-xs">
      <div className="max-w-[1180px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          {/* Marca */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-3">
              <span className="w-7 h-7 rounded-[4px] bg-leaf flex items-center justify-center text-paper font-serif font-bold text-xs select-none flex-shrink-0">
                FC
              </span>
              <span className="font-serif font-semibold text-sm text-paper">
                Fernández y Calzada
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
                {['Aviso legal', 'Privacidad', 'Cookies'].map((label) => (
                  <li key={label}>
                    <a href="#" className="no-underline hover:text-paper/70 transition-colors">
                      {label}
                    </a>
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
