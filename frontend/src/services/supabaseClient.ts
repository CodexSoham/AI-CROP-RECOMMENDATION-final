/**
 * Supabase Client — frontend singleton
 * Uses the publishable (anon) key for client-side access.
 * RLS policies on the Supabase project govern data access.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set.");
}

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

export interface RecommendationRecord {
  id?: string;
  field_id?: string;
  n: number;
  p: number;
  k: number;
  ph: number;
  temperature: number;
  humidity: number;
  rainfall_est: number;
  water_availability: string;
  budget_limit: string;
  season: string;
  top_crop: string;
  top_score: number;
  second_crop?: string;
  third_crop?: string;
  advisory_summary?: string;
  source: string;
  created_at?: string;
}

export async function logRecommendation(record: RecommendationRecord): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("recommendations").insert([record]);
  if (error) console.warn("[Supabase] logRecommendation error:", error.message);
}

export async function fetchRecommendationHistory(limit = 10): Promise<RecommendationRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) { console.warn("[Supabase] fetchHistory error:", error.message); return []; }
  return (data as RecommendationRecord[]) || [];
}

export async function testSupabaseConnection(): Promise<{ connected: boolean; latencyMs?: number; error?: string }> {
  if (!supabase) return { connected: false, error: "Supabase not configured" };
  const start = performance.now();
  try {
    const { error } = await supabase.from("recommendations").select("id").limit(1);
    const latencyMs = Math.round(performance.now() - start);
    if (error && error.code !== "PGRST116") {
      return { connected: false, latencyMs, error: error.message };
    }
    return { connected: true, latencyMs };
  } catch (e: any) {
    return { connected: false, error: e?.message || "Network error" };
  }
}
