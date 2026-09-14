# 📋 Task Plan: AdaptiveCrop AI

**Protocol:** B.L.A.S.T. (Blueprint, Link, Architect, Stylize, Trigger)  
**Current Phase:** Phase 1: Blueprint (Discovery & Logic Formalization)  
**Execution Status:** Halted pending user Discovery confirmation and Blueprint approval.

---

## Phase 1: B - Blueprint (Vision & Logic)
- [x] Protocol 0: Project Memory Initialized (`task_plan.md`, `findings.md`, `progress.md`, `gemini.md`)
- [ ] Discovery Questions submitted to User
- [ ] Discovery Responses validated & recorded into `findings.md`
- [ ] Core Data Schemas frozen in `gemini.md`
- [ ] User approval on Blueprint & System Architecture

## Phase 2: L - Link (Connectivity & Handshake)
- [ ] Verify `.env` credentials (Gemini API Key, Open-Meteo endpoint, Supabase connection)
- [ ] Test Open-Meteo Weather API connectivity & fallback logic in `tools/test_weather_link.py` (or ts)
- [ ] Test Gemini AI Explanation API handshake in `tools/test_gemini_link.py` (or ts)
- [ ] Test Supabase / Data Layer connectivity

## Phase 3: A - Architect (The 3-Layer Build)
- [ ] **Layer 1: Architecture (`architecture/`)**
  - [ ] `sop_ml_engine.md`: Model training, XGBoost/RandomForest, top-3 probability calibration
  - [ ] `sop_constraint_engine.md`: Real-world constraints (water, budget, rainfall risk, seasonal mapping)
  - [ ] `sop_explainability_shap.md`: SHAP-based feature importance attribution & visualization
  - [ ] `sop_advisory_gemini.md`: Grounded prompt engineering for farmer-facing recommendations
- [ ] **Layer 2: Navigation (Decision Flow)**
  - [ ] Orchestration pipeline: Field Input -> Weather Fetch -> ML Inference -> Constraint Adjustment -> SHAP -> Gemini Advisory -> Client Response
- [ ] **Layer 3: Tools (`tools/`)**
  - [ ] Implement deterministic ML recommendation module
  - [ ] Implement constraint weighting engine
  - [ ] Implement SHAP explanation processor

## Phase 4: S - Stylize (Refinement & UI)
- [ ] Refine web dashboard UI (KshetraAI / AdaptiveCrop AI) with rich agronomic metrics, radar charts, and comparison views
- [ ] Integrate interactive "What-If Simulator" (e.g. adjust rainfall/NPK sliders and view real-time re-ranking)
- [ ] Render SHAP contributing factors visually (progress bars / impact tags)
- [ ] Format Gemini natural-language advisory cards

## Phase 5: T - Trigger (Deployment & Automation)
- [ ] Package production build & verify clean server execution
- [ ] Verify automated workflows / API triggers
- [ ] Document final Maintenance Log in `gemini.md`
