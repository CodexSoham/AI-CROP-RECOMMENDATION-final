-- =============================================================================
-- AdaptiveCrop AI (AgroXAI) - Supabase PostgreSQL Schema
-- Precision Agriculture & Constraint-Aware Explainable Recommendations
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Geospatial coordinates & field polygon boundaries

-- -----------------------------------------------------------------------------
-- 1. FIELDS (Agricultural Plots & Land Registry)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    location_name VARCHAR(200) NOT NULL,
    area_acres NUMERIC(8, 2) NOT NULL DEFAULT 1.0,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    boundary_polygon GEOMETRY(Polygon, 4326),
    soil_type VARCHAR(100) DEFAULT 'Vertisol',
    irrigation_source VARCHAR(100) DEFAULT 'Canal & Borewell',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fields_user_id ON public.fields(user_id);
CREATE INDEX IF NOT EXISTS idx_fields_coords ON public.fields(latitude, longitude);

-- -----------------------------------------------------------------------------
-- 2. SOIL MEASUREMENTS (Periodic Lab Reports & IoT Sensors)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.soil_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE,
    nitrogen_n NUMERIC(6, 2) NOT NULL, -- mg/kg
    phosphorus_p NUMERIC(6, 2) NOT NULL,
    potassium_k NUMERIC(6, 2) NOT NULL,
    ph NUMERIC(4, 2) NOT NULL, -- 0-14
    electrical_conductivity NUMERIC(6, 2), -- dS/m
    organic_carbon_percent NUMERIC(5, 2),
    moisture_percent NUMERIC(5, 2),
    source_type VARCHAR(50) DEFAULT 'lab_report', -- 'lab_report', 'sensor', 'soilgrids_api'
    ocr_source_url TEXT,
    measured_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_soil_field_id ON public.soil_measurements(field_id);
CREATE INDEX IF NOT EXISTS idx_soil_measured_at ON public.soil_measurements(measured_at DESC);

-- -----------------------------------------------------------------------------
-- 3. WEATHER LOGS (Real-Time Telemetry from Open-Meteo & NASA POWER)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weather_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    temperature_c NUMERIC(5, 2) NOT NULL,
    relative_humidity_percent NUMERIC(5, 2) NOT NULL,
    current_rainfall_mm NUMERIC(6, 2) DEFAULT 0.0,
    forecast_16d_rainfall_mm NUMERIC(6, 2) NOT NULL,
    wind_speed_kmh NUMERIC(5, 2),
    weather_code INT,
    source VARCHAR(50) DEFAULT 'open-meteo',
    captured_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weather_field_id ON public.weather_logs(field_id);
CREATE INDEX IF NOT EXISTS idx_weather_captured_at ON public.weather_logs(captured_at DESC);

-- -----------------------------------------------------------------------------
-- 4. RECOMMENDATIONS (ML Predictions, SHAP XAI Vectors & Gemini Advisories)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE,
    soil_measurement_id UUID REFERENCES public.soil_measurements(id) ON DELETE SET NULL,
    water_availability VARCHAR(20) NOT NULL, -- 'Low', 'Moderate', 'High'
    budget_limit VARCHAR(20) NOT NULL,       -- 'Low', 'Medium', 'High'
    
    -- Top recommendations stored as structured JSONB array
    top_crops JSONB NOT NULL,
    primary_crop_id VARCHAR(50) NOT NULL,
    primary_crop_name VARCHAR(100) NOT NULL,
    primary_crop_score NUMERIC(5, 2) NOT NULL,
    
    -- Explainable AI (SHAP attributions)
    shap_factors JSONB NOT NULL,
    
    -- Gemini generative advisory synthesis
    advisory_summary TEXT,
    fertilizer_plan TEXT,
    irrigation_strategy TEXT,
    risk_mitigation TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_field_id ON public.recommendations(field_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_primary_crop ON public.recommendations(primary_crop_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_created_at ON public.recommendations(created_at DESC);

-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own fields
CREATE POLICY "Users can manage their own fields" 
ON public.fields 
FOR ALL 
USING (auth.uid() = user_id);

-- Allow access to soil measurements through owned fields
CREATE POLICY "Users can read/write soil measurements for their fields" 
ON public.soil_measurements 
FOR ALL 
USING (
    field_id IN (SELECT id FROM public.fields WHERE user_id = auth.uid())
);

-- Allow access to recommendations through owned fields
CREATE POLICY "Users can view recommendations for their fields" 
ON public.recommendations 
FOR ALL 
USING (
    field_id IN (SELECT id FROM public.fields WHERE user_id = auth.uid())
);
