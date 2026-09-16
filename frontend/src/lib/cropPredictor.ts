export interface CropPredictInput {
  N: number;
  P: number;
  K: number;
  ph: number;
  temperature: number;
  humidity: number;
  rainfall: number;
}

export interface RecommendedCrop {
  rank: number;
  crop: string;
  suitability_score: number;
  tag: string;
}

export interface CropPredictResult {
  top_recommendations: RecommendedCrop[];
  feature_importance: Record<string, number>;
}

const BENCHMARK_CROPS: Record<
  string,
  { N: number; P: number; K: number; ph: number; temp: number; hum: number; rain: number }
> = {
  rice: { N: 80.0, P: 47.5, K: 40.0, ph: 6.25, temp: 23.7, hum: 82.5, rain: 240.0 },
  maize: { N: 80.0, P: 47.5, K: 20.0, ph: 6.25, temp: 22.5, hum: 65.0, rain: 85.0 },
  chickpea: { N: 40.0, P: 67.5, K: 80.0, ph: 7.4, temp: 19.0, hum: 17.0, rain: 80.0 },
  kidneybeans: { N: 25.0, P: 67.5, K: 20.0, ph: 5.75, temp: 20.0, hum: 21.5, rain: 105.0 },
  pigeonpeas: { N: 25.0, P: 67.5, K: 20.0, ph: 6.0, temp: 28.0, hum: 50.0, rain: 145.0 },
  mothbeans: { N: 25.0, P: 47.5, K: 20.0, ph: 6.25, temp: 28.0, hum: 52.5, rain: 52.5 },
  mungbean: { N: 25.0, P: 47.5, K: 20.0, ph: 6.7, temp: 28.5, hum: 85.0, rain: 47.5 },
  blackgram: { N: 45.0, P: 67.5, K: 20.0, ph: 7.15, temp: 30.0, hum: 65.0, rain: 67.5 },
  lentil: { N: 25.0, P: 67.5, K: 20.0, ph: 6.9, temp: 24.0, hum: 65.0, rain: 45.0 },
  pomegranate: { N: 25.0, P: 20.0, K: 40.0, ph: 6.35, temp: 21.5, hum: 90.0, rain: 107.5 },
  banana: { N: 100.0, P: 82.5, K: 50.0, ph: 6.0, temp: 27.5, hum: 80.0, rain: 105.0 },
  mango: { N: 25.0, P: 25.0, K: 30.0, ph: 5.75, temp: 31.5, hum: 50.0, rain: 95.0 },
  grapes: { N: 25.0, P: 132.5, K: 200.0, ph: 6.0, temp: 25.0, hum: 82.5, rain: 70.0 },
  watermelon: { N: 100.0, P: 20.0, K: 50.0, ph: 6.5, temp: 25.5, hum: 85.0, rain: 50.0 },
  muskmelon: { N: 100.0, P: 20.0, K: 50.0, ph: 6.4, temp: 28.5, hum: 92.5, rain: 25.0 },
  apple: { N: 25.0, P: 132.5, K: 200.0, ph: 6.0, temp: 22.5, hum: 92.5, rain: 112.5 },
  orange: { N: 25.0, P: 20.0, K: 10.0, ph: 7.0, temp: 22.5, hum: 92.5, rain: 110.0 },
  papaya: { N: 50.0, P: 57.5, K: 50.0, ph: 6.75, temp: 33.5, hum: 92.5, rain: 145.0 },
  coconut: { N: 25.0, P: 20.0, K: 30.0, ph: 6.0, temp: 27.0, hum: 96.5, rain: 180.0 },
  cotton: { N: 120.0, P: 47.5, K: 20.0, ph: 7.0, temp: 24.0, hum: 72.5, rain: 80.0 },
  jute: { N: 80.0, P: 47.5, K: 40.0, ph: 6.75, temp: 24.5, hum: 80.0, rain: 175.0 },
  coffee: { N: 100.0, P: 25.0, K: 30.0, ph: 6.75, temp: 25.5, hum: 60.0, rain: 157.5 },
};

export function computeCropPrediction(input: CropPredictInput): CropPredictResult {
  const N = Number(input.N);
  const P = Number(input.P);
  const K = Number(input.K);
  const ph = Number(input.ph);
  const temperature = Number(input.temperature);
  const humidity = Number(input.humidity);
  const rainfall = Number(input.rainfall);

  const scored = Object.entries(BENCHMARK_CROPS).map(([crop, std]) => {
    const dn = Math.pow((N - std.N) / 35.0, 2);
    const dp = Math.pow((P - std.P) / 25.0, 2);
    const dk = Math.pow((K - std.K) / 25.0, 2);
    const dph = Math.pow((ph - std.ph) / 1.0, 2);
    const dt = Math.pow((temperature - std.temp) / 5.0, 2);
    const dh = Math.pow((humidity - std.hum) / 20.0, 2);
    const dr = Math.pow((rainfall - std.rain) / 60.0, 2);

    const dist = 0.18 * dn + 0.14 * dp + 0.14 * dk + 0.14 * dph + 0.12 * dt + 0.14 * dh + 0.14 * dr;
    let score = Math.exp(-dist / 1.5) * 100.0;
    score = Math.min(99.4, Math.max(5.0, Math.round(score * 10) / 10));

    return { crop, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top_recommendations = scored.slice(0, 3).map((item, idx) => {
    let tag = 'Optimal Fit';
    if (idx === 0) tag = item.score >= 85 ? 'Optimal Fit' : 'High Fit';
    else if (idx === 1) tag = item.score >= 75 ? 'High Fit' : 'Moderate Fit';
    else tag = item.score >= 60 ? 'Moderate Fit' : 'Alternative';

    return {
      rank: idx + 1,
      crop: item.crop,
      suitability_score: item.score,
      tag,
    };
  });

  const topCrop = top_recommendations[0].crop;
  const std = BENCHMARK_CROPS[topCrop] || BENCHMARK_CROPS.rice;
  const nDev = Math.abs(N - std.N) / 35.0;
  const pDev = Math.abs(P - std.P) / 25.0;
  const kDev = Math.abs(K - std.K) / 25.0;
  const phDev = Math.abs(ph - std.ph) / 1.0;
  const tDev = Math.abs(temperature - std.temp) / 5.0;
  const hDev = Math.abs(humidity - std.hum) / 20.0;
  const rDev = Math.abs(rainfall - std.rain) / 60.0;

  const rImp = Math.max(0.05, 1.0 / (1.0 + rDev));
  const hImp = Math.max(0.05, 1.0 / (1.0 + hDev));
  const nImp = Math.max(0.05, 1.0 / (1.0 + nDev));
  const tImp = Math.max(0.05, 1.0 / (1.0 + tDev));
  const phImp = Math.max(0.05, 1.0 / (1.0 + phDev));
  const pImp = Math.max(0.05, 1.0 / (1.0 + pDev));
  const kImp = Math.max(0.05, 1.0 / (1.0 + kDev));
  const total = rImp + hImp + nImp + tImp + phImp + pImp + kImp;

  return {
    top_recommendations,
    feature_importance: {
      rainfall: Math.round((rImp / total) * 100) / 100,
      humidity: Math.round((hImp / total) * 100) / 100,
      N: Math.round((nImp / total) * 100) / 100,
      temperature: Math.round((tImp / total) * 100) / 100,
      ph: Math.round((phImp / total) * 100) / 100,
      P: Math.round((pImp / total) * 100) / 100,
      K: Math.round((kImp / total) * 100) / 100,
    },
  };
}

export function buildAdvisoryFromPrediction(
  features: CropPredictInput,
  result: CropPredictResult
): string {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const t = result.top_recommendations[0];
  const s = result.top_recommendations[1];
  if (!t) return '';
  return (
    `${cap(t.crop)} is projected as the top cultivar (${t.suitability_score.toFixed(1)}% affinity score) — soil chemistry (N=${features.N} ppm, pH=${features.ph}) and microclimate (${features.temperature}°C, ${features.rainfall} mm rainfall) create an optimal growth envelope for this crop. ` +
    `Ensure balanced N-P-K basal fertilization during initial sowing and monitor relative humidity (${features.humidity}%) to maintain canopy health. ` +
    (s ? `If seasonal rainfall fluctuates, ${cap(s.crop)} serves as an effective secondary rotation offering stable yield protection.` : '')
  );
}
