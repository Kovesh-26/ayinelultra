import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Env = {
  DB: D1Database;
  ASSETS: R2Bucket;
  CHAT_ROOM: DurableObjectNamespace;
  STREAM_ACCOUNT_ID?: string;
  STREAM_API_TOKEN?: string;
};

const app = new Hono<{ Bindings: Env }>();
app.use(
  '/*',
  cors({
    origin: '*',
    allowHeaders: ['*'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

app.get('/health', (c) => c.json({ ok: true, service: 'ayinel-api' }));

app.get('/profiles/:handle', async (c) => {
  const handle = c.req.param('handle');
  const row = await c.env.DB.prepare(
    'SELECT id, handle, displayName, bio, avatarUrl, bannerUrl, theme, musicUrl FROM users WHERE handle = ?'
  )
    .bind(handle)
    .first();
  if (!row) return c.json({ error: 'not_found' }, 404);
  return c.json(row);
});

app.get('/studios/:handle', async (c) => {
  const handle = c.req.param('handle');
  const row = await c.env.DB.prepare(
    'SELECT id, handle, name, about, bannerUrl, theme, musicUrl, links, tipsLinks FROM studios WHERE handle = ?'
  )
    .bind(handle)
    .first();
  if (!row) return c.json({ error: 'not_found' }, 404);
  return c.json(row);
});

app.post('/media/upload-url', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { kind = 'video', filename = 'upload.bin' } = body || {};

  if (c.env.STREAM_ACCOUNT_ID && c.env.STREAM_API_TOKEN) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${c.env.STREAM_ACCOUNT_ID}/stream/direct_upload`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${c.env.STREAM_API_TOKEN}` },
    });
    const data: any = await res.json();
    if (!data?.success)
      return c.json(
        { error: 'stream_direct_upload_failed', details: data },
        500
      );
    return c.json({
      uploadURL: data?.result?.uploadURL,
      uid: data?.result?.uid,
      kind,
    });
  }

  const key = `uploads/${Date.now()}-${filename}`;
  await c.env.ASSETS.put(key, new Blob());
  return c.json({ r2Key: key });
});

app.get('/ws/:room', async (c) => {
  const id = c.env.CHAT_ROOM.idFromName(c.req.param('room'));
  const stub = c.env.CHAT_ROOM.get(id);
  const resp = await stub.fetch(c.req.raw);
  return resp as Response;
});

export default app;
