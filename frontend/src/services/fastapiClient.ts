/**
 * FastAPI ML Inference Microservice Client Wrapper
 * Queries Python backend for ensemble predictions, SHAP attribution, and constraint re-weighting.
 */

import { SoilNutrients, MeteorologicalData, FarmingConstraints, CropRecommendation, ShapFactor, GeminiAdvisory } from '../types';
import { runRecommendationEngine } from './recommendationEngine';

export interface RecommendRequest {
  n: number;
  p: number;
  k: number;
  ph: number;
  lat: number;
  lon: number;
  water_availability: 'Low' | 'Moderate' | 'High';
  budget_limit: 'Low' | 'Medium' | 'High';
}

export interface RecommendResponse {
  success: boolean;
  source: 'fastapi-ml-engine' | 'client-ensemble-engine';
  top3: CropRecommendation[];
  allEvaluated: CropRecommendation[];
  primaryShap: ShapFactor[];
  advisory?: GeminiAdvisory;
}

export class FastAPIClient {
  private serviceUrl: string;

  constructor(serviceUrl: string = import.meta.env.DEV ? 'http://localhost:8000' : '') {
    this.serviceUrl = serviceUrl;
  }

  /**
   * Send agronomic inputs to the Python FastAPI microservice `/api/v1/recommend`.
   * Gracefully falls back to local TS engine if FastAPI is not yet running.
   */
  async recommend(
    soil: SoilNutrients,
    weather: MeteorologicalData,
    constraints: FarmingConstraints
  ): Promise<RecommendResponse> {
    const waterMap: Record<string, 'Low' | 'Moderate' | 'High'> = {
      Plentiful: 'High',
      Moderate: 'Moderate',
      Low: 'Low',
    };
    const budgetMap: Record<string, 'Low' | 'Medium' | 'High'> = {
      High: 'High',
      Moderate: 'Medium',
      Low: 'Low',
    };

    const payload: RecommendRequest = {
      n: soil.N,
      p: soil.P,
      k: soil.K,
      ph: soil.pH,
      lat: weather.latitude || 16.8524,
      lon: weather.longitude || 74.5815,
      water_availability: waterMap[constraints.water] || 'Moderate',
      budget_limit: budgetMap[constraints.budget] || 'Medium',
    };

    try {
      const response = await fetch(`${this.serviceUrl}/api/v1/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          source: 'fastapi-ml-engine',
          top3: data.top3,
          allEvaluated: data.all_evaluated || data.top3,
          primaryShap: data.primary_shap?.factors || [],
          advisory: data.advisory,
        };
      }
      throw new Error(`FastAPI returned status ${response.status}`);
    } catch {
      // Local client-side fallback
      const localResult = runRecommendationEngine(soil, weather, constraints);
      return {
        success: true,
        source: 'client-ensemble-engine',
        top3: localResult.top3,
        allEvaluated: localResult.allEvaluated,
        primaryShap: localResult.primaryShap,
      };
    }
  }

  /**
   * Health check on the Python FastAPI service.
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.serviceUrl}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const fastApiClient = new FastAPIClient();
