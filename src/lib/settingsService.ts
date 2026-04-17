// ============================================
// MARTIAL INSTINCT - SETTINGS SERVICE
// app_settings: key TEXT, value TEXT (JSON-serialisiert)
// ============================================

import { supabase } from './supabase';

export async function loadAllSettings(): Promise<Record<string, unknown>> {
  try {
    const { data, error } = await supabase.from('app_settings').select('key, value');
    if (error || !data) return {};
    const result: Record<string, unknown> = {};
    for (const row of data) {
      try {
        result[row.key as string] = typeof row.value === 'string'
          ? JSON.parse(row.value as string)
          : row.value;
      } catch { result[row.key as string] = row.value; }
    }
    return result;
  } catch {
    return {};
  }
}

export async function saveSetting(key: string, value: unknown): Promise<void> {
  try {
    const serialized = JSON.stringify(value);
    await supabase
      .from('app_settings')
      .upsert({ key, value: serialized, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  } catch { /* silent */ }
}
