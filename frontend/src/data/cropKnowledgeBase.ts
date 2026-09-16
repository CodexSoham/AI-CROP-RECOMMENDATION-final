import { GrowingSeason, WaterConstraint, WaterRequirementLevel, BudgetConstraint, FarmLocation } from '../types';

export interface CropAgronomicProfile {
  id: string;
  name: string;
  scientificName: string;
  category: 'Cereal' | 'Pulse' | 'Cash Crop' | 'Horticulture' | 'Fruit' | 'Fiber';
  centroid: {
    N: number;
    P: number;
    K: number;
    pH: number;
    temp: number;
    humidity: number;
    rainfall: number; // annualized / seasonal mm
  };
  tolerances: {
    N: number;
    P: number;
    K: number;
    pH: number;
    temp: number;
    humidity: number;
    rainfall: number;
  };
  waterRequirement: WaterRequirementLevel;
  budgetRequirement: BudgetConstraint;
  seasons: GrowingSeason[];
  expectedYield: string;
  profitabilityIndex: 'Very High' | 'High' | 'Moderate';
  description: string;
}

export const CROP_PROFILES: CropAgronomicProfile[] = [
  {
    id: 'rice',
    name: 'Rice',
    scientificName: 'Oryza sativa',
    category: 'Cereal',
    centroid: { N: 80, P: 48, K: 40, pH: 6.5, temp: 24, humidity: 82, rainfall: 220 },
    tolerances: { N: 30, P: 20, K: 20, pH: 1.0, temp: 6, humidity: 15, rainfall: 80 },
    waterRequirement: 'High',
    budgetRequirement: 'Moderate',
    seasons: ['Kharif', 'Year-Round'],
    expectedYield: '4.8 - 6.2 t/ha',
    profitabilityIndex: 'High',
    description: 'High water requirement staple. Flourishes in clayey-loam soils with prolonged water availability.',
  },
  {
    id: 'maize',
    name: 'Maize',
    scientificName: 'Zea mays',
    category: 'Cereal',
    centroid: { N: 78, P: 48, K: 20, pH: 6.5, temp: 22, humidity: 65, rainfall: 85 },
    tolerances: { N: 35, P: 25, K: 15, pH: 1.2, temp: 7, humidity: 20, rainfall: 40 },
    waterRequirement: 'Moderate',
    budgetRequirement: 'Moderate',
    seasons: ['Kharif', 'Rabi', 'Year-Round'],
    expectedYield: '5.2 - 7.0 t/ha',
    profitabilityIndex: 'High',
    description: 'Versatile cereal with excellent drought-escape mechanisms and wide climatic tolerance.',
  },
  {
    id: 'cotton',
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    category: 'Fiber',
    centroid: { N: 118, P: 46, K: 19, pH: 6.8, temp: 24, humidity: 80, rainfall: 80 },
    tolerances: { N: 40, P: 20, K: 15, pH: 1.2, temp: 6, humidity: 18, rainfall: 35 },
    waterRequirement: 'Moderate',
    budgetRequirement: 'High',
    seasons: ['Kharif', 'Year-Round'],
    expectedYield: '2.4 - 3.2 t/ha lint',
    profitabilityIndex: 'Very High',
    description: 'High-value commercial cash crop requiring substantial Nitrogen and deep black soils.',
  },
  {
    id: 'chickpea',
    name: 'Chickpea',
    scientificName: 'Cicer arietinum',
    category: 'Pulse',
    centroid: { N: 40, P: 68, K: 79, pH: 7.2, temp: 19, humidity: 17, rainfall: 45 },
    tolerances: { N: 25, P: 25, K: 20, pH: 1.0, temp: 5, humidity: 15, rainfall: 25 },
    waterRequirement: 'Low',
    budgetRequirement: 'Low',
    seasons: ['Rabi'],
    expectedYield: '1.8 - 2.6 t/ha',
    profitabilityIndex: 'High',
    description: 'Remarkably drought-resilient legume with deep taproots and biological Nitrogen fixation.',
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    category: 'Cash Crop',
    centroid: { N: 130, P: 60, K: 50, pH: 6.8, temp: 28, humidity: 75, rainfall: 180 },
    tolerances: { N: 35, P: 25, K: 25, pH: 1.0, temp: 5, humidity: 15, rainfall: 60 },
    waterRequirement: 'High',
    budgetRequirement: 'High',
    seasons: ['Year-Round', 'Kharif'],
    expectedYield: '85 - 110 t/ha',
    profitabilityIndex: 'Very High',
    description: 'Heavy vegetative biomass crop requiring massive water volumes and intensive upfront investment.',
  },
  {
    id: 'pigeonpeas',
    name: 'Pigeonpeas (Arhar)',
    scientificName: 'Cajanus cajan',
    category: 'Pulse',
    centroid: { N: 21, P: 68, K: 20, pH: 5.8, temp: 28, humidity: 48, rainfall: 150 },
    tolerances: { N: 20, P: 25, K: 15, pH: 1.4, temp: 6, humidity: 25, rainfall: 60 },
    waterRequirement: 'Low',
    budgetRequirement: 'Low',
    seasons: ['Kharif'],
    expectedYield: '1.5 - 2.2 t/ha',
    profitabilityIndex: 'Moderate',
    description: 'Deep-rooted hardy pulse suitable for intercropping and low-input rainfed ecosystems.',
  },
  {
    id: 'grapes',
    name: 'Grapes',
    scientificName: 'Vitis vinifera',
    category: 'Horticulture',
    centroid: { N: 23, P: 132, K: 200, pH: 6.2, temp: 24, humidity: 82, rainfall: 70 },
    tolerances: { N: 18, P: 35, K: 30, pH: 0.9, temp: 7, humidity: 15, rainfall: 30 },
    waterRequirement: 'Moderate',
    budgetRequirement: 'High',
    seasons: ['Year-Round'],
    expectedYield: '22 - 30 t/ha',
    profitabilityIndex: 'Very High',
    description: 'Premium horticulture crop famous in Maharashtra (Sangli/Nashik) requiring elevated Potassium.',
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    scientificName: 'Punica granatum',
    category: 'Fruit',
    centroid: { N: 19, P: 19, K: 40, pH: 6.8, temp: 22, humidity: 90, rainfall: 108 },
    tolerances: { N: 15, P: 15, K: 15, pH: 1.5, temp: 8, humidity: 15, rainfall: 40 },
    waterRequirement: 'Low',
    budgetRequirement: 'Moderate',
    seasons: ['Year-Round'],
    expectedYield: '12 - 18 t/ha',
    profitabilityIndex: 'Very High',
    description: 'Highly drought-tolerant arid fruit with remarkable market value and drip-irrigation efficiency.',
  },
  {
    id: 'kidneybeans',
    name: 'Kidney Beans (Rajma)',
    scientificName: 'Phaseolus vulgaris',
    category: 'Pulse',
    centroid: { N: 21, P: 68, K: 20, pH: 5.7, temp: 20, humidity: 22, rainfall: 106 },
    tolerances: { N: 20, P: 25, K: 15, pH: 1.0, temp: 6, humidity: 15, rainfall: 45 },
    waterRequirement: 'Moderate',
    budgetRequirement: 'Moderate',
    seasons: ['Rabi', 'Kharif'],
    expectedYield: '1.6 - 2.4 t/ha',
    profitabilityIndex: 'High',
    description: 'Nutrient-rich pulse favoring slightly acidic to neutral soils with cool nighttime temperatures.',
  },
  {
    id: 'mothbeans',
    name: 'Moth Beans',
    scientificName: 'Vigna aconitifolia',
    category: 'Pulse',
    centroid: { N: 21, P: 48, K: 20, pH: 6.8, temp: 28, humidity: 53, rainfall: 52 },
    tolerances: { N: 15, P: 20, K: 15, pH: 1.2, temp: 7, humidity: 25, rainfall: 30 },
    waterRequirement: 'Low',
    budgetRequirement: 'Low',
    seasons: ['Kharif'],
    expectedYield: '0.8 - 1.4 t/ha',
    profitabilityIndex: 'Moderate',
    description: 'Ultimate drought-escape legume capable of yielding in acute arid conditions.',
  },
  {
    id: 'banana',
    name: 'Banana',
    scientificName: 'Musa acuminata',
    category: 'Fruit',
    centroid: { N: 100, P: 82, K: 50, pH: 6.0, temp: 27, humidity: 80, rainfall: 105 },
    tolerances: { N: 30, P: 25, K: 20, pH: 1.0, temp: 6, humidity: 15, rainfall: 40 },
    waterRequirement: 'High',
    budgetRequirement: 'High',
    seasons: ['Year-Round'],
    expectedYield: '45 - 65 t/ha',
    profitabilityIndex: 'Very High',
    description: 'Intense feeder requiring high Nitrogen, high soil moisture, and capital-intensive inputs.',
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    scientificName: 'Citrullus lanatus',
    category: 'Horticulture',
    centroid: { N: 99, P: 18, K: 50, pH: 6.5, temp: 26, humidity: 85, rainfall: 51 },
    tolerances: { N: 30, P: 15, K: 20, pH: 1.0, temp: 5, humidity: 15, rainfall: 25 },
    waterRequirement: 'Moderate',
    budgetRequirement: 'Moderate',
    seasons: ['Year-Round'],
    expectedYield: '25 - 35 t/ha',
    profitabilityIndex: 'High',
    description: 'Fast-growing warm season cucurbit providing rapid cash turnaround.',
  },
  {
    id: 'coffee',
    name: 'Coffee',
    scientificName: 'Coffea arabica',
    category: 'Cash Crop',
    centroid: { N: 102, P: 29, K: 30, pH: 6.8, temp: 26, humidity: 59, rainfall: 158 },
    tolerances: { N: 30, P: 15, K: 15, pH: 1.0, temp: 5, humidity: 20, rainfall: 50 },
    waterRequirement: 'Moderate',
    budgetRequirement: 'High',
    seasons: ['Year-Round'],
    expectedYield: '1.2 - 2.0 t/ha clean beans',
    profitabilityIndex: 'Very High',
    description: 'High-elevation shade-grown plantation cash crop with consistent export premium.',
  },
];

export const FARM_PRESETS: FarmLocation[] = [
  {
    id: 'sangli-a',
    name: 'Sangli Plot A (Maharashtra)',
    region: 'Deccan Vertisol Basin',
    latitude: 16.8524,
    longitude: 74.5815,
  },
  {
    id: 'nashik-valley',
    name: 'Nashik Valley Plot B',
    region: 'North Maharashtra Horticultural Zone',
    latitude: 19.9975,
    longitude: 73.7898,
  },
  {
    id: 'punjab-north',
    name: 'Ludhiana North Farm',
    region: 'Indo-Gangetic Alluvial Basin',
    latitude: 30.901,
    longitude: 75.8573,
  },
  {
    id: 'karnataka-dryland',
    name: 'Raichur Dryland Holding',
    region: 'Krishna-Tungabhadra Semi-Arid Belt',
    latitude: 16.2076,
    longitude: 77.3463,
  },
];

export const PRESET_FARMS = [
  {
    id: 'sangli-a',
    name: 'Sangli Plot A (Maharashtra)',
    location: 'Sangli, Maharashtra, India',
    areaAcres: 4.5,
    latitude: 16.8524,
    longitude: 74.5815,
    soil: { N: 82, P: 48, K: 41, pH: 6.7, organicCarbon: 0.68, soilType: 'Black Cotton Vertisol' },
    constraints: { water: 'Low' as WaterConstraint, budget: 'Moderate' as BudgetConstraint, season: 'Kharif' as GrowingSeason },
  },
  {
    id: 'nashik-vineyard',
    name: 'Nashik Valley Plot B',
    location: 'Nashik, Maharashtra, India',
    areaAcres: 8.0,
    latitude: 19.9975,
    longitude: 73.7898,
    soil: { N: 35, P: 110, K: 185, pH: 6.4, organicCarbon: 0.85, soilType: 'Well-Drained Red Loam' },
    constraints: { water: 'Moderate' as WaterConstraint, budget: 'High' as BudgetConstraint, season: 'Year-Round' as GrowingSeason },
  },
  {
    id: 'punjab-wheat',
    name: 'Ludhiana North Farm',
    location: 'Ludhiana, Punjab, India',
    areaAcres: 12.0,
    latitude: 30.901,
    longitude: 75.8573,
    soil: { N: 95, P: 62, K: 45, pH: 7.4, organicCarbon: 0.55, soilType: 'Alluvial Loam' },
    constraints: { water: 'Plentiful' as WaterConstraint, budget: 'High' as BudgetConstraint, season: 'Rabi' as GrowingSeason },
  },
  {
    id: 'karnataka-semiarid',
    name: 'Raichur Dryland Holding',
    location: 'Raichur, Karnataka, India',
    areaAcres: 6.2,
    latitude: 16.2076,
    longitude: 77.3463,
    soil: { N: 38, P: 55, K: 75, pH: 7.8, organicCarbon: 0.42, soilType: 'Shallow Red Sandy Loam' },
    constraints: { water: 'Low' as WaterConstraint, budget: 'Low' as BudgetConstraint, season: 'Kharif' as GrowingSeason },
  },
];
