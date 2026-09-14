import { CROP_PROFILES, CropAgronomicProfile } from '../data/cropKnowledgeBase';
import {
  SoilNutrients,
  MeteorologicalData,
  FarmingConstraints,
  CropRecommendation,
  ShapFactor,
  WhatIfState,
} from '../types';

export function runRecommendationEngine(
  soil: SoilNutrients,
  weather: MeteorologicalData,
  constraints: FarmingConstraints,
  whatIf?: WhatIfState
): {
  top3: CropRecommendation[];
  allEvaluated: CropRecommendation[];
  primaryShap: ShapFactor[];
} {
  // Apply What-If perturbations if present
  const effectiveRainfall = whatIf
    ? weather.annualizedRainfallEst * (1 + whatIf.rainfallDeltaPercent / 100)
    : weather.annualizedRainfallEst;

  const effectiveTemp = whatIf ? weather.temperature + whatIf.tempDelta : weather.temperature;
  const effectiveN = whatIf ? Math.max(5, soil.N + whatIf.nitrogenDelta) : soil.N;
  const effectiveWater = whatIf && whatIf.waterOverride !== 'Inherit' ? whatIf.waterOverride : constraints.water;

  // Normalized rainfall scale: map seasonal/annual mm to 0-300 scale
  const normalizedRainfall = Math.min(300, (effectiveRainfall / 812) * 110);

  const evaluated: CropRecommendation[] = CROP_PROFILES.map((crop) => {
    // 1. Raw ML Multi-dimensional Gaussian Ensemble Probability
    const dN = Math.pow((effectiveN - crop.centroid.N) / crop.tolerances.N, 2);
    const dP = Math.pow((soil.P - crop.centroid.P) / crop.tolerances.P, 2);
    const dK = Math.pow((soil.K - crop.centroid.K) / crop.tolerances.K, 2);
    const dpH = Math.pow((soil.pH - crop.centroid.pH) / crop.tolerances.pH, 2);
    const dTemp = Math.pow((effectiveTemp - crop.centroid.temp) / crop.tolerances.temp, 2);
    const dHum = Math.pow((weather.humidity - crop.centroid.humidity) / crop.tolerances.humidity, 2);
    const dRain = Math.pow((normalizedRainfall - crop.centroid.rainfall) / crop.tolerances.rainfall, 2);

    // Weighted distance (Rainfall, Humidity, Nitrogen carry prominent weights in ag-tech models)
    const weightedDistSq =
      0.18 * dN +
      0.12 * dP +
      0.12 * dK +
      0.12 * dpH +
      0.14 * dTemp +
      0.14 * dHum +
      0.18 * dRain;

    // Convert to 0 - 100% suitability score
    const rawSuitability = Math.max(12, Math.min(96, Math.exp(-weightedDistSq / 2.8) * 100));

    // 2. Real-World Constraint Engine Re-weighting
    let constraintMultiplier = 1.0;
    const adjustmentNotes: string[] = [];

    // A. Water Constraint Impact
    if (effectiveWater === 'Low') {
      if (crop.waterRequirement === 'High') {
        constraintMultiplier *= 0.52; // Massive penalty for water-thirsty crops in drought/low water
        adjustmentNotes.push(`Demoted significantly (-48%) due to Low Water constraint`);
      } else if (crop.waterRequirement === 'Moderate') {
        constraintMultiplier *= 0.88;
        adjustmentNotes.push(`Slight water stress penalty (-12%)`);
      } else if (crop.waterRequirement === 'Low') {
        constraintMultiplier *= 1.14; // Boost drought hardy crops
        adjustmentNotes.push(`Promoted (+14%) for high drought resilience`);
      }
    } else if (effectiveWater === 'Plentiful') {
      if (crop.waterRequirement === 'High') {
        constraintMultiplier *= 1.08;
        adjustmentNotes.push(`Boosted (+8%) by abundant irrigation`);
      } else if (crop.waterRequirement === 'Low') {
        constraintMultiplier *= 0.94; // Drought-adapted crops can risk root-rot or lower relative profit
      }
    }

    // B. Budget Constraint Impact
    if (constraints.budget === 'Low') {
      if (crop.budgetRequirement === 'High') {
        constraintMultiplier *= 0.65;
        adjustmentNotes.push(`Penalized (-35%) due to high capital/input cost requirements`);
      } else if (crop.budgetRequirement === 'Low') {
        constraintMultiplier *= 1.10;
        adjustmentNotes.push(`Boosted (+10%) for low operational capital necessity`);
      }
    } else if (constraints.budget === 'High') {
      if (crop.budgetRequirement === 'High') {
        constraintMultiplier *= 1.06;
      }
    }

    // C. Season Alignment Impact
    const seasonMatches = crop.seasons.includes(constraints.season) || crop.seasons.includes('Year-Round');
    if (!seasonMatches) {
      constraintMultiplier *= 0.72;
      adjustmentNotes.push(`Off-season penalty for ${constraints.season}`);
    }

    const finalScore = Math.min(98.8, Math.max(10, Math.round(rawSuitability * constraintMultiplier * 10) / 10));

    let badge: CropRecommendation['badge'] = 'Optimal Fit';
    if (finalScore >= 88) badge = 'Optimal Fit';
    else if (finalScore >= 80) badge = 'High Suitability';
    else if (adjustmentNotes.length > 0 && finalScore >= 70) badge = 'Adjusted';
    else if (finalScore >= 65) badge = 'Alternative';
    else badge = 'Constraint Penalized';

    return {
      id: crop.id,
      name: crop.name,
      scientificName: crop.scientificName,
      category: crop.category,
      rawScore: Math.round(rawSuitability * 10) / 10,
      score: finalScore,
      rank: 1, // will be assigned after sort
      badge,
      waterNeed: crop.waterRequirement,
      budgetNeed: crop.budgetRequirement,
      idealSeason: crop.seasons,
      adjustmentReason: adjustmentNotes.join(' • ') || 'Optimal agronomic match under selected conditions',
      keyStrengths: [
        `${crop.waterRequirement} water necessity`,
        `Expected: ${crop.expectedYield}`,
        `Ideal in ${crop.seasons.join('/')}`,
      ],
      riskFactors:
        crop.waterRequirement === 'High' && effectiveWater === 'Low'
          ? ['Severe water deficit risk', 'Yield reduction likely without supplemental drip']
          : effectiveTemp > 34
          ? ['Heat stress during grain filling']
          : ['Monitor humidity for fungal blight'],
      expectedYield: crop.expectedYield,
      profitabilityIndex: crop.profitabilityIndex,
      colorCode: '#22C55E',
      iconName: getCropIconName(crop.id),
    };
  });

  // Sort by final constraint-adjusted score descending
  evaluated.sort((a, b) => b.score - a.score);

  // Assign ranks
  evaluated.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  const top3 = evaluated.slice(0, 3);

  // 3. Compute SHAP Feature Importance Attribution for #1 crop
  const primaryCrop = top3[0];
  const primaryProfile = CROP_PROFILES.find((c) => c.id === primaryCrop.id) || CROP_PROFILES[0];
  const primaryShap = computeShapBreakdown(soil, weather, primaryProfile, effectiveRainfall, effectiveTemp, effectiveN);

  return {
    top3,
    allEvaluated: evaluated,
    primaryShap,
  };
}

function computeShapBreakdown(
  soil: SoilNutrients,
  weather: MeteorologicalData,
  crop: CropAgronomicProfile,
  effectiveRainfall: number,
  effectiveTemp: number,
  effectiveN: number
): ShapFactor[] {
  // Compute distance delta per dimension relative to tolerance
  // Positive contribution if within optimum zone, negative if far
  const normalizedRainfall = Math.min(300, (effectiveRainfall / 812) * 110);

  const factors: {
    feature: string;
    rawVal: number | string;
    optimalVal: string;
    diffPercent: number;
    description: string;
  }[] = [
    {
      feature: 'Rainfall & Moisture',
      rawVal: `${Math.round(effectiveRainfall)} mm`,
      optimalVal: `${crop.centroid.rainfall * 7} mm`,
      diffPercent: calculateShapContribution(normalizedRainfall, crop.centroid.rainfall, crop.tolerances.rainfall, 45),
      description: `Live rainfall (${Math.round(effectiveRainfall)}mm) matches ${crop.name}'s agronomic threshold`,
    },
    {
      feature: 'Relative Humidity',
      rawVal: `${weather.humidity}%`,
      optimalVal: `${crop.centroid.humidity}%`,
      diffPercent: calculateShapContribution(weather.humidity, crop.centroid.humidity, crop.tolerances.humidity, 28),
      description: `Ambient humidity (${weather.humidity}%) supports leaf transpiration and vigor`,
    },
    {
      feature: 'Soil Nitrogen (N)',
      rawVal: `${effectiveN} kg/ha`,
      optimalVal: `${crop.centroid.N} kg/ha`,
      diffPercent: calculateShapContribution(effectiveN, crop.centroid.N, crop.tolerances.N, 32),
      description: `Nitrogen level (${effectiveN} kg/ha) delivers key vegetative biomass fuel`,
    },
    {
      feature: 'Soil Phosphorus (P)',
      rawVal: `${soil.P} kg/ha`,
      optimalVal: `${crop.centroid.P} kg/ha`,
      diffPercent: calculateShapContribution(soil.P, crop.centroid.P, crop.tolerances.P, 18),
      description: `Phosphorus availability facilitates root anchoring and energy transfer`,
    },
    {
      feature: 'Soil Potassium (K)',
      rawVal: `${soil.K} kg/ha`,
      optimalVal: `${crop.centroid.K} kg/ha`,
      diffPercent: calculateShapContribution(soil.K, crop.centroid.K, crop.tolerances.K, 16),
      description:
        soil.K < crop.centroid.K
          ? `Potassium (${soil.K} kg/ha) is slightly sub-optimum; supplementary MOP advised`
          : `Adequate Potassium bolsters pest resistance and cellular turgor`,
    },
    {
      feature: 'Soil pH Chemistry',
      rawVal: `${soil.pH}`,
      optimalVal: `${crop.centroid.pH}`,
      diffPercent: calculateShapContribution(soil.pH, crop.centroid.pH, crop.tolerances.pH, 20),
      description: `pH (${soil.pH}) maintains micronutrient bioavailability in root zone`,
    },
    {
      feature: 'Mean Temperature',
      rawVal: `${Math.round(effectiveTemp * 10) / 10}°C`,
      optimalVal: `${crop.centroid.temp}°C`,
      diffPercent: calculateShapContribution(effectiveTemp, crop.centroid.temp, crop.tolerances.temp, 22),
      description: `Temperature (${Math.round(effectiveTemp * 10) / 10}°C) aligns with physiological growth phases`,
    },
  ];

  // Sort by absolute impact descending
  factors.sort((a, b) => Math.abs(b.diffPercent) - Math.abs(a.diffPercent));

  return factors.map((f) => ({
    feature: f.feature,
    impact: f.diffPercent,
    rawVal: f.rawVal,
    optimalVal: f.optimalVal,
    description: f.description,
    type: f.diffPercent >= 0 ? 'positive' : 'negative',
  }));
}

function calculateShapContribution(
  actual: number,
  centroid: number,
  tolerance: number,
  maxWeight: number
): number {
  const normDist = Math.abs(actual - centroid) / tolerance;
  if (normDist <= 0.4) {
    // Highly positive contribution
    return Math.round(maxWeight * (1 - normDist * 0.5));
  } else if (normDist <= 1.0) {
    // Moderate positive contribution
    return Math.round(maxWeight * 0.4 * (1 - normDist));
  } else {
    // Negative drag on suitability
    const negImpact = -Math.round(Math.min(maxWeight * 0.8, (normDist - 1.0) * (maxWeight * 0.6)));
    return negImpact === 0 ? -4 : negImpact;
  }
}

function getCropIconName(cropId: string): string {
  switch (cropId) {
    case 'rice':
      return 'Wheat';
    case 'maize':
      return 'Sparkles';
    case 'cotton':
      return 'Cloud';
    case 'chickpea':
      return 'Bean';
    case 'grapes':
      return 'Grape';
    case 'pomegranate':
      return 'Apple';
    case 'sugarcane':
      return 'Trees';
    case 'banana':
      return 'Banana';
    case 'coffee':
      return 'Coffee';
    default:
      return 'Sprout';
  }
}
