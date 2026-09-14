export type WaterConstraint = 'Plentiful' | 'Moderate' | 'Low';
export type WaterRequirementLevel = 'Low' | 'Moderate' | 'High';
export type BudgetConstraint = 'Low' | 'Moderate' | 'High';
export type GrowingSeason = 'Kharif' | 'Rabi' | 'Year-Round';

export interface FarmLocation {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
}

export interface SoilNutrients {
  N: number; // Nitrogen (kg/ha or mg/kg) [0 - 150]
  P: number; // Phosphorus (kg/ha) [0 - 150]
  K: number; // Potassium (kg/ha) [0 - 200]
  pH: number; // Soil pH [3.5 - 9.5]
  organicCarbon?: number; // %
  soilType?: string;
}

export interface MeteorologicalData {
  temperature: number; // °C
  humidity: number; // %
  rainfallForecast16d: number; // mm
  annualizedRainfallEst: number; // mm
  windSpeed: number; // km/h
  weatherCode: number;
  source: 'open-meteo' | 'simulated-meteorological';
  locationName: string;
  latitude: number;
  longitude: number;
}

export interface FarmingConstraints {
  water: WaterConstraint;
  budget: BudgetConstraint;
  season: GrowingSeason;
}

export interface ShapFactor {
  feature: string;
  impact: number; // e.g. +45% or -12%
  rawVal: number | string;
  optimalVal: string;
  description: string;
  type: 'positive' | 'negative';
}

export interface CropRecommendation {
  id: string;
  name: string;
  scientificName: string;
  category: 'Cereal' | 'Pulse' | 'Cash Crop' | 'Horticulture' | 'Fruit' | 'Fiber';
  rawScore: number; // Raw ML ensemble suitability %
  score: number; // Constraint-adjusted suitability %
  rank: 1 | 2 | 3 | number;
  badge: 'Optimal Fit' | 'High Suitability' | 'Adjusted' | 'Alternative' | 'Constraint Penalized';
  waterNeed: 'Low' | 'Moderate' | 'High';
  budgetNeed: 'Low' | 'Moderate' | 'High';
  idealSeason: GrowingSeason[];
  adjustmentReason?: string;
  keyStrengths: string[];
  riskFactors: string[];
  expectedYield: string; // e.g. "4.8 - 5.5 t/ha"
  profitabilityIndex: 'Very High' | 'High' | 'Moderate';
  colorCode: string;
  iconName: string;
}

export interface GeminiAdvisory {
  executiveSummary: string;
  fertilizerRecommendation: string;
  irrigationStrategy: string;
  seasonalRiskMitigation: string;
  secondaryCropAlternative?: string;
}

export interface FieldProfile {
  id: string;
  name: string;
  location: string;
  areaAcres: number;
  latitude: number;
  longitude: number;
  soil: SoilNutrients;
  constraints: FarmingConstraints;
}

export interface WhatIfState {
  rainfallDeltaPercent: number; // e.g. -30%
  tempDelta: number; // e.g. +2°C
  nitrogenDelta: number; // e.g. +20
  waterOverride: WaterConstraint | 'Inherit';
}

export type GrowthStageKey = 'sowing' | 'vegetative' | 'flowering' | 'harvest';

export interface GrowthStageInfo {
  key: GrowthStageKey;
  name: string;
  subTitle: string;
  stageNumber: 1 | 2 | 3 | 4;
  startDay: number; // e.g. 0
  endDay: number; // e.g. 25
  durationDays: number;
  startDate: string; // "Sep 13, 2026"
  endDate: string; // "Oct 08, 2026"
  isoStartDate: string; // "2026-09-13"
  isoEndDate: string; // "2026-10-08"
  status: 'completed' | 'active' | 'upcoming';
  progressPercent: number; // 0 to 100 within this stage
  iconName: string;
  summary: string;
  criticalTasks: string[];
  waterRequirementTip: string;
  nutrientRecommendation: string;
  riskAlert: string;
}

export interface CropLifecycleTimelineData {
  cropId: string;
  cropName: string;
  totalDurationDays: number;
  sowingDate: string; // "2026-09-13"
  harvestDate: string; // "2027-01-16"
  currentDate: string; // "2026-09-13"
  currentStageKey: GrowthStageKey | 'pre-sowing' | 'post-harvest';
  currentStageName: string;
  daysElapsed: number;
  daysRemaining: number;
  overallProgressPercent: number; // 0 to 100
  stages: GrowthStageInfo[];
  seasonAlignment: string;
  managementAlert: string;
}
