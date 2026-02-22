import AsyncStorage from '@react-native-async-storage/async-storage';

export type CheckInRecord = {
  date: string;                    // 'YYYY-MM-DD'
  hour: number;                    // 0-23
  hour_result: 'win' | 'loss';
  intensity_rating?: number;       // 1-5, only on loss
  loss_reason_category?: string;   // reserved for future expansion
  loss_reason_text?: string;       // freeform loss reason, only on loss
  nextHourPlan?: string;           // next hour intention, only on win
  loggedAt: string;                // ISO timestamp
};

const CHECKINS_KEY = '@wth_checkins';
const UNAVAILABLE_KEY = '@wth_unavailable_hours';

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function loadCheckIns(): Promise<CheckInRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(CHECKINS_KEY);
    if (!raw) return [];
    const records = JSON.parse(raw) as any[];
    // Migrate legacy records that used `won: boolean`
    return records.map((r) => {
      if ('won' in r && !('hour_result' in r)) {
        return { ...r, hour_result: r.won ? 'win' : 'loss' } as CheckInRecord;
      }
      return r as CheckInRecord;
    });
  } catch {
    return [];
  }
}

export async function saveCheckIn(record: CheckInRecord): Promise<void> {
  try {
    const all = await loadCheckIns();
    const idx = all.findIndex(
      (r) => r.date === record.date && r.hour === record.hour
    );
    if (idx >= 0) all[idx] = record;
    else all.push(record);
    await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(all));
  } catch {}
}

export async function loadUnavailableHours(): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(UNAVAILABLE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveUnavailableHours(hours: number[]): Promise<void> {
  try {
    await AsyncStorage.setItem(UNAVAILABLE_KEY, JSON.stringify(hours));
  } catch {}
}

// ── M.Y.B.E.D. ────────────────────────────────────────────────────────────────
export type MYBEDItems = [string, string, string, string, string, string];

export async function loadMYBED(date: string): Promise<MYBEDItems> {
  try {
    const raw = await AsyncStorage.getItem(`@wth_mybyed_${date}`);
    return raw ? JSON.parse(raw) : ['', '', '', '', '', ''];
  } catch {
    return ['', '', '', '', '', ''];
  }
}

export async function saveMYBED(date: string, items: MYBEDItems): Promise<void> {
  try {
    await AsyncStorage.setItem(`@wth_mybyed_${date}`, JSON.stringify(items));
  } catch {}
}

// ── BeastMode last-submit timestamp ──────────────────────────────────────────
export async function loadBeastLastSubmit(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem('@wth_beast_last');
    return raw ? parseInt(raw, 10) : 0;
  } catch { return 0; }
}

export async function saveBeastLastSubmit(ts: number): Promise<void> {
  try { await AsyncStorage.setItem('@wth_beast_last', String(ts)); } catch {}
}
