import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const NOTIFY_TO = Deno.env.get('NOTIFY_TO') ?? 'info@fernandezycalzada.com'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  try {
    const payload = await req.json()
    const record = payload?.record
    if (!record) return new Response('no record', { status: 400, headers: CORS })

    const { floristeria, mensaje, email, telefono, created_at } = record

    const fecha = created_at
      ? new Date(created_at).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
      : new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })

    const html = `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
  <h2 style="margin:0 0 20px;font-size:18px;color:#1D1D1F">
    Nuevo mensaje de contacto — Fernández y Calzada
  </h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr>
      <td style="padding:10px 12px;background:#f5f5f7;font-weight:700;width:140px;border-radius:6px 0 0 6px">Floristería</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e5e7">${floristeria ?? '(sin nombre)'}</td>
    </tr>
    <tr>
      <td style="padding:10px 12px;background:#f5f5f7;font-weight:700">Email</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e5e7">
        ${email ? `<a href="mailto:${email}" style="color:#4A7A34">${email}</a>` : '(no indicado)'}
      </td>
    </tr>
    <tr>
      <td style="padding:10px 12px;background:#f5f5f7;font-weight:700">Teléfono</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e5e7">
        ${telefono ? `<a href="tel:${telefono}" style="color:#4A7A34">${telefono}</a>` : '(no indicado)'}
      </td>
    </tr>
    <tr>
      <td style="padding:10px 12px;background:#f5f5f7;font-weight:700;vertical-align:top">Mensaje</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e5e7;white-space:pre-wrap">${mensaje ?? '(vacío)'}</td>
    </tr>
    <tr>
      <td style="padding:10px 12px;background:#f5f5f7;font-weight:700">Fecha</td>
      <td style="padding:10px 12px;color:#6E6E73">${fecha}</td>
    </tr>
  </table>
  ${email ? `<p style="margin-top:24px;font-size:13px;color:#6E6E73">Responde directamente a <a href="mailto:${email}" style="color:#4A7A34">${email}</a></p>` : ''}
</div>
`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Fernández y Calzada <avisos@fernandezycalzada.com>',
        to: [NOTIFY_TO],
        subject: `Nuevo mensaje de ${floristeria ?? 'cliente desconocido'} · Fernández y Calzada`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', res.status, err)
      return new Response(JSON.stringify({ error: err }), {
        status: 502,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('notify-mensaje error:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
