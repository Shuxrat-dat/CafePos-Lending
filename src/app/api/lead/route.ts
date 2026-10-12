/**
 * Receives CafePOS demo requests and forwards them.
 * Configure ONE of these in `.env.local`:
 *   LEAD_WEBHOOK_URL                      — any endpoint accepting a JSON POST (CRM, Make, n8n…)
 *   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID — message to a Telegram chat via a bot
 * Without configuration it answers 501 and the form says so — nothing is silently dropped.
 */
type Lead = { name: string; phone: string; venueName: string; venueType: string; locations: string; comment: string };
const FIELDS: (keyof Lead)[] = ['name', 'phone', 'venueName', 'venueType', 'locations', 'comment'];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (body.website) return Response.json({ ok: true }); // honeypot

  const lead = Object.fromEntries(FIELDS.map((k) => [k, typeof body[k] === 'string' ? String(body[k]).slice(0, 1000) : ''])) as Lead;
  if (!lead.name.trim() || !lead.phone.trim() || !lead.venueName.trim() || !lead.venueType) {
    return Response.json({ error: 'validation' }, { status: 422 });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!webhook && !(botToken && chatId)) return Response.json({ error: 'not_configured' }, { status: 501 });

  try {
    const res = webhook
      ? await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...lead, source: 'cafepos-landing', createdAt: new Date().toISOString() }),
          signal: AbortSignal.timeout(10_000),
        })
      : await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: [
              'Новая заявка CafePOS',
              `Имя: ${lead.name}`,
              `Телефон: ${lead.phone}`,
              `Заведение: ${lead.venueName} (${lead.venueType})`,
              lead.locations && `Точек: ${lead.locations}`,
              lead.comment && `Комментарий: ${lead.comment}`,
            ]
              .filter(Boolean)
              .join('\n'),
          }),
          signal: AbortSignal.timeout(10_000),
        });
    if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
  } catch (error) {
    console.error('[lead] delivery failed:', error);
    return Response.json({ error: 'delivery_failed' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
