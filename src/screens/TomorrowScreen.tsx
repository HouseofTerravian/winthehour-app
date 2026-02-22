import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type SubTab = 'tomorrow' | 'week' | 'month';

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: 'tomorrow', label: 'TOMORROW' },
  { key: 'week',     label: 'WEEK' },
  { key: 'month',    label: 'MONTH' },
];

export default function TomorrowScreen() {
  const { profile } = useAuth();
  const { colors, skinFonts } = useTheme();
  const isFree = !profile?.tier || profile.tier === 'Freshman';
  const [activeTab, setActiveTab] = useState<SubTab>('tomorrow');
  const r = (n: number) => Math.round(n * skinFonts.borderRadiusScale);

  // ── Free: lock screen ────────────────────────────────────────────────────────
  if (isFree) {
    return (
      <View style={[s.root, { backgroundColor: colors.charcoal }]}>
        <View style={[s.safeTop, { paddingTop: Platform.OS === 'ios' ? 56 : Platform.OS === 'android' ? 32 : 20 }]} />
        <View style={s.lockWrap}>
          <Text style={s.lockGlyph}>⊘</Text>
          <Text style={[s.lockTitle, {
            color: colors.text1,
            fontFamily: skinFonts.titleFontFamily,
            fontWeight: skinFonts.titleFontWeight,
            letterSpacing: skinFonts.titleLetterSpacing,
          }]}>
            TOMORROW
          </Text>
          <Text style={s.timeLayerLabel}>FORWARD PLANNING</Text>
          <Text style={[s.lockBody, { color: colors.text3, fontFamily: skinFonts.fontFamily }]}>
            Upgrade to plan ahead.
          </Text>
          <View style={[s.upgradeCta, { borderColor: colors.molten, borderRadius: r(12) }]}>
            <Text style={[s.upgradeCtaText, { color: colors.molten, fontFamily: skinFonts.fontFamily }]}>
              VIEW PLANS
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ── Paid: sub-tab scaffold ──────────────────────────────────────────────────
  return (
    <View style={[s.root, { backgroundColor: colors.charcoal }]}>
      {/* Header */}
      <View style={[s.header, {
        paddingTop: Platform.OS === 'ios' ? 56 : Platform.OS === 'android' ? 32 : 20,
        borderBottomColor: colors.cardBorder,
      }]}>
        <Text style={[s.title, {
          color: colors.text1,
          fontFamily: skinFonts.titleFontFamily,
          fontWeight: skinFonts.titleFontWeight,
          letterSpacing: skinFonts.titleLetterSpacing,
        }]}>
          TOMORROW
        </Text>
        <Text style={s.timeLayerLabel}>FORWARD PLANNING</Text>

        {/* Sub-tab bar */}
        <View style={s.subTabBar}>
          {SUB_TABS.map((t) => {
            const active = activeTab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[s.subTab, active && { borderBottomColor: colors.molten, borderBottomWidth: 2 }]}
                onPress={() => setActiveTab(t.key)}
                activeOpacity={0.75}
              >
                <Text style={[s.subTabLabel, {
                  color: active ? colors.molten : colors.text4,
                  fontFamily: skinFonts.fontFamily,
                  fontWeight: active ? '700' : '600',
                }]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={[s.placeholderCard, { backgroundColor: colors.slate, borderColor: colors.cardBorder, borderRadius: r(20) }]}>
          <Text style={[s.placeholderText, { color: colors.text4, fontFamily: skinFonts.fontFamily }]}>
            {activeTab === 'tomorrow'
              ? 'Tomorrow planning — coming soon.'
              : activeTab === 'week'
              ? 'Week view — coming soon.'
              : 'Month view — coming soon.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1 },
  safeTop: {},

  // Lock screen
  lockWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  lockGlyph:{ fontSize: 44, color: 'rgba(255,255,255,0.12)', marginBottom: 24 },
  lockTitle: { fontSize: 36, marginBottom: 4, textAlign: 'center' },
  timeLayerLabel: {
    fontSize: 9, fontWeight: '700', letterSpacing: 2,
    color: 'rgba(255,255,255,0.18)', marginBottom: 20, textAlign: 'center',
  },
  lockBody: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  upgradeCta: {
    borderWidth: 1.5,
    paddingHorizontal: 28,
    paddingVertical: 13,
  },
  upgradeCtaText: { fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },

  // Paid header
  header: {
    paddingHorizontal: 24,
    paddingBottom: 0,
    borderBottomWidth: 1,
  },
  title:  { fontSize: 36, marginBottom: 2 },

  // Sub-tab bar
  subTabBar: {
    flexDirection: 'row',
    marginTop: 14,
  },
  subTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  subTabLabel: { fontSize: 11, letterSpacing: 0.8 },

  // Content
  content: { padding: 24, paddingBottom: 48 },
  placeholderCard: {
    padding: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  placeholderText: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
