[README.md](https://github.com/user-attachments/files/32233765/README.md)
# 🌾 AdaptiveCrop AI (KshetraAI)
### Explainable, Constraint-Aware Precision Crop Recommendation System for Agriculture 4.0

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://ai-crop-recommendation-kappa.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-CodexSoham%2FAI--CROP--RECOMMENDATION--final-181717?style=for-the-badge&logo=github)](https://github.com/CodexSoham/AI-CROP-RECOMMENDATION-final)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![XGBoost](https://img.shields.io/badge/Model-XGBoost%20%7C%2099.77%25%20Top--3-FF6F00?style=for-the-badge)](https://xgboost.ai/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.style=for-the-badge)](LICENSE)

---

## 📌 Overview

**AdaptiveCrop AI (KshetraAI)** is an end-to-end, data-driven agricultural decision-support platform built for Agriculture 4.0. Traditional crop recommendation systems act as "black boxes" that assume ideal farming conditions and predict a single static crop label without explaining the underlying biological rationale or taking real-world resource scarcity into account.

AdaptiveCrop AI solves these fundamental limitations by integrating:
- **Multiclass Probabilistic Predictions**: Evaluates 7 core soil & climatic parameters to output Top-3 recommended crops (Primary 🥇, Secondary 🥈, Tertiary 🥉) with calibrated suitability scores.
- **Automated GIS Telemetry Streaming**: Ingests real-time weather and 16-day rainfall forecasts via the **Open-Meteo API** and digital soil properties via the **ISRIC SoilGrids 2.0 REST API**.
- **Explainable AI (XAI)**: Utilizes **SHAP (SHapley Additive exPlanations)** and local agronomic dictionaries to explain *why* specific soil ($N, P, K, pH$) and climate factors fit each crop's biological requirements.
- **Resource & Geographic Guardrails**: Automatically triggers a `"HIGH RISK"` alert when water-intensive crops (e.g., Rice, Jute) are recommended under low rainfall (<120mm), providing actionable drip-irrigation advice and preventing perennial orchard rotation errors or regional impossibilities (e.g., Coffee in flat northern plains).

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Client Interfaces                               │
│   Next.js / React Web Client     •     AI Agent via Model Context Protocol  │
└──────────────────────┬──────────────────────────────────────┬───────────────┘
                       │                                      │
                       ▼                                      ▼
┌──────────────────────────────────────────────┐  ┌───────────────────────────┐
│     Node / Edge API Gateway (Port 3000)      │  │   Python MCP Server       │
│  - Weather proxy (/api/weather)              │  │   agroxai_mcp.py          │
│  - SoilGrids proxy (/api/soilgrids)          │  │   - get_weather           │
│  - Gemini Advisory proxy                     │  │   - get_soil_data         │
└──────────────────────┬───────────────────────┘  │   - run_crop_model        │
                       │                          │   - apply_constraints     │
                       ▼                          └───────────┬───────────────┘
┌──────────────────────────────────────────────┐              │
│       Python FastAPI ML Service (Port 8000)  │◄─────────────┘
│  - POST /api/v1/predict                      │
│  - Trained XGBoost Multiclass Classifier     │
│  - SHAP Tree Explainer & Scientific Dictionary│
│  - Resource & Geographic Guardrail Engine    │
└───────┬──────────────────────┬───────────────┘
        │                      │
        ▼                      ▼
┌──────────────────┐   ┌────────────────────────────────┐
│  External APIs   │   │  Persistence & Automation      │
│  - Open-Meteo    │   │  - Supabase PostgreSQL (DB)    │
│  - NASA POWER    │   │  - n8n Automation Workflows    │
│  - ISRIC Soil    │   └────────────────────────────────┘
│  - Google Gemini │
└──────────────────┘
```

---

## ✨ Key Features

1. **Top-3 Probabilistic Crop Ranking**: Uses `model.predict_proba()` to compute probability distributions across 22 Kaggle crop species (*rice, maize, chickpea, kidneybeans, pigeonpeas, mothbeans, mungbean, blackgram, lentil, pomegranate, banana, mango, grapes, watermelon, muskmelon, apple, orange, papaya, coconut, cotton, jute, coffee*).
2. **Interactive Map & Telemetry Auto-Fill**: Click any point on the Leaflet terrain map to extract latitude/longitude. Automatically queries SoilGrids 2.0 (with pH deci-unit conversion) and Open-Meteo weather forecasts to pre-fill input sliders.
3. **Resource Limitation Guardrail (Innovation Module)**: Evaluates field water availability against crop biology. Flags water deficits with actionable drip-irrigation advisories and recommends drought-resilient pulse alternatives.
4. **Geographic & Agronomic Rotation Engine**: Prevents perennial tree crops (*mango, apple, coconut, coffee*) from being mistakenly suggested as seasonal rotation crops, and flags regional climate impossibilities.
5. **Generative Natural-Language Advisory**: Passes XGBoost confidence scores and SHAP attribution weights to Google Gemini API to produce farmer-friendly 3-sentence action plans.

---

## 📊 Machine Learning Model Benchmarks

The core model was trained on the Kaggle Crop Recommendation Dataset (2,200 rows, 22 balanced classes) and evaluated against the 51-crop dataset:

| Model Architecture | Top-1 Accuracy | Top-3 Accuracy | Precision | Recall | F1-Score |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **XGBoost Classifier (Selected)** | **98.18%** | **99.77%** | **98.4%** | **98.2%** | **98.3%** |
| Random Forest Classifier | 98.67% | 99.50% | 98.5% | 98.5% | 98.5% |
| Stacking Ensemble (ExtraTrees + RF + XGB) | 99.36% | 99.85% | 99.3% | 99.3% | 99.3% |
| Decision Tree | 94.55% | 97.20% | 94.3% | 94.2% | 94.1% |
| Support Vector Machine (RBF) | 98.20% | 99.10% | 98.4% | 98.2% | 98.2% |

---

## 📁 Repository Directory Layout

```
AI-CROP-RECOMMENDATION-final/
├── backend/
│   ├── main.py                     # FastAPI server with /api/v1/predict endpoint
│   ├── test_backend.py             # Automated pytest verification suite
│   ├── requirements.txt            # Python dependencies
│   └── artifacts/
│       ├── xgb_crop_model.pkl      # Trained XGBoost model binary
│       ├── label_encoder.pkl       # LabelEncoder mapping binary
│       └── model_metadata.json     # Model features & class names
├── frontend/
│   ├── components/
│   │   ├── CropRecommendationDashboard.tsx  # Next.js Top-3 UI & Risk Banner
│   │   ├── InteractiveMap.tsx               # Leaflet map click & coordinate capture
│   │   └── SidebarInputs.tsx                # Auto-filling soil/weather sliders
│   ├── lib/
│   │   └── services/
│   │       └── geoIngestion.ts              # SoilGrids & Open-Meteo API wrapper
│   └── pages/
│       └── index.tsx                        # Dashboard page
├── mcp/
│   └── agroxai_mcp.py              # Model Context Protocol server for AI agents
├── ml/
│   ├── train_xgboost.py            # XGBoost training & evaluation pipeline
│   └── Crop_recommendation.csv     # Dataset copy
├── .env.example                    # Environment variable template
└── README.md                       # Documentation
```

---

## 📡 API Specification

### `POST /api/v1/predict`

#### Request Payload (JSON):
```json
{
  "N": 82.0,
  "P": 48.0,
  "K": 41.0,
  "ph": 6.5,
  "temperature": 26.5,
  "humidity": 80.0,
  "rainfall": 85.0,
  "location": "Ludhiana"
}
```

#### Response Payload (JSON):
```json
{
  "status": "Success",
  "recommendations": [
    {
      "rank": 1,
      "crop": "Blackgram",
      "confidence_score": "69.1%",
      "explanation": "Tropical pulse requiring warm temperatures (27-32°C), moderate rainfall, and well-drained fertile soils with balanced Phosphorus and Potassium."
    },
    {
      "rank": 2,
      "crop": "Mothbeans",
      "confidence_score": "18.4%",
      "explanation": "Extremely drought-tolerant pulse thriving in arid, low-rainfall (<60mm) sandy soils under high ambient temperatures."
    },
    {
      "rank": 3,
      "crop": "Maize",
      "confidence_score": "7.5%",
      "explanation": "Versatile cereal flourishing in warm temperatures (21-27°C), moderate rainfall (50-100mm), and well-drained loamy soils rich in Nitrogen."
    }
  ],
  "innovation_bonus_modules": {
    "resource_constraint_guardrail": {
      "risk_status": "HIGH RISK",
      "actionable_advisory": "CRITICAL WATER DEFICIT ALERT: Rice requires >150mm rainfall, but current field rainfall is 85.0mm. Cultivation without high-efficiency micro-irrigation (drip/sprinkler) will cause severe yield loss. Recommend deploying drip irrigation or switching to drought-resilient alternatives like Mothbeans."
    },
    "adaptive_system_design": {
      "rotation_strategy": "Recommended seasonal crop rotation: Follow Blackgram with a leguminous pulse crop (e.g., Chickpea or Lentil) in the subsequent season to replenish soil Nitrogen levels and break pest cycles."
    }
  }
}
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python**: `^3.10` or `3.12`
- **Node.js**: `^18.0.0` or `20.0.0`
- **npm** or **yarn**

### 2. Backend Setup & Model Training

```bash
# Clone the repository
git clone https://github.com/CodexSoham/AI-CROP-RECOMMENDATION-final.git
cd AI-CROP-RECOMMENDATION-final/backend

# Create virtual environment & install dependencies
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# (Optional) Re-train XGBoost model
python ../ml/train_xgboost.py

# Start FastAPI microservice
uvicorn main:app --reload --port 8000
```
FastAPI interactive Swagger documentation will be live at `http://localhost:8000/docs`.

### 3. Frontend Setup

```bash
cd ../frontend

# Install Node dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run Next.js development server
npm run dev
```
Open `http://localhost:3000` in your browser to interact with the dashboard.

---

## 🧪 Testing & Verification

Run the automated Python test suite to verify schema validation, low-rainfall guardrails, and geographic restriction checks:

```bash
cd backend
python test_backend.py
```

---

## 📚 Academic & Literature References

1. **Dey, B., Ferdous, J., & Ahmed, R. (2024)**. *Machine learning based recommendation of agricultural and horticultural crop farming in India under the regime of NPK, soil pH and three climatic variables*. **Heliyon**, 10(2), e25112.
2. **Turgut, O., Kok, I., & Ozdemir, S. (2024)**. *AgroXAI: Explainable AI-Driven Crop Recommendation System for Agriculture 4.0*. **IEEE BigData / arXiv:2412.16196**.
3. **Gunasekaran, H., Kanmani, D., & Krishnamoorthi, R. (2024)**. *Optimized Ensemble Learning for Enhanced Crop Recommendations: Leveraging ML for Smarter Agricultural Decision-Making*. **Engineering Proceedings**, 82(1), 95.

---

## 📄 License

Distributed under the **Apache 2.0 License**. See `LICENSE` for more information.
