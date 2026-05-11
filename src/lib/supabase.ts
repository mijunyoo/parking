import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client. Reads URL + anon key from Vite env vars.
 * Set them in `.env.local`:
 *   VITE_SUPABASE_URL=https://xxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=...
 *
 * If the env vars are missing, the client is null and the app
 * falls back to local-only mode.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && anon ? createClient(url, anon, {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 2 } },
}) : null;

export const isSyncEnabled = !!supabase;

/** Database row shape — matches the `parking_records` table */
export interface DbRow {
  group_id: string;
  car_brand: 'mercedes' | 'jaguar' | 'audi';
  floor: 'B3' | 'B4' | 'B5' | 'B6';
  pin_x: number;
  pin_y: number;
  zone: string;
  recorded_at: string; // ISO timestamp
}
