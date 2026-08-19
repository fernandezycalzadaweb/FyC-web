import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SMTP_HOST = Deno.env.get('SMTP_HOST') ?? 'smtp.zoho.eu'
const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') ?? '465')
const SMTP_USER = Deno.env.get('SMTP_USER') ?? ''
const SMTP_PASS = Deno.env.get('SMTP_PASS') ?? ''
const NOTIFY_TO = Deno.env.get('NOTIFY_TO') ?? 'info@fernandezycalzada.com'

serve(async (req) => {
  try {
    const payload = await req.json()
    // Supabase Database Webhooks envían { type, table, record, old_record }
    const record = payload?.record
    if (!record) return new Response('no record', { status: 400 })

    const { floristeria, mensaje, email, telefono, created_at } = record

    const body = [
      `Nuevo mensaje de contacto recibido en fernandezycalzada.com`,
      ``,
      `Floristería: ${floristeria ?? '(sin nombre)'}`,
      `Email: ${email ?? '(no indicado)'}`,
      `Teléfono: ${telefono ?? '(no indicado)'}`,
      ``,
      `Mensaje:`,
      mensaje ?? '(vacío)',
      ``,
      `Fecha: ${created_at ? new Date(created_at).toLocaleString('es-ES') : 'ahora'}`,
      ``,
      `---`,
      `Responde directamente a ${email ?? NOTIFY_TO}`,
    ].join('\n')

    // Enviamos via Deno SMTP (SmtpClient de deno-smtp)
    const { SmtpClient } = await import('https://deno.land/x/denomailer@1.6.0/mod.ts')
    const client = new SmtpClient()

    await client.connectTLS({
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      username: SMTP_USER,
      password: SMTP_PASS,
    })

    await client.send({
      from: SMTP_USER,
      to: NOTIFY_TO,
      replyTo: email ?? SMTP_USER,
      subject: `Nuevo mensaje de ${floristeria ?? 'cliente desconocido'} · Fernández y Calzada`,
      content: body,
    })

    await client.close()

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('notify-mensaje error:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
