import { computeCropPrediction } from '../../src/lib/cropPredictor';

export default function handler(req: { method?: string; body?: any }, res: {
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
  const result = computeCropPrediction({
    N: Number(body.N ?? 82),
    P: Number(body.P ?? 48),
    K: Number(body.K ?? 41),
    ph: Number(body.ph ?? 6.5),
    temperature: Number(body.temperature ?? 26.5),
    humidity: Number(body.humidity ?? 80),
    rainfall: Number(body.rainfall ?? 202.9),
  });

  res.status(200).json({
    ...result,
    supabase_logged: false,
    record_id: null,
    timestamp: new Date().toISOString(),
  });
}
