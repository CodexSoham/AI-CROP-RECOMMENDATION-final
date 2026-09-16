import { simulateFieldHealth } from '../../src/lib/fieldHealthFallback';

export default async function handler(req: { method?: string; body?: any }, res: {
  status: (code: number) => { json: (body: unknown) => void; end: () => void };
}) {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  res.status(200).json(simulateFieldHealth(body.geojson));
}
