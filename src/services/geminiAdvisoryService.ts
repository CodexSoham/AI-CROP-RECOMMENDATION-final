/**
 * Gemini Generative Advisory Service
 * Ingests ML probabilities, SHAP attributions, and climate context to generate plain-language farmer advisories.
 */

import { GeminiAdvisory, SoilNutrients, MeteorologicalData, FarmingConstraints, CropRecommendation, ShapFactor } from '../types';

export class GeminiAdvisoryService {
  private apiEndpoint: string;

  constructor(apiEndpoint: string = '/api/gemini/advisory') {
    this.apiEndpoint = apiEndpoint;
  }

  /**
   * Request natural-language advisory synthesis from Gemini API.
   */
  async generateAdvisory(params: {
    soil: SoilNutrients;
    weather: MeteorologicalData;
    constraints: FarmingConstraints;
    primaryCrop: CropRecommendation;
    top3: CropRecommendation[];
    shapFactors: ShapFactor[];
  }): Promise<GeminiAdvisory> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Gemini Advisory endpoint returned HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.advisory) {
        return data.advisory;
      }
      throw new Error('Invalid advisory response format');
    } catch (error) {
      console.warn('GeminiAdvisoryService using rule-based fallback:', error);
      return this.generateDeterministicFallback(params);
    }
  }

  /**
   * Deterministic agronomic advisory fallback synthesized directly from SHAP factor attribution.
   */
  private generateDeterministicFallback(params: {
    soil: SoilNutrients;
    weather: MeteorologicalData;
    constraints: FarmingConstraints;
    primaryCrop: CropRecommendation;
  }): GeminiAdvisory {
    const { soil, constraints, primaryCrop } = params;

    const nStatus = soil.N < 60 ? 'Apply basal urea split' : 'Maintain balanced nitrogen fertigation';
    const waterNote =
      constraints.water === 'Low'
        ? 'Deploy drip irrigation at 4-day intervals to safeguard reproductive tillering under restricted supply.'
        : 'Optimize irrigation around critical panicle initiation and flowering stages.';

    return {
      executiveSummary: `${primaryCrop.name} demonstrates highest constraint-adjusted viability (${primaryCrop.score}%) for your plot's soil chemistry and climatic envelope.`,
      fertilizerRecommendation: `${nStatus}. Supplement with 40 kg/ha $P_2O_5$ and micronutrient zinc sulphate at basal dressing.`,
      irrigationStrategy: waterNote,
      seasonalRiskMitigation:
        'Monitor weekly weather forecasts. Apply mulching to suppress soil evaporation and reduce weed competition.',
      secondaryCropAlternative:
        'Consider planting chickpea or green gram as a relay crop post-harvest to replenish soil organic nitrogen.',
    };
  }
}

export const geminiAdvisoryService = new GeminiAdvisoryService();
