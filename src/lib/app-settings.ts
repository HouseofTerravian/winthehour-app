import AsyncStorage from '@react-native-async-storage/async-storage';

export type Skin = 'default' | 'student' | 'athletic' | 'professional';

export const DEFAULT_TAB_ORDER = [
  'profile', 'dashboard', 'missions', 'flows', 'stats', 'updates', 'store', 'integrations', 'coupons',
];

const K = {
  LIGHT_MODE: '@wth_light_mode',
  SKIN:       '@wth_skin',
  AI_NAME:    '@wth_ai_name',
  LOCATION:   '@wth_location',
  TAB_ORDER:  '@wth_tab_order',
} as const;

export async function loadAppSettings() {
  try {
    const pairs = await AsyncStorage.multiGet(Object.values(K));
    const m: Record<string, string | null> = {};
    pairs.forEach(([k, v]) => { m[k] = v; });
    return {
      isDark:          m[K.LIGHT_MODE] !== 'false',   // default = dark
      skin:            (m[K.SKIN] as Skin) ?? 'default',
      aiName:          m[K.AI_NAME] ?? 'Atlas',
      locationEnabled: m[K.LOCATION] === 'true',
      tabOrder:        m[K.TAB_ORDER] ? JSON.parse(m[K.TAB_ORDER]!) : DEFAULT_TAB_ORDER,
    };
  } catch {
    return { isDark: true, skin: 'default' as Skin, aiName: 'Atlas', locationEnabled: false, tabOrder: DEFAULT_TAB_ORDER };
  }
}

export async function saveAppSetting(key: keyof typeof K, value: string) {
  try { await AsyncStorage.setItem(K[key], value); } catch {}
}
