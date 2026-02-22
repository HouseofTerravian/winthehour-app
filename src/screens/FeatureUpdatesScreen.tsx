import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';
import { useTheme } from '../context/ThemeContext';

type UpdateEntry = {
  version:  string;
  date:     string;
  tag:      string;
  tagColor: string;
  items:    string[];
};

const UPDATES: UpdateEntry[] = [
  {
    version: '0.6.2',
    date: '2026-02-21',
    tag: 'BEAST MODE',
    tagColor: Colors.molten,
    items: [
      'Beast Mode now anchors to absolute clock boundaries: :00, :15, :30, :45',
      'Timer is no longer relative to toggle time — aligned to system clock',
      'On enable: computes exact ms to next quarter-hour and fires a precise setTimeout',
      'After first trigger: fixed 15-minute setInterval — no recalculation, no drift',
      'Display countdown reflects real time remaining to next quarter anchor',
      'App foreground resume: re-aligns to clock via AppState listener',
      'Trigger at :15 exactly — institutional, external, non-negotiable',
    ],
  },
  {
    version: '0.6.1',
    date: '2026-02-21',
    tag: 'REFINEMENT',
    tagColor: Colors.steel,
    items: [
      'WTH! screen: HH:55 Reset Ritual block removed — arena breathes clean',
      'Bottom nav icon system unified: all emoji replaced with geometric Unicode symbols',
      'WTH! → ◔ (clock arc) · TODAY → ◉ (radiant) · TOMORROW → ▷ (forward) · NEXUS → ◎ (hub)',
      'Consistent stroke weight across all 4 nav icons — no mixed emoji + vector',
    ],
  },
  {
    version: '0.6.0',
    date: '2026-02-21',
    tag: 'NAVIGATION',
    tagColor: Colors.molten,
    items: [
      '4-column temporal spine: WTH! | TODAY | TOMORROW | NEXUS',
      'TOMORROW tab: free tier sees premium lock overlay; paid tier gets Tomorrow/Week/Month scaffold',
      'NEXUS tab: identity hub replacing Home tab — User Alias header + LIFETIME sub-label',
      'Display Alias system: set sovereign identity in Profile → Appearance (max 10 chars, uppercase)',
      'NEXUS tab label dynamically shows alias on paid plans; falls back to NEXUS',
      'All 9 reorderable tabs (Profile, Dashboard, Missions, Flows, Stats, Updates, Store, Integrations, Coupons) now live inside NEXUS',
      'WTH! tab shows 60M sub-indicator; TODAY shows 24H sub-indicator in bottom nav',
      'Bottom nav reduced from 3 tabs to 4 cleaner columns',
    ],
  },
  {
    version: '0.5.3',
    date: '2026-02-21',
    tag: 'VISUAL',
    tagColor: Colors.molten,
    items: [
      'Arena bg deepened to #040405 — pulls focus into the flow card',
      'Top/bottom vignette overlays added to ArenaContainer (pointerEvents passthrough)',
      'HudCard glow further reduced: border 0.16 alpha, opacity 0.82 — recedes behind arena',
      'WTH! screen: 60M time-layer label added under subtitle',
      'TODAY! screen: 24H time-layer label added under date; glow reduced ~10%; M.Y.B.E.D. spacing increased',
      'Home screen: LIFETIME time-layer label added; stat card gradients and borders toned down',
      'Home screen: AVAILABLE NOW badge removed from Morning Flow card',
      'Flows screen: card border increased to 2px; morning gradient reduced; evening gold border intensified',
      'Statistics: empty state "Win Hours to populate your graph." shown when no data',
      'Rating block in WTH! loss flow: borders removed — reflection feel, auto-submits on tap',
    ],
  },
  {
    version: '0.5.2',
    date: '2026-02-21',
    tag: 'ARCHITECTURE',
    tagColor: Colors.gold,
    items: [
      'Shared UI primitives: ArenaContainer, HudCard, EliteButton, MatteCard, Badge, SectionHeader',
      'CheckInRecord schema: won → hour_result (\'win\'|\'loss\') + intensity_rating + loss_reason_text',
      'Legacy check-in records auto-migrated on load — no data loss',
      'WTH! flow restructured: ask → YES → plan | NO → loss_reason → rate',
      'Rating auto-submits on tap — no confirm button needed',
      'TODAY! hour rows converted to MatteCard with reduced gradient glow',
      'ProfileScreen: stat pills (Streak/Hours Won/XP) removed — profile is emotional layer only',
      'PartnerStore scaffold: placement types, tier visibility, priority resolution',
    ],
  },
  {
    version: '0.5.1',
    date: '2026-02-20',
    tag: 'STRUCTURE',
    tagColor: Colors.molten,
    items: [
      'Bottom nav reordered: Home | WTH! | TODAY!',
      'TODAY! tab: full waking hours (6am–11pm) + M.Y.B.E.D.',
      'WTH! tab: focused on present hour flow + logged hours only',
      'Integrations tab added between Store and Coupons',
      'Light mode: all screens now respond to theme toggle',
    ],
  },
  {
    version: '0.5.0',
    date: '2026-02-20',
    tag: 'EXPERIENCE',
    tagColor: Colors.gold,
    items: [
      'WTH! flow: "Why did you not win?" step added before rating',
      'BeastMode toggle — prompts every 15 minutes with live countdown',
      'M.Y.B.E.D. card — 6 numbered daily priorities, Tab key chains inputs',
      'Free-tier sponsorship line on every check-in tile',
      'Statistics: "28-Day Activity" → "This Month at a Glance" (left-to-right)',
      'Light Mode toggle in Profile → Appearance',
      'App Skins: Default, Student, Athletic, Professional (font + style)',
      'A.I. Assistant name (Premium) configurable in Profile settings',
      'Location-Based Planning toggle with full description',
      'Reorderable Home tabs: long-press to pick, tap to place',
      'New Coupons tab added to Home tab bar',
      'Default tab order: Profile, Dashboard, Missions, Flows, Stats, Updates, Store, Integrations, Coupons',
    ],
  },
  {
    version: '0.4.0',
    date: '2026-02-20',
    tag: 'WTH! FLOW',
    tagColor: Colors.molten,
    items: [
      'WTH! tab moved to first position with clock icon (⏱)',
      'Home tab gets house icon (🏠)',
      'WTH! question flow: Did you win this hour? → Yes/No paths',
      'Yes path: plan for the next hour',
      'No path: 1–5 rating → plan for the next hour',
      'All check-ins persisted to device storage (AsyncStorage)',
      'Past hours shown below flow card — tap to re-log',
      'Unavailable Hours setting added to Profile → Settings',
      'Unavailable hours show on WTH! screen instead of prompting',
    ],
  },
  {
    version: '0.3.0',
    date: '2026-02-20',
    tag: 'NAVIGATION',
    tagColor: Colors.gold,
    items: [
      'All screens moved under the Home tab',
      'Check-ins renamed to WTH!',
      'Feature Updates screen added (you\'re here)',
      'Search bar added to Voices in Store',
      'All stats reset to zero for new accounts',
    ],
  },
  {
    version: '0.2.0',
    date: '2026-02-20',
    tag: 'AUTH',
    tagColor: Colors.molten,
    items: [
      'Supabase authentication — sign in, sign up, sign out',
      'Session persistence via SecureStore (native) and localStorage (web)',
      'Profile row auto-created on signup via DB trigger',
      'HomeScreen and ProfileScreen show live data from Supabase',
      'Navigator Web Lock issue resolved for regular browser refresh',
      'Service worker updated: JS bundles no longer cached (wth-v2)',
    ],
  },
  {
    version: '0.1.1',
    date: '2026-02-20',
    tag: 'PERFORMANCE',
    tagColor: Colors.steel,
    items: [
      'Image assets optimized: 5.1 MB → 272 KB (95% reduction)',
      'logo-wth, checkmark-neon, clock-check resized to display dimensions',
      'PNG compression level maxed across all assets',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-02-19',
    tag: 'FOUNDATION',
    tagColor: Colors.steel,
    items: [
      'Initial app scaffold — 7 screens',
      'Bottom tab navigation (React Navigation)',
      'Theme system: charcoal / slate / steel / molten / gold',
      'PWA support: service worker + manifest',
      'Home, Check-ins, Missions, Statistics, Flows, Store, Profile screens',
    ],
  },
];

export default function FeatureUpdatesScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.charcoal }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text1 }]}>Updates</Text>
        <Text style={[styles.subtitle, { color: colors.text3 }]}>Every build. Every change. On record.</Text>

        {UPDATES.map((update) => (
          <View key={update.version} style={[styles.card, { backgroundColor: colors.slate, borderColor: colors.cardBorder }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={[styles.version, { color: colors.text1 }]}>v{update.version}</Text>
                <Text style={[styles.date, { color: colors.text4 }]}>{update.date}</Text>
              </View>
              <View style={[styles.tag, { borderColor: update.tagColor }]}>
                <Text style={[styles.tagText, { color: update.tagColor }]}>{update.tag}</Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.faint }]} />
            {update.items.map((item, i) => (
              <View key={i} style={styles.itemRow}>
                <LinearGradient
                  colors={[update.tagColor, `${update.tagColor}88`]}
                  style={styles.bullet}
                />
                <Text style={[styles.itemText, { color: colors.text2 }]}>{item}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={[styles.footer, { color: colors.text4 }]}>
          Win The Hour!™ · © Chude Muonelo{'\n'}Toravian Dynasty Trust · MCM Enterprises
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  content: { padding: 24, paddingTop: 24, paddingBottom: 48 },

  title:   { fontSize: 36, fontWeight: '800', marginBottom: 4 },
  subtitle:{ fontSize: 14, marginBottom: 28 },

  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
  },
  cardHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardHeaderLeft: { gap: 2 },
  version:        { fontSize: 18, fontWeight: '800' },
  date:           { fontSize: 11, fontWeight: '500' },
  tag:            { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  tagText:        { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },

  divider: { height: 1, marginBottom: 14 },

  itemRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  bullet:   { width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  itemText: { flex: 1, fontSize: 13, lineHeight: 19 },

  footer: { textAlign: 'center', fontSize: 11, lineHeight: 18, marginTop: 12 },
});
