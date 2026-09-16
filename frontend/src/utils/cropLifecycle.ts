import { GrowthStageInfo, GrowthStageKey, CropLifecycleTimelineData } from '../types';

interface StageBlueprint {
  key: GrowthStageKey;
  name: string;
  subTitle: string;
  stageNumber: 1 | 2 | 3 | 4;
  durationDays: number;
  iconName: string;
  summary: string;
  criticalTasks: string[];
  waterRequirementTip: string;
  nutrientRecommendation: string;
  riskAlert: string;
}

interface CropLifecycleBlueprint {
  cropId: string;
  defaultSeason: string;
  totalDurationDays: number;
  stages: [StageBlueprint, StageBlueprint, StageBlueprint, StageBlueprint];
}

export const CROP_LIFECYCLE_PROFILES: Record<string, CropLifecycleBlueprint> = {
  rice: {
    cropId: 'rice',
    defaultSeason: 'Kharif / Wet Season',
    totalDurationDays: 125,
    stages: [
      {
        key: 'sowing',
        name: 'Sowing & Nursery',
        subTitle: 'Germination & Seedling Emergence',
        stageNumber: 1,
        durationDays: 25,
        iconName: 'Sprout',
        summary: 'Seed soaking, nursery seedbed preparation, emergence, and seedling raising before field transplanting.',
        criticalTasks: [
          'Pre-germinate seeds with salt solution selection',
          'Treat seeds with Carbendazim (2g/kg seed)',
          'Apply basal dose of DAP and zinc sulphate in nursery',
        ],
        waterRequirementTip: 'Maintain saturated soil (thin film of water, 1-2 cm) during nursery phase.',
        nutrientRecommendation: 'Basal application: 25% Nitrogen, 100% Phosphorus, and 50% Potassium.',
        riskAlert: 'Prevent seed rot and damping-off if soil remains excessively flooded before germination.',
      },
      {
        key: 'vegetative',
        name: 'Vegetative',
        subTitle: 'Tillering & Panicle Initiation',
        stageNumber: 2,
        durationDays: 40,
        iconName: 'Leaf',
        summary: 'Rapid root anchoring, active tillering (canopy expansion), and early panicle primordium differentiation.',
        criticalTasks: [
          'Field transplanting at 20x15 cm spacing (2-3 seedlings/hill)',
          'First hand weeding or post-emergence herbicide (Pretilachlor)',
          'First urea top-dressing at 21 days after transplanting',
        ],
        waterRequirementTip: 'Maintain shallow standing water (3-5 cm) to suppress weed emergence.',
        nutrientRecommendation: 'Top-dress 50% of remaining Nitrogen split into two equal doses.',
        riskAlert: 'Watch for Yellow Stem Borer larvae and leaf folder pest attacks on succulent tillers.',
      },
      {
        key: 'flowering',
        name: 'Flowering',
        subTitle: 'Booting, Anthesis & Heading',
        stageNumber: 3,
        durationDays: 30,
        iconName: 'Flower2',
        summary: 'Panicle emergence, flower opening (anthesis), pollination, and milk stage grain filling.',
        criticalTasks: [
          'Inspect flag leaves for blast disease lesions',
          'Apply prophylactic spray for brown planthopper if humidity exceeds 85%',
          'Final booster spray of Potassium Nitrate (1%) for grain density',
        ],
        waterRequirementTip: 'CRITICAL: Keep constant 5 cm water depth. Moisture stress at flowering causes spikelet sterility.',
        nutrientRecommendation: 'Apply remaining 25% Nitrogen top-dress + Potassium supplement.',
        riskAlert: 'Severe yield penalty if dry spell occurs during 10-day peak flowering window.',
      },
      {
        key: 'harvest',
        name: 'Harvest & Ripening',
        subTitle: 'Dough Stage, Physiological Maturity & Reaping',
        stageNumber: 4,
        durationDays: 30,
        iconName: 'Wheat',
        summary: 'Grains turn golden yellow, moisture content decreases to 18-20%, physiological cutting and threshing.',
        criticalTasks: [
          'Drain field water 10–12 days before planned cutting',
          'Harvest when 85% of panicles have golden-straw coloration',
          'Sun-dry grains on threshing floor down to 12–14% moisture storage level',
        ],
        waterRequirementTip: 'Strictly stop irrigation 10-14 days prior to harvest for firm soil footing.',
        nutrientRecommendation: 'No further chemical fertilizers required; prepare stubble management.',
        riskAlert: 'Untimely late rains can cause lodged crops and grain germination on panicle.',
      },
    ],
  },
  maize: {
    cropId: 'maize',
    defaultSeason: 'Kharif / Rabi All-Season',
    totalDurationDays: 105,
    stages: [
      {
        key: 'sowing',
        name: 'Sowing & Germination',
        subTitle: 'Seedbed Seeding & Coleoptile Emergence',
        stageNumber: 1,
        durationDays: 15,
        iconName: 'Sprout',
        summary: 'Precision seed drilling into well-aerated ridge and furrow seedbed with optimal soil moisture.',
        criticalTasks: [
          'Sow seeds at 60x20 cm spacing, 3–5 cm depth',
          'Treat seeds with Thiamethoxam for Fall Armyworm defense',
          'Apply full P, K, and 30% N as basal placement below seed level',
        ],
        waterRequirementTip: 'Moist seedbed required; avoid water stagnation which suffocates maize seedlings.',
        nutrientRecommendation: 'Apply 35 kg N, 60 kg P2O5, 40 kg K2O/ha at sowing time.',
        riskAlert: 'Avoid crusting in heavy clay soils which impedes coleoptile emergence.',
      },
      {
        key: 'vegetative',
        name: 'Vegetative',
        subTitle: 'Knee-High to V8 Leaf Stage',
        stageNumber: 2,
        durationDays: 35,
        iconName: 'Leaf',
        summary: 'Vigorous stem elongation, nodal root establishment, and rapid leaf collar development.',
        criticalTasks: [
          'Inter-cultivation and earthing up at knee-high stage (30 DAS)',
          'Top-dress Nitrogen (Urea) along rows before earthing up',
          'Monitor whorl leaves for early Fall Armyworm (FAW) pinhole damage',
        ],
        waterRequirementTip: 'Irrigate every 8–10 days depending on soil type. Keep root zone aerated.',
        nutrientRecommendation: 'Top-dress 50% total Nitrogen at knee-high stage.',
        riskAlert: 'Fall Armyworm whorl feeding is most damaging during this vegetative window.',
      },
      {
        key: 'flowering',
        name: 'Flowering',
        subTitle: 'Tasseling, Silking & Pollination',
        stageNumber: 3,
        durationDays: 25,
        iconName: 'Flower2',
        summary: 'Tassel pollen shedding, silk emergence from ear shoots, and fertilization of ovules.',
        criticalTasks: [
          'Maintain absolute soil moisture; zero water stress allowed',
          'Foliar spray with zinc sulphate (0.5%) if interveinal chlorosis is visible',
          'Check ear tips for corn earworm entry',
        ],
        waterRequirementTip: 'Most critical water stage! Drought stress during silking causes barren cobs and poor grain set.',
        nutrientRecommendation: 'Top-dress remaining 20% Nitrogen at early tasseling.',
        riskAlert: 'Temperatures above 38°C with dry winds can desiccate pollen grains.',
      },
      {
        key: 'harvest',
        name: 'Harvest & Ripening',
        subTitle: 'Dent Stage, Black Layer & Cob Shelling',
        stageNumber: 4,
        durationDays: 30,
        iconName: 'Wheat',
        summary: 'Starch solidification in kernels, formation of black abscission layer at kernel base, harvesting.',
        criticalTasks: [
          'Check for black layer formation at kernel base indicating maturity',
          'De-husk cobs and sun-dry on clean tarpaulins',
          'Shell cobs when grain moisture drops below 15%',
        ],
        waterRequirementTip: 'Terminate irrigation 15 days before harvesting.',
        nutrientRecommendation: 'Harvest complete; incorporate maize stover back into soil for organic carbon.',
        riskAlert: 'High grain moisture at harvest leads to Aspergillus fungus and aflatoxin contamination.',
      },
    ],
  },
  cotton: {
    cropId: 'cotton',
    defaultSeason: 'Kharif Cash Crop',
    totalDurationDays: 160,
    stages: [
      {
        key: 'sowing',
        name: 'Sowing & Stand',
        subTitle: 'Germination & Cotyledon Emergence',
        stageNumber: 1,
        durationDays: 20,
        iconName: 'Sprout',
        summary: 'Dibbling seeds on ridges or flat beds in deep black vertisol soils with good tilth.',
        criticalTasks: [
          'Pre-sowing irrigation to ensure uniform germination',
          'Sow delinted seeds treated with Imidacloprid (5g/kg)',
          'Maintain 90x60 cm or 120x45 cm plant spacing',
        ],
        waterRequirementTip: 'Light soaking irrigation; avoid deep waterlogging in black soils.',
        nutrientRecommendation: 'Apply 20% N, 100% P, and 50% K as basal fertilizer.',
        riskAlert: 'Watch for sucking pests (aphids, jassids) on tender cotyledonary leaves.',
      },
      {
        key: 'vegetative',
        name: 'Vegetative',
        subTitle: 'Branching & Square Initiation',
        stageNumber: 2,
        durationDays: 40,
        iconName: 'Leaf',
        summary: 'Monopodial vegetative branching and first sympodial fruiting branches with floral buds (squares).',
        criticalTasks: [
          'Gap filling and thinning within 15 days of emergence',
          'First inter-row hoeing to break soil crust and control weeds',
          'Apply 1st split of Nitrogen fertilizer',
        ],
        waterRequirementTip: 'Irrigate at 12–15 day intervals; cotton roots penetrate deeply.',
        nutrientRecommendation: 'Top-dress 40% Nitrogen along with Magnesium Sulphate (10 kg/ha).',
        riskAlert: 'High humidity combined with cloudy weather induces vegetative runaway and square shedding.',
      },
      {
        key: 'flowering',
        name: 'Flowering & Boll',
        subTitle: 'White/Pink Bloom & Boll Expansion',
        stageNumber: 3,
        durationDays: 50,
        iconName: 'Flower2',
        summary: 'Continuous flowering, boll development, fiber elongation, and secondary wall deposition.',
        criticalTasks: [
          'Spray 1% Planofix (NAA) to prevent excessive flower bud and young boll drop',
          'Install pheromone traps for Pink Bollworm monitoring',
          'Foliar spray of 2% DAP or Potassium Nitrate for boll weight',
        ],
        waterRequirementTip: 'Consistent moisture needed. Alternating drought and flooding causes mass boll drop.',
        nutrientRecommendation: 'Top-dress final 40% Nitrogen and remaining Potassium.',
        riskAlert: 'Pink bollworm larvae enter developing bolls within 48 hours of egg hatching.',
      },
      {
        key: 'harvest',
        name: 'Harvest & Picking',
        subTitle: 'Boll Bursting & Fluffy Lint Picking',
        stageNumber: 4,
        durationDays: 50,
        iconName: 'Wheat',
        summary: 'Bolls burst open exposing clean white seed-cotton; manual or mechanical pickings in flushes.',
        criticalTasks: [
          'Pick cleanly opened dry bolls during morning hours after dew evaporates',
          'Keep picked cotton free from dry bracts and trash leaves',
          'Store picked seed-cotton in well-ventilated dry storage rooms',
        ],
        waterRequirementTip: 'Stop all irrigations when 40% of bolls have opened.',
        nutrientRecommendation: 'Season complete; uproot and shred cotton stalks to prevent overwintering pests.',
        riskAlert: 'Rain on open cotton bolls stains lint yellow and drastically lowers market grading.',
      },
    ],
  },
  chickpea: {
    cropId: 'chickpea',
    defaultSeason: 'Rabi Winter Season',
    totalDurationDays: 105,
    stages: [
      {
        key: 'sowing',
        name: 'Sowing & Germination',
        subTitle: 'Seed Placement & Taproot Initiation',
        stageNumber: 1,
        durationDays: 15,
        iconName: 'Sprout',
        summary: 'Sowing in residual soil moisture after Kharif crop harvest; cool seedbed temperatures favored.',
        criticalTasks: [
          'Seed inoculation with Rhizobium and Trichoderma bio-fungicide',
          'Sow at 30x10 cm spacing at 8-10 cm depth into moist soil layer',
          'Apply full dose of Phosphorus and Sulphur as basal fertilizer',
        ],
        waterRequirementTip: 'Sow into preserved subsoil moisture; usually zero irrigation needed during germination.',
        nutrientRecommendation: 'Apply 20 kg N, 40 kg P2O5, 20 kg Sulphur per hectare.',
        riskAlert: 'High soil temperatures (>28°C) at sowing can cause collar rot and wilt in seedlings.',
      },
      {
        key: 'vegetative',
        name: 'Vegetative',
        subTitle: 'Branching, Foliage & Nodulation',
        stageNumber: 2,
        durationDays: 30,
        iconName: 'Leaf',
        summary: 'Primary and secondary branch proliferation, active root nodule nitrogen fixation.',
        criticalTasks: [
          'Nipping/topping of terminal shoots at 30-35 DAS to stimulate dense lateral branching',
          'Hand weeding or light inter-cultivation before canopy closes',
          'Inspect root nodules for healthy pink leghaemoglobin color',
        ],
        waterRequirementTip: 'First light irrigation at 35-45 DAS only if winter rains fail and soil dries out.',
        nutrientRecommendation: 'No chemical nitrogen required; symbiotic bacteria fix atmospheric N2.',
        riskAlert: 'Over-irrigation in heavy soils causes excessive vegetative growth and root suffocation.',
      },
      {
        key: 'flowering',
        name: 'Flowering & Podding',
        subTitle: 'Papilionaceous Bloom & Pod Filling',
        stageNumber: 3,
        durationDays: 30,
        iconName: 'Flower2',
        summary: 'Abundant pink/white flowering, self-pollination, and green pod expansion with 1-2 seeds per pod.',
        criticalTasks: [
          'Pheromone traps for Helicoverpa armigera (gram pod borer) monitoring',
          'Prophylactic bio-spray of NPV or Neem seed kernel extract (5%)',
          'One supplemental light irrigation at early pod development stage',
        ],
        waterRequirementTip: 'Avoid heavy flood irrigation during peak flower bloom; irrigate at pod-setting stage.',
        nutrientRecommendation: 'Foliar spray of 2% Urea or 19:19:19 to boost pod development.',
        riskAlert: 'Gram pod borer caterpillars can bore holes in up to 35% of pods if left unmonitored.',
      },
      {
        key: 'harvest',
        name: 'Harvest & Threshing',
        subTitle: 'Plant Senescence & Grain Drying',
        stageNumber: 4,
        durationDays: 30,
        iconName: 'Wheat',
        summary: 'Leaves turn bronze-yellow and shed; pods rattle when shaken, indicating low grain moisture.',
        criticalTasks: [
          'Cut plants with sickles early in morning to prevent pod shattering',
          'Stack harvested plants on threshing floor to sun-cure for 3–5 days',
          'Thresh using tractor or mechanical thresher and clean grains',
        ],
        waterRequirementTip: 'Dry field conditions; moisture at harvest causes mold and grain discoloration.',
        nutrientRecommendation: 'Chickpea leaves leave 30-40 kg residual Nitrogen in soil for next crop.',
        riskAlert: 'Delaying harvest on hot windy days causes severe losses from pod shattering.',
      },
    ],
  },
  sugarcane: {
    cropId: 'sugarcane',
    defaultSeason: 'Annual / Perennial',
    totalDurationDays: 350,
    stages: [
      {
        key: 'sowing',
        name: 'Sett Planting',
        subTitle: 'Bud Sprouting & Germination',
        stageNumber: 1,
        durationDays: 45,
        iconName: 'Sprout',
        summary: 'Two or three-budded sett placement in furrows, sett treatment, and primary bud germination.',
        criticalTasks: [
          'Treat setts with Carbendazim (0.1%) for red rot protection',
          'Place setts end-to-end in furrows with 120 cm row spacing',
          'Apply basal NPK and well-rotted FYM in furrows',
        ],
        waterRequirementTip: 'Frequent light irrigations every 6-8 days until shoots establish.',
        nutrientRecommendation: 'Basal application: 25% Nitrogen, 100% Phosphorus, 30% Potassium.',
        riskAlert: 'Early shoot borer infestation on young spindle shoots can cause dead hearts.',
      },
      {
        key: 'vegetative',
        name: 'Tillering & Grand Growth',
        subTitle: 'Cane Elongation & Stalk Thickening',
        stageNumber: 2,
        durationDays: 165,
        iconName: 'Leaf',
        summary: 'Massive vegetative biomass accumulation, tiller emergence, internode formation, and canopy closure.',
        criticalTasks: [
          'Earthing up at 90 and 120 days to support heavy stalks against lodging',
          'Detrashing of lower dry senescent leaves for aeration and pest prevention',
          'Two split top-dressings of Urea with irrigation',
        ],
        waterRequirementTip: 'Peak water demand: 60-80 mm water every 7-10 days throughout summer and monsoon.',
        nutrientRecommendation: 'Apply 50% of total Nitrogen and 40% Potassium in split doses.',
        riskAlert: 'Water stress during grand growth permanently reduces internode length and tonnage.',
      },
      {
        key: 'flowering',
        name: 'Ripening & Maturation',
        subTitle: 'Sucrose Accumulation & Internode Hardening',
        stageNumber: 3,
        durationDays: 90,
        iconName: 'Flower2',
        summary: 'Vegetative growth slows down; glucose translocates into stems and converts into crystallized sucrose.',
        criticalTasks: [
          'Measure hand refractometer brix (should exceed 18-20%)',
          'Withhold nitrogen fertilization to promote sucrose synthesis',
          'Propping or trash-twisting adjacent rows to prevent cyclone lodging',
        ],
        waterRequirementTip: 'Extend irrigation intervals to 15-20 days to stress plant slightly and boost sugar content.',
        nutrientRecommendation: 'Final foliar spray of Potassium Sulphate (1%) to enhance juice purity.',
        riskAlert: 'Late application of nitrogen or excessive late watering dilutes juice and delays maturity.',
      },
      {
        key: 'harvest',
        name: 'Harvest & Crushing',
        subTitle: 'Ground-Level Cane Cutting & Ratoon Care',
        stageNumber: 4,
        durationDays: 50,
        iconName: 'Wheat',
        summary: 'Cutting stalks flush with ground level, detrashing green tops, and immediate transport to sugar mill.',
        criticalTasks: [
          'Harvest close to ground level where highest sucrose concentration resides',
          'Transport to sugar mill within 24-36 hours to avoid post-harvest inversion',
          'Stubble shaving and ratoon management for next crop cycle',
        ],
        waterRequirementTip: 'Completely stop irrigation 15 days before harvest.',
        nutrientRecommendation: 'Prepare compost/stubble digestor for ratoon management.',
        riskAlert: 'Delaying mill transport past 48 hours causes rapid inversion of sucrose into non-crystallizable sugars.',
      },
    ],
  },
  pigeonpeas: {
    cropId: 'pigeonpeas',
    defaultSeason: 'Kharif Long-Duration Pulse',
    totalDurationDays: 165,
    stages: [
      {
        key: 'sowing',
        name: 'Sowing & Germination',
        subTitle: 'Deep Seeding & Root Anchor',
        stageNumber: 1,
        durationDays: 20,
        iconName: 'Sprout',
        summary: 'Sowing with monsoon onset at wide spacing; rapid vertical taproot development down to 2 meters.',
        criticalTasks: [
          'Rhizobium culture and PSB seed dressing',
          'Line sowing at 90x20 cm or intercropped with soybean (1:2 ratio)',
          'Apply starter Nitrogen and full Phosphorus at sowing',
        ],
        waterRequirementTip: 'Moist seedbed; withstands initial dry spells due to quick taproot growth.',
        nutrientRecommendation: '25 kg N, 50 kg P2O5, 20 kg S per hectare.',
        riskAlert: 'Water stagnation in low-lying fields causes Phytophthora stem blight.',
      },
      {
        key: 'vegetative',
        name: 'Vegetative Canopy',
        subTitle: 'Woody Branching & Symbiosis',
        stageNumber: 2,
        durationDays: 50,
        iconName: 'Leaf',
        summary: 'Slow initial growth followed by aggressive lateral branching and deep soil nutrient scavenging.',
        criticalTasks: [
          'Weed management during first 45 days before wide canopy closes',
          'Inter-row cultivation to conserve soil moisture profile',
          'Monitor for blister beetles and leaf webber',
        ],
        waterRequirementTip: 'Rainfed crop; rarely requires irrigation unless severe drought persists over 4 weeks.',
        nutrientRecommendation: 'Biological nitrogen fixation active; minimal chemical fertilizer needed.',
        riskAlert: 'Avoid high density planting which encourages Fusarium wilt disease.',
      },
      {
        key: 'flowering',
        name: 'Flowering & Podding',
        subTitle: 'Indeterminate Bloom & Pod Setting',
        stageNumber: 3,
        durationDays: 50,
        iconName: 'Flower2',
        summary: 'Profuse yellow-red flowers; multiple flushes of bloom and green pod development.',
        criticalTasks: [
          'Spray for pod borer (Helicoverpa) and pod fly (Melanagromyza)',
          'Foliar spray of 1% Pulse Wonder or micronutrient mixture',
          'One protective irrigation during flowering if soil is cracked',
        ],
        waterRequirementTip: 'Critical stage for protective irrigation if winter rains fail.',
        nutrientRecommendation: 'Foliar nutrition: 2% Urea + 1% Potassium Chloride spray.',
        riskAlert: 'Pod fly maggots feed internally on developing seeds without showing external holes.',
      },
      {
        key: 'harvest',
        name: 'Harvest & Drying',
        subTitle: 'Pod Senescence & Threshing',
        stageNumber: 4,
        durationDays: 45,
        iconName: 'Wheat',
        summary: 'Pods turn dry brown; plants cut with sickles, tied into bundles, sun-dried, and threshed.',
        criticalTasks: [
          'Harvest when 80-85% of pods turn dry brown',
          'Dry bundles vertically on threshing floor for 5–7 days',
          'Beat with sticks or run mechanical pulse thresher',
        ],
        waterRequirementTip: 'Dry field conditions.',
        nutrientRecommendation: 'Deep roots improve subsoil aeration; incorporates organic biomass.',
        riskAlert: 'Untimely winter frost or rains can cause seed discoloration in drying pods.',
      },
    ],
  },
  grapes: {
    cropId: 'grapes',
    defaultSeason: 'Horticultural Pruning Cycle',
    totalDurationDays: 135,
    stages: [
      {
        key: 'sowing',
        name: 'Pruning & Bud Break',
        subTitle: 'Forward Pruning & Sprouting',
        stageNumber: 1,
        durationDays: 20,
        iconName: 'Sprout',
        summary: 'October forward pruning of canes, Hydrogen Cyanamide application, and uniform bud burst.',
        criticalTasks: [
          'Prune canes to 3-5 buds depending on cane diameter and variety',
          'Apply paste of Hydrogen Cyanamide (Dormex) to terminal buds',
          'Sub-soil fertilizer trenching with organic compost and rock phosphate',
        ],
        waterRequirementTip: 'Single heavy drip irrigation immediately post-pruning to initiate root sap flow.',
        nutrientRecommendation: 'Apply 30% of annual Nitrogen, 50% Phosphorus, 20% Potassium.',
        riskAlert: 'Uneven bud burst if daytime temperatures remain erratic after pruning.',
      },
      {
        key: 'vegetative',
        name: 'Canopy & Shoot Growth',
        subTitle: 'Shoot Thinning & Shoot Tying',
        stageNumber: 2,
        durationDays: 35,
        iconName: 'Leaf',
        summary: 'Rapid shoot elongation, leaf canopy architecture creation on Y-trellis/Bower, inflorescence emergence.',
        criticalTasks: [
          'Shoot thinning to retain 4-5 shoots per square foot of canopy',
          'Tying shoots to trellis wires to prevent wind breakage',
          'Preventive spray for downy mildew (Mancozeb/Copper oxychloride)',
        ],
        waterRequirementTip: 'Regulated deficit drip irrigation; maintain 25-30 liters/vine/day.',
        nutrientRecommendation: 'Fertigate soluble N and Magnesium Sulphate weekly through drip.',
        riskAlert: 'Downy mildew infection on tender leaves if rain or morning fog persists.',
      },
      {
        key: 'flowering',
        name: 'Berry Set & Veraison',
        subTitle: 'Cap Fall, Fruit Set & Berry Softening',
        stageNumber: 3,
        durationDays: 45,
        iconName: 'Flower2',
        summary: 'Flower cap shedding, berry set, gibberellic acid dipping for elongation, berry sizing, and veraison onset.',
        criticalTasks: [
          'Two GA3 dipping treatments for bunch elongation and berry sizing',
          'Manual bunch thinning and berry thinning to avoid compact bunches',
          'Spray for powdery mildew and thrips control',
        ],
        waterRequirementTip: 'Critical water balance: reduce irrigation slightly at veraison to build sugar brix.',
        nutrientRecommendation: 'Shift fertigation to high Potassium (0:0:50) and Calcium Nitrate.',
        riskAlert: 'Berry cracking if unseasonal rain occurs after veraison when skins are tender.',
      },
      {
        key: 'harvest',
        name: 'Harvest & Packing',
        subTitle: 'Sugar Brix Peak & Cluster Clipping',
        stageNumber: 4,
        durationDays: 35,
        iconName: 'Wheat',
        summary: 'Total Soluble Solids (TSS) reaches 18-20° Brix; sugar-acid ratio optimizes; harvest for domestic and export.',
        criticalTasks: [
          'Check bunch TSS using refractometer early morning',
          'Clip bunches with shears leaving 2 cm pedicel; avoid touching bloom on berries',
          'Pre-cool harvested grapes in cold room within 4 hours of clipping',
        ],
        waterRequirementTip: 'Reduce drip irrigation to 20% 7 days before clipping to enhance shelf life.',
        nutrientRecommendation: 'Post-harvest rest fertigation with Zinc and Boron.',
        riskAlert: 'Harvesting hot berries in afternoon sun severely degrades cold storage transit life.',
      },
    ],
  },
  pomegranate: {
    cropId: 'pomegranate',
    defaultSeason: 'Arid Bahar Cycle',
    totalDurationDays: 155,
    stages: [
      {
        key: 'sowing',
        name: 'Bahar Induction',
        subTitle: 'Defoliation & New Vegetative Flush',
        stageNumber: 1,
        durationDays: 25,
        iconName: 'Sprout',
        summary: 'Withholding water (stress period), chemical defoliation (Ethrel), followed by irrigation to trigger uniform flowering.',
        criticalTasks: [
          'Spray Ethrel (2.5 ml/L) for 70-80% uniform leaf drop',
          'Prune criss-cross dry branches and dead wood',
          'Basal pit application of vermicompost, Trichoderma, and neem cake',
        ],
        waterRequirementTip: 'Withhold water for 30-40 days prior; initiate light irrigation post-defoliation.',
        nutrientRecommendation: 'Apply 250g N, 250g P2O5, 250g K2O per mature plant at water release.',
        riskAlert: 'Bacterial blight (Telya) can enter pruning cuts; paste cuts with copper oxychloride.',
      },
      {
        key: 'vegetative',
        name: 'Flush & Canopy Growth',
        subTitle: 'Leaf Emergence & Flower Bud Differentiation',
        stageNumber: 2,
        durationDays: 45,
        iconName: 'Leaf',
        summary: 'Vigorous fresh bronze-green vegetative flush with hermaphrodite (bisexual) flower bud formation.',
        criticalTasks: [
          'Manage shot hole borer with chlorpyrifos stem drenching',
          'Foliar spray of Boron (0.2%) to improve flower quality',
          'Install fruit fly pheromone traps in orchard',
        ],
        waterRequirementTip: 'Steady drip irrigation: 20-30 liters per plant every alternate day.',
        nutrientRecommendation: 'Weekly drip fertigation with soluble 19:19:19 and micronutrients.',
        riskAlert: 'Thrips infestation causes silvery scar lesions on tender newly emerging calyxes.',
      },
      {
        key: 'flowering',
        name: 'Fruit Set & Sizing',
        subTitle: 'Hermaphrodite Bloom & Fruit Expansion',
        stageNumber: 3,
        durationDays: 50,
        iconName: 'Flower2',
        summary: 'Pollination of vase-shaped bisexual flowers, petal fall, fruit set, and exponential fruit enlargement.',
        criticalTasks: [
          'Manual thinning to keep single fruit per cluster for large 400g+ grades',
          'Bagging fruits with non-woven polypropylene bags to protect from pests and sun-scald',
          'Spray Calcium Nitrate and Boron to prevent fruit rind cracking',
        ],
        waterRequirementTip: 'Maintain strictly uniform soil moisture; sudden fluctuations cause catastrophic fruit cracking.',
        nutrientRecommendation: 'Switch fertigation to Potassium Sulphate (0:0:50) and Calcium Nitrate.',
        riskAlert: 'Fruit borer (Anar butterfly) caterpillar bores directly into fruit crown.',
      },
      {
        key: 'harvest',
        name: 'Harvest & Sorting',
        subTitle: 'Deep Ruby Aril Maturity & Plucking',
        stageNumber: 4,
        durationDays: 35,
        iconName: 'Wheat',
        summary: 'Rind turns characteristic pinkish-red; fruit produces metallic sound when tapped; arils turn deep ruby red.',
        criticalTasks: [
          'Harvest fruit with sharp clippers without damaging calyx crown',
          'Grade fruits according to weight (Super 400g+, King 350g, Queen 300g)',
          'Pack in corrugated fiberboard boxes with foam net cushioning',
        ],
        waterRequirementTip: 'Taper off drip irrigation 10 days before final plucking.',
        nutrientRecommendation: 'Post-harvest restorative foliar spray of Urea (1%) + Zinc Sulphate.',
        riskAlert: 'Rough handling during harvest punctures rind and leads to fungal rot in storage.',
      },
    ],
  },
};

// Generic / fallback lifecycle for any other crop
export const DEFAULT_CROP_LIFECYCLE: CropLifecycleBlueprint = {
  cropId: 'generic',
  defaultSeason: 'Standard Agronomic Cycle',
  totalDurationDays: 115,
  stages: [
    {
      key: 'sowing',
      name: 'Sowing & Germination',
      subTitle: 'Seed Placement & Stand Emergence',
      stageNumber: 1,
      durationDays: 20,
      iconName: 'Sprout',
      summary: 'Optimal seedbed preparation, treated seed placement, moisture imbibition, and uniform seedling stand.',
      criticalTasks: [
        'Seed treatment with broad-spectrum bio-fungicide',
        'Basal fertilizer incorporation below seed furrow',
        'Maintain soil moisture for prompt germination',
      ],
      waterRequirementTip: 'Light and frequent watering; avoid water stagnation.',
      nutrientRecommendation: 'Basal application: 25% Nitrogen, 100% Phosphorus, 50% Potassium.',
      riskAlert: 'Soil crusting and damping-off fungal infection during first 14 days.',
    },
    {
      key: 'vegetative',
      name: 'Vegetative Growth',
      subTitle: 'Foliage Development & Tillering/Branching',
      stageNumber: 2,
      durationDays: 35,
      iconName: 'Leaf',
      summary: 'Active leaf area expansion, root system penetration, canopy development, and nutrient accumulation.',
      criticalTasks: [
        'Early weed elimination before critical period of crop-weed competition',
        'Split top-dressing of Nitrogen fertilizer',
        'Scouting for early-stage insect defoliators and sucking pests',
      ],
      waterRequirementTip: 'Adequate soil moisture to support rapid cell division and canopy growth.',
      nutrientRecommendation: 'Top-dress 50% of remaining Nitrogen with irrigation.',
      riskAlert: 'Weed competition during early canopy expansion causes irreversible yield reduction.',
    },
    {
      key: 'flowering',
      name: 'Flowering & Reproductive',
      subTitle: 'Inflorescence, Anthesis & Fruit/Grain Setting',
      stageNumber: 3,
      durationDays: 30,
      iconName: 'Flower2',
      summary: 'Floral bud initiation, pollination, fertilization, and primary grain/fruit filling development.',
      criticalTasks: [
        'Foliar spray of micronutrients (Boron, Zinc) to enhance flower retention',
        'Targeted pest and disease protection during bloom',
        'Ensure steady root moisture availability',
      ],
      waterRequirementTip: 'Most sensitive stage for water stress; drought at flowering causes flower drop and barrenness.',
      nutrientRecommendation: 'Apply remaining Potassium and balanced micronutrient foliar spray.',
      riskAlert: 'High temperature spikes combined with water deficit desiccate pollen.',
    },
    {
      key: 'harvest',
      name: 'Harvest & Maturity',
      subTitle: 'Physiological Ripening & Field Reaping',
      stageNumber: 4,
      durationDays: 30,
      iconName: 'Wheat',
      summary: 'Starch and sugar accumulation, color change, moisture decline, and clean manual or mechanical harvest.',
      criticalTasks: [
        'Monitor moisture content to harvest at optimal physiological maturity',
        'Stop irrigations 10–14 days prior to harvesting',
        'Post-harvest cleaning, grading, and protective dry storage',
      ],
      waterRequirementTip: 'Withhold irrigation to encourage uniform dry-down and firm ground conditions.',
      nutrientRecommendation: 'Harvest complete; incorporate residues for soil health.',
      riskAlert: 'Unseasonal rainfall during field drying causes grain sprouting and mold.',
    },
  ],
};

function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

function formatISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function addDays(baseDate: Date, days: number): Date {
  const next = new Date(baseDate.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * Calculates complete growth stages based on reference sowing date and current date.
 * Default currentDate is 2026-09-13 (or real-time date).
 */
export function calculateCropLifecycleTimeline(
  cropId: string,
  cropName: string,
  sowingDateStr: string = '2026-09-13',
  currentDateStr: string = '2026-09-13'
): CropLifecycleTimelineData {
  const blueprint = CROP_LIFECYCLE_PROFILES[cropId.toLowerCase()] || DEFAULT_CROP_LIFECYCLE;

  const sowingDate = parseISODate(sowingDateStr);
  const currentDate = parseISODate(currentDateStr);

  let currentCursor = new Date(sowingDate.getTime());
  let runningDay = 0;

  // Calculate days elapsed from sowing to current date
  const msDiff = currentDate.getTime() - sowingDate.getTime();
  const daysElapsed = Math.round(msDiff / (1000 * 60 * 60 * 24));
  const totalDurationDays = blueprint.totalDurationDays;
  const harvestDate = addDays(sowingDate, totalDurationDays);
  const daysRemaining = Math.max(0, totalDurationDays - daysElapsed);

  let currentStageKey: GrowthStageKey | 'pre-sowing' | 'post-harvest' = 'sowing';
  let currentStageName = 'Sowing & Germination';
  let managementAlert = '';

  const stages: GrowthStageInfo[] = blueprint.stages.map((stage) => {
    const stageStartDate = new Date(currentCursor.getTime());
    const stageEndDate = addDays(stageStartDate, stage.durationDays);
    const startDay = runningDay;
    const endDay = runningDay + stage.durationDays;

    let status: 'completed' | 'active' | 'upcoming' = 'upcoming';
    let progressPercent = 0;

    if (daysElapsed < startDay) {
      status = 'upcoming';
      progressPercent = 0;
    } else if (daysElapsed >= endDay) {
      status = 'completed';
      progressPercent = 100;
    } else {
      status = 'active';
      currentStageKey = stage.key;
      currentStageName = stage.name;
      const daysInStage = daysElapsed - startDay;
      progressPercent = Math.min(100, Math.max(5, Math.round((daysInStage / stage.durationDays) * 100)));
      managementAlert = `${stage.name} Phase (Day ${daysElapsed} of ${totalDurationDays}): ${stage.criticalTasks[0] || stage.summary}`;
    }

    // Advance cursor for next stage
    currentCursor = new Date(stageEndDate.getTime());
    runningDay = endDay;

    return {
      key: stage.key,
      name: stage.name,
      subTitle: stage.subTitle,
      stageNumber: stage.stageNumber,
      startDay,
      endDay,
      durationDays: stage.durationDays,
      startDate: formatDisplayDate(stageStartDate),
      endDate: formatDisplayDate(stageEndDate),
      isoStartDate: formatISODate(stageStartDate),
      isoEndDate: formatISODate(stageEndDate),
      status,
      progressPercent,
      iconName: stage.iconName,
      summary: stage.summary,
      criticalTasks: stage.criticalTasks,
      waterRequirementTip: stage.waterRequirementTip,
      nutrientRecommendation: stage.nutrientRecommendation,
      riskAlert: stage.riskAlert,
    };
  });

  if (daysElapsed < 0) {
    currentStageKey = 'pre-sowing';
    currentStageName = 'Pre-Sowing Preparation';
    managementAlert = `Sowing begins in ${Math.abs(daysElapsed)} days on ${formatDisplayDate(sowingDate)}. Prepare seedbeds and apply basal nutrients.`;
  } else if (daysElapsed > totalDurationDays) {
    currentStageKey = 'post-harvest';
    currentStageName = 'Harvest Completed';
    managementAlert = `Crop lifecycle complete (${daysElapsed} days since sowing). Review field yield performance and prepare for next rotation.`;
  } else if (!managementAlert) {
    const activeStage = stages.find((s) => s.status === 'active') || stages[0];
    managementAlert = `${activeStage.name}: ${activeStage.criticalTasks[0]}`;
  }

  const overallProgressPercent = Math.max(
    0,
    Math.min(100, Math.round((daysElapsed / totalDurationDays) * 100))
  );

  return {
    cropId,
    cropName,
    totalDurationDays,
    sowingDate: formatISODate(sowingDate),
    harvestDate: formatISODate(harvestDate),
    currentDate: formatISODate(currentDate),
    currentStageKey,
    currentStageName,
    daysElapsed: Math.max(0, daysElapsed),
    daysRemaining,
    overallProgressPercent,
    stages,
    seasonAlignment: blueprint.defaultSeason,
    managementAlert,
  };
}

export const SOWING_DATE_PRESETS = [
  { id: 'today', label: 'Plant Today (Sep 13, 2026)', date: '2026-09-13', desc: 'Real-time forward lifecycle projection' },
  { id: 'rabi-early', label: 'Rabi Window (Oct 01, 2026)', date: '2026-10-01', desc: 'Standard post-monsoon winter sowing' },
  { id: 'kharif-active', label: 'Mid-Kharif Sown (Jul 01, 2026)', date: '2026-07-01', desc: 'Track crop currently in flowering/fruiting' },
];
