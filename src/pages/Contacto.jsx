import { useState } from 'react'
import Seo from '../components/Seo'

const INITIAL = { nombre: '', floristeria: '', email: '', telefono: '', mensaje: '' }

export default function Contacto() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | sending | ok | error

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      // TODO: cuando esté Supabase, insertar en mensajes_contacto
      // const { error } = await supabase.from('mensajes_contacto').insert([{ ...form }])
      await new Promise((r) => setTimeout(r, 800)) // simula latencia
      setStatus('ok')
      setForm(INITIAL)
    } catch {
      setStatus('error')
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contacto — Fernández y Calzada',
    description: 'Formulario de contacto para floristerías y viveros. Consultas de disponibilidad, precios y pedidos.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Fernández y Calzada S.L.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle Río Tera 2',
        postalCode: '37003',
        addressLocality: 'Salamanca',
        addressCountry: 'ES',
      },
    },
  }

  return (
    <>
      <Seo
        title="Contacto"
        description="Contacta con Fernández y Calzada, mayoristas de flores y plantas en Salamanca. Consulta disponibilidad y precios para tu floristería."
        path="/contacto"
        schema={schema}
      />

      {/* Cabecera */}
      <div className="bg-ink-deep text-paper py-12 md:py-16">
        <div className="max-w-[1180px] mx-auto px-6">
          <span className="eyebrow text-[11px] text-gold/70 mb-4">Contacto</span>
          <h1
            className="font-serif font-semibold text-paper leading-tight max-w-[26ch]"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}
          >
            ¿Eres floristería o vivero? Escríbenos.
          </h1>
          <p className="text-paper/50 mt-3 max-w-[44ch] text-[15px]">
            Te respondemos con disponibilidad, precios y plazos de entrega para tu zona.
          </p>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-6 py-14 md:py-20 grid md:grid-cols-[1fr_1.1fr] gap-14 md:gap-20 items-start">
        {/* Columna info */}
        <div>
          <div className="flex flex-col gap-8">
            {[
              {
                label: 'Dirección',
                lines: ['Calle Río Tera 2', '37003, Salamanca'],
              },
              {
                label: 'Teléfono',
                lines: ['+34 923 000 000'],
                href: 'tel:+34923000000',
              },
              {
                label: 'Email',
                lines: ['info@fernandezycalzada.com'],
                href: 'mailto:info@fernandezycalzada.com',
              },
              {
                label: 'Horario',
                lines: ['Lunes–Viernes · 7:00–14:00', 'Sábados · 7:00–12:00'],
              },
            ].map(({ label, lines, href }) => (
              <div key={label}>
                <span className="mono-label text-[10px] text-rust block mb-1.5">{label}</span>
                {href ? (
                  <a href={href} className="no-underline hover:text-leaf transition-colors">
                    {lines.map((l) => (
                      <span key={l} className="block text-[15.5px] font-medium">{l}</span>
                    ))}
                  </a>
                ) : (
                  lines.map((l) => (
                    <span key={l} className="block text-[15.5px] text-ink/80">{l}</span>
                  ))
                )}
              </div>
            ))}
          </div>

          {/* Sello decorativo */}
          <div className="mt-12 flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full border border-dashed border-leaf/50 flex items-center justify-center flex-shrink-0"
              style={{ transform: 'rotate(-6deg)' }}
            >
              <span className="font-serif text-[10px] font-semibold text-leaf text-center leading-snug">
                Desde<br />1985
              </span>
            </div>
            <p className="text-[13px] text-ink/50 leading-relaxed">
              Empresa familiar. Hablamos contigo directamente, sin formularios intermedios.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div>
          {status === 'ok' ? (
            <div className="bg-leaf/8 border border-leaf/20 rounded-[4px] p-8 text-center">
              <div
                className="w-14 h-14 rounded-full border border-dashed border-gold/50 flex items-center justify-center mx-auto mb-4"
                style={{ transform: 'rotate(-5deg)' }}
              >
                <span className="font-serif text-[13px] font-semibold text-gold">OK</span>
              </div>
              <h2 className="font-serif text-[20px] font-semibold mb-2">Mensaje recibido</h2>
              <p className="text-[14px] text-ink/60 mb-5">
                Te respondemos en breve con disponibilidad y precios para tu zona.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="btn btn-ghost-dark text-[13px] py-2 px-4"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  id="nombre"
                  label="Nombre"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
                <Field
                  id="floristeria"
                  label="Nombre del negocio"
                  placeholder="Tu floristería o vivero"
                  value={form.floristeria}
                  onChange={handleChange}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <Field
                  id="telefono"
                  label="Teléfono (opcional)"
                  type="tel"
                  placeholder="+34 600 000 000"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>
              <Field
                id="mensaje"
                label="Mensaje"
                as="textarea"
                rows={5}
                placeholder="Cuéntanos qué necesitas — producto, zona, volumen aproximado..."
                value={form.mensaje}
                onChange={handleChange}
                required
              />

              {status === 'error' && (
                <p className="text-[13px] text-rust border border-rust/20 bg-rust/5 rounded-[3px] px-3 py-2">
                  Ha ocurrido un error. Por favor, inténtalo de nuevo o escríbenos directamente por email.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn btn-primary w-full justify-center text-[14px] py-3.5 disabled:opacity-60"
              >
                {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
              </button>

              <p className="text-[11.5px] text-ink/40 text-center">
                Al enviar este formulario aceptas nuestra{' '}
                <a href="#" className="underline hover:text-ink/70">política de privacidad</a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

function Field({ id, label, as, rows, type = 'text', placeholder, value, onChange, required }) {
  const inputClass =
    'w-full px-3.5 py-2.5 rounded-[3px] border border-mist bg-white text-[14px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf/30 transition-colors'

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="mono-label text-[10px] text-leaf-dark/70">
        {label}
        {required && <span className="text-rust ml-0.5">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClass + ' resize-none'}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClass}
        />
      )}
    </div>
  )
}
