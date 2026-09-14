# AdaptiveCrop AI (AgroXAI) System Architecture

## 1. System Overview

**AdaptiveCrop AI (AgroXAI)** is an explainable, constraint-aware precision agriculture recommendation platform built for Agriculture 4.0. Unlike traditional black-box agronomic tools, AdaptiveCrop AI integrates real-time meteorological streaming, digital soil baseline mapping, supervised ensemble machine learning, mathematical SHAP feature attribution, and generative AI advisories within a unified reactive interface.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Client Interfaces                               │
│   Next.js / React Web Client     •     AI Agent via Model Context Protocol  │
└──────────────────────┬──────────────────────────────────────┬───────────────┘
                       │                                      │
                       ▼                                      ▼
┌──────────────────────────────────────────────┐  ┌───────────────────────────┐
│     Node / Vite Edge API (Port 3000)         │  │   Python MCP Server       │
│  - Weather proxy (/api/weather)              │  │   agroxai_mcp.py          │
│  - SoilGrids proxy (/api/soilgrids)          │  │   - get_weather           │
│  - Gemini Advisory proxy                     │  │   - get_soil_data         │
│  - Soil Test OCR Parser                      │  │   - run_crop_model        │
└──────────────────────┬───────────────────────┘  │   - apply_constraints     │
                       │                          │   - get_field_history     │
                       ▼                          └───────────┬───────────────┘
┌──────────────────────────────────────────────┐              │
│       Python FastAPI ML Service (Port 8000)  │◄─────────────┘
│  - POST /api/v1/recommend                    │
│  - Gaussian Centroid + XGBoost Ensemble      │
│  - SHAP Tree / Kernel Explainer              │
│  - Dynamic Agronomic Constraint Engine       │
└───────┬──────────────────────┬───────────────┘
        │                      │
        ▼                      ▼
┌──────────────────┐   ┌────────────────────────────────┐
│  External APIs   │   │  Persistence & Automation      │
│  - Open-Meteo    │   │  - Supabase PostgreSQL (DB)    │
│  - NASA POWER    │   │  - n8n Automation Workflows    │
│  - ISRIC Soil    │   │  - Vector Embeddings for XAI   │
│  - Google Gemini │   └────────────────────────────────┘
└──────────────────┘
```

---

## 2. External API Subsystems

| Subsystem | Provider | Endpoint / Protocol | Primary Purpose |
|-----------|----------|---------------------|-----------------|
| **Climate Streaming** | Open-Meteo | `GET /v1/forecast` | Real-time temperature ($2m$), relative humidity, precipitation, and 16-day rainfall sum |
| **Historical Baselines** | NASA POWER | `GET /api/temporal/daily/point` | Long-term solar radiation, degree-days, and seasonal drought baselines |
| **Soil Chemistry** | ISRIC SoilGrids 2.0 | `GET /v2.0/properties/query` | 0–30cm depth soil pH ($H_2O$), organic carbon (SOC), sand/silt/clay fractions |
| **Generative Advisory** | Google Gemini | `POST /v1beta/models/...:generateContent` | Synthesizes actionable farmer guidance from numerical ML & SHAP scores |
| **Soil Report OCR** | Gemini 3.8 Flash Vision | Multimodal image/PDF payload | Digitizes paper lab test certificates into standardized N-P-K-pH vectors |
| **Persistence** | Supabase | PostgREST / PostgreSQL | Stores field plots, sensor measurements, and recommendation audit logs |

---

## 3. Machine Learning & Constraint Pipeline

```
Raw Agronomic Input (N, P, K, pH, Lat, Lon, Water Level, Budget)
                         │
                         ├─► 1. Ingest Open-Meteo & SoilGrids telemetry
                         │
                         ▼
           Multi-Model Ensemble Classifier
           (Gaussian Centroid Probability Vectors)
                         │
                         ├─► 2. Raw Suitability Probabilities (% across 22 cultivars)
                         │
                         ▼
             SHAP Feature Importance Engine
         (Kernel attribution for Nitrogen, pH, Rain)
                         │
                         ▼
            Agronomic Constraint Engine
       - Drought guardrail penalties (Water necessity vs. availability)
       - Capital ceiling penalties (High-input cost crops vs. Low budget)
       - Planting window & seasonal calendar alignment
                         │
                         ▼
        Top-3 Adjusted Recommendations + Rank Badges
                         │
                         ▼
         Gemini Generative Advisory Synthesis
```

---

## 4. Model Context Protocol (MCP) Setup

Model Context Protocol allows external AI agents (like Claude Desktop, Cursor, Antigravity IDE, or custom CLI agents) to interact directly with the AgroXAI platform through standard tools:

- `get_weather(lat, lon)`: Fetches current and 16-day rainfall projections.
- `get_soil_data(lat, lon)`: Queries ISRIC SoilGrids REST API for coordinates.
- `run_crop_model(n, p, k, ph, lat, lon)`: Executes the ensemble ML prediction pipeline.
- `apply_constraints(crop_scores, water_level, budget_level)`: Evaluates dynamic real-world risk guardrails.
- `get_field_history(field_id)`: Retrieves past soil records and recommendation history from Supabase.
