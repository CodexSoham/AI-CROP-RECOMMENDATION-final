# 🔬 Findings & Knowledge Base: AdaptiveCrop AI

## 1. Domain Research & Literature Invariants

### 1.1 Key Scientific Papers
1. **Machine Learning Based Crop Farming in India (ScienceDirect / Agricultural Systems):**
   - Inputs: $N, P, K, pH$, Temperature, Humidity, Rainfall.
   - Finding: XGBoost, Random Forest, and Stacking Ensembles outperform single decision trees and linear models.
2. **AgroXAI: Explainable AI-Driven Crop Recommendation System (arXiv):**
   - Incorporates SHAP (SHapley Additive exPlanations) to explain feature contributions ($+ / -$ impact on suitability).
   - Solves the black-box problem for agronomists and farmers.
3. **Optimized Ensemble Learning for Enhanced Crop Recommendations (MDPI):**
   - Demonstrates that stacking XGBoost, ExtraTrees, and Random Forest provides superior generalization.
   - Note on caveat: Avoid claiming artificial 99%+ accuracy caused by dataset overlap or synthetic augmentation without cross-validation.

### 1.2 Datasets & Feature Bounds
- **Standard Dataset:** Kaggle Crop Recommendation Dataset (2,200 records across 22 crops, 7 features: N, P, K, temperature, humidity, pH, rainfall).
- **51-Crop Dataset:** ~20,000 records for expanded geographical breadth.
- **Feature Ranges:**
  - $N$: 0 - 140 mg/kg
  - $P$: 5 - 145 mg/kg
  - $K$: 5 - 205 mg/kg
  - $pH$: 3.5 - 9.9
  - Temperature: 8°C - 45°C
  - Humidity: 14% - 100%
  - Rainfall: 20mm - 300mm+

### 1.3 External Services & Free APIs
- **Open-Meteo:** Free, no API key required for non-commercial tier (<10,000 calls/day). Provides current weather + 16-day forecast + precipitation sum.
- **NASA POWER:** Historical agro-climatology baseline data.
- **Google Gemini API:** Free tier available; used strictly for grounded agronomic explanations and advisory synthesis.
- **SoilGrids REST API (ISRIC):** Geospatial soil estimates from coordinate pixels.

### 1.4 Innovation Focus: "What-If Simulator" & Constraint Layer
- Standard systems only predict crop from static values.
- Real-world agriculture faces unpredictable monsoon variations and water quotas.
- Adding a **Constraint Engine** (Water, Budget, Growing season) and an interactive **What-If Simulator** (e.g. "What if rainfall drops by 30%?") elevates the project from a simple Kaggle wrapper to a decision-support platform.
