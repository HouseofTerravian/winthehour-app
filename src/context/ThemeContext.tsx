import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  loadAppSettings,
  saveAppSetting,
  DEFAULT_TAB_ORDER,
  type Skin,
} from '../lib/app-settings';

// ── Color palettes ────────────────────────────────────────────────────────────
export const DarkColors = {
  charcoal:   '#0B0C10',
  slate:      '#1F2025',
  steel:      '#3C4F65',
  molten:     '#FF5E1A',
  gold:       '#FFB300',
  white:      '#FFFFFF',
  muted:      'rgba(255,255,255,0.5)',
  faint:      'rgba(255,255,255,0.1)',
  border:     'rgba(60,79,101,0.6)',
  // semantic shortcuts
  text1:      '#FFFFFF',
  text2:      'rgba(255,255,255,0.7)',
  text3:      'rgba(255,255,255,0.45)',
  text4:      'rgba(255,255,255,0.25)',
  cardBg:     '#1F2025',
  cardBorder: 'rgba(60,79,101,0.5)',
  inputBg:    'rgba(255,255,255,0.05)',
  rowBg:      'rgba(31,32,37,1)',
};

export const LightColors = {
  charcoal:   '#EEF0F7',
  slate:      '#FFFFFF',
  steel:      '#7A8FA8',
  molten:     '#FF5E1A',
  gold:       '#D49200',
  white:      '#0D1117',
  muted:      'rgba(13,17,23,0.55)',
  faint:      'rgba(13,17,23,0.08)',
  border:     'rgba(60,79,101,0.25)',
  text1:      '#0D1117',
  text2:      'rgba(13,17,23,0.75)',
  text3:      'rgba(13,17,23,0.5)',
  text4:      'rgba(13,17,23,0.3)',
  cardBg:     '#FFFFFF',
  cardBorder: 'rgba(100,120,150,0.2)',
  inputBg:    'rgba(13,17,23,0.04)',
  rowBg:      '#F7F8FC',
};

export type AppColors = typeof DarkColors;

// ── Skin font profiles ────────────────────────────────────────────────────────
export type SkinFonts = {
  fontFamily:         string | undefined;
  titleFontFamily:    string | undefined;
  titleLetterSpacing: number;
  titleFontWeight:    '700' | '800' | '900';
  borderRadiusScale:  number;
  skinLabel:          string;
};

export const SKINS: Record<Skin, SkinFonts> = {
  default: {
    fontFamily:         undefined,
    titleFontFamily:    undefined,
    titleLetterSpacing: -0.5,
    titleFontWeight:    '800',
    borderRadiusScale:  1.0,
    skinLabel:          'Default',
  },
  student: {
    fontFamily:         Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }),
    titleFontFamily:    Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }),
    titleLetterSpacing: 0.2,
    titleFontWeight:    '700',
    borderRadiusScale:  1.35,
    skinLabel:          'Student',
  },
  athletic: {
    fontFamily:         Platform.select({ ios: 'System', android: 'sans-serif-condensed', default: '"Arial Narrow", sans-serif' }),
    titleFontFamily:    Platform.select({ ios: 'System', android: 'sans-serif-condensed', default: '"Arial Narrow", sans-serif' }),
    titleLetterSpacing: 2.0,
    titleFontWeight:    '900',
    borderRadiusScale:  0.55,
    skinLabel:          'Athletic',
  },
  professional: {
    fontFamily:         Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif', default: '"Helvetica Neue", Helvetica, sans-serif' }),
    titleFontFamily:    Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif', default: '"Helvetica Neue", Helvetica, sans-serif' }),
    titleLetterSpacing: 0.8,
    titleFontWeight:    '700',
    borderRadiusScale:  0.75,
    skinLabel:          'Professional',
  },
};

// ── Context ───────────────────────────────────────────────────────────────────
type ThemeContextType = {
  colors:          AppColors;
  skin:            Skin;
  skinFonts:       SkinFonts;
  isDark:          boolean;
  toggleDarkMode:  () => void;
  setSkin:         (s: Skin) => void;
  aiName:          string;
  setAiName:       (name: string) => void;
  locationEnabled: boolean;
  toggleLocation:  () => void;
  tabOrder:        string[];
  setTabOrder:     (order: string[]) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colors:          DarkColors,
  skin:            'default',
  skinFonts:       SKINS.default,
  isDark:          true,
  toggleDarkMode:  () => {},
  setSkin:         () => {},
  aiName:          'Atlas',
  setAiName:       () => {},
  locationEnabled: false,
  toggleLocation:  () => {},
  tabOrder:        DEFAULT_TAB_ORDER,
  setTabOrder:     () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark]             = useState(true);
  const [skin, setSkinState]            = useState<Skin>('default');
  const [aiName, setAiNameState]        = useState('Atlas');
  const [locationEnabled, setLocation]  = useState(false);
  const [tabOrder, setTabOrderState]    = useState<string[]>(DEFAULT_TAB_ORDER);

  useEffect(() => {
    loadAppSettings().then((s) => {
      setIsDark(s.isDark);
      setSkinState(s.skin);
      setAiNameState(s.aiName);
      setLocation(s.locationEnabled);
      setTabOrderState(s.tabOrder);
    });
  }, []);

  function toggleDarkMode() {
    const next = !isDark;
    setIsDark(next);
    saveAppSetting('LIGHT_MODE', next ? 'true' : 'false');
  }

  function setSkin(s: Skin) {
    setSkinState(s);
    saveAppSetting('SKIN', s);
  }

  function setAiName(name: string) {
    setAiNameState(name);
    saveAppSetting('AI_NAME', name);
  }

  function toggleLocation() {
    const next = !locationEnabled;
    setLocation(next);
    saveAppSetting('LOCATION', next ? 'true' : 'false');
  }

  function setTabOrder(order: string[]) {
    setTabOrderState(order);
    saveAppSetting('TAB_ORDER', JSON.stringify(order));
  }

  return (
    <ThemeContext.Provider
      value={{
        colors:    isDark ? DarkColors : LightColors,
        skin,
        skinFonts: SKINS[skin],
        isDark,
        toggleDarkMode,
        setSkin,
        aiName,
        setAiName,
        locationEnabled,
        toggleLocation,
        tabOrder,
        setTabOrder,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
