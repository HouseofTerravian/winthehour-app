import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type Category = 'tiers' | 'voices' | 'boosts';

const TIERS = [
  {
    name: 'Freshman',  price: 'Free',   current: true,
    gradient: ['rgba(60,79,101,0.3)', 'rgba(60,79,101,0.1)'] as [string, string],
    borderColor: Colors.steel,  labelColor: Colors.muted,
    features: ['Plan up to 6 hours/day', 'Morning & Evening Flow', '7-day streak tracking', 'Basic hourly check-ins'],
  },
  {
    name: 'Varsity',   price: '$12/mo', current: false,
    gradient: ['rgba(255,94,26,0.2)', 'rgba(255,94,26,0.05)'] as [string, string],
    borderColor: Colors.molten, labelColor: Colors.molten,
    features: ['Full 24-hour planning', 'AI co-pilot suggestions', 'Unlimited streak tracking', 'Encrypted reflection log', 'Full analytics dashboard', 'Referral bonuses'],
  },
  {
    name: 'Crucible',  price: '$29/mo', current: false,
    gradient: ['rgba(255,179,0,0.2)', 'rgba(255,179,0,0.05)'] as [string, string],
    borderColor: Colors.gold,   labelColor: Colors.gold,
    features: ['Everything in Varsity', 'Advanced AI pattern detection', 'Weekly + Monthly reports', 'Community groups access', 'Premium voice packs', '30% OFF voice packs'],
  },
  {
    name: 'Elite',     price: 'Earned', current: false, locked: true,
    gradient: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)'] as [string, string],
    borderColor: 'rgba(255,255,255,0.15)', labelColor: 'rgba(255,255,255,0.5)',
    features: ['Everything in Crucible', 'Host groups & cohorts', 'Group stats dashboard', 'Cannot be purchased', 'Requires sustained discipline'],
  },
  {
    name: 'Legendary', price: 'Earned', current: false, locked: true,
    gradient: ['rgba(255,179,0,0.1)', 'rgba(255,94,26,0.05)'] as [string, string],
    borderColor: 'rgba(255,179,0,0.2)', labelColor: 'rgba(255,179,0,0.5)',
    features: ['Everything in Elite', 'Invite-only legacy systems', 'Stewardship recognition', 'Cannot be purchased', 'Earned through legacy'],
  },
];

const VOICES = [
  { name: 'The Sovereign', tagline: 'Commanding. Measured. Inevitable.', tier: 'Crucible' },
  { name: 'The Architect', tagline: 'Systems. Structure. Execution.',    tier: 'Crucible' },
  { name: 'The Disruptor', tagline: 'Raw. Direct. No filter.',           tier: 'Crucible' },
  { name: 'The Scholar',   tagline: 'Calm. Precise. Enlightened.',       tier: 'Varsity'  },
];

const BOOSTS = [
  { name: 'Streak Shield',    description: 'Protect your streak from a single missed day.',   cost: '200 XP', icon: '🛡' },
  { name: 'XP Multiplier',    description: '2x XP for the next 3 hours.',                    cost: '150 XP', icon: '⚡️' },
  { name: 'Silent Mode Pass', description: 'Pause all notifications for 4 hours without streak risk.', cost: '100 XP', icon: '🔇' },
];

export default function StoreScreen() {
  const { profile } = useAuth();
  const { colors }  = useTheme();
  const xp          = profile?.xp ?? 0;
  const [category,    setCategory]   = useState<Category>('tiers');
  const [voiceQuery,  setVoiceQuery] = useState('');

  return (
    <View style={[styles.root, { backgroundColor: colors.charcoal }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text1 }]}>Store</Text>
        <Text style={[styles.subtitle, { color: colors.text3 }]}>You don't buy status. You earn it.</Text>

        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: colors.slate, borderColor: colors.cardBorder }]}>
          {(['tiers', 'voices', 'boosts'] as Category[]).map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.tab, category === c && styles.tabActive]}
              onPress={() => setCategory(c)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabText, { color: colors.text4 }, category === c && styles.tabTextActive]}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tiers */}
        {category === 'tiers' && TIERS.map((tier) => (
          <View key={tier.name} style={[styles.tierCardWrap, { opacity: tier.locked ? 0.65 : 1 }]}>
            <LinearGradient colors={tier.gradient} style={[styles.tierCard, { borderColor: tier.borderColor }]}>
              <View style={styles.tierCardHeader}>
                <View>
                  <Text style={[styles.tierName, { color: tier.labelColor }]}>{tier.name}</Text>
                  <Text style={[styles.tierPrice, { color: tier.locked ? colors.text4 : tier.labelColor }]}>
                    {tier.locked ? 'EARNED — NOT PURCHASED' : tier.price}
                  </Text>
                </View>
                {tier.current ? (
                  <View style={[styles.badge, { borderColor: tier.borderColor }]}>
                    <Text style={[styles.badgeText, { color: tier.labelColor }]}>CURRENT</Text>
                  </View>
                ) : tier.locked ? (
                  <Text style={styles.lockIcon}>🔒</Text>
                ) : (
                  <TouchableOpacity activeOpacity={0.85}>
                    <LinearGradient
                      colors={tier.name === 'Varsity' ? [Colors.molten, '#FF8C4A'] : [Colors.gold, '#FFCA44']}
                      style={styles.upgradeBtn}
                    >
                      <Text style={styles.upgradeBtnText}>UPGRADE</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
              <View style={[styles.tierDivider, { backgroundColor: colors.faint }]} />
              {tier.features.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={[styles.featureCheck, { color: tier.locked ? colors.text4 : tier.labelColor }]}>✓</Text>
                  <Text style={[styles.featureText, { color: tier.locked ? colors.text3 : colors.text2 }]}>{f}</Text>
                </View>
              ))}
            </LinearGradient>
          </View>
        ))}

        {/* Voices */}
        {category === 'voices' && (
          <View>
            <LinearGradient colors={['rgba(255,179,0,0.1)', 'rgba(255,179,0,0.04)']} style={styles.lockedNote}>
              <Text style={styles.lockedNoteLabel}>CRUCIBLE TIER REQUIRED</Text>
              <Text style={[styles.lockedNoteBody, { color: colors.text3 }]}>
                Upgrade to Crucible to unlock AI Coach voice packs for your Morning and Evening Flows.
              </Text>
            </LinearGradient>
            <View style={[styles.searchWrap, { backgroundColor: colors.slate, borderColor: colors.cardBorder }]}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={[styles.searchInput, { color: colors.text1 }]}
                placeholder="Search voices…"
                placeholderTextColor={colors.text4}
                value={voiceQuery}
                onChangeText={setVoiceQuery}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
            {VOICES.filter((v) =>
              v.name.toLowerCase().includes(voiceQuery.toLowerCase()) ||
              v.tagline.toLowerCase().includes(voiceQuery.toLowerCase())
            ).map((v) => (
              <View key={v.name} style={[styles.voiceCard, { backgroundColor: colors.slate, borderColor: colors.cardBorder }]}>
                <View style={[styles.voiceIcon, { backgroundColor: colors.faint }]}>
                  <Text style={styles.voiceIconText}>🎙</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.voiceName, { color: colors.text1 }]}>{v.name}</Text>
                  <Text style={[styles.voiceTagline, { color: colors.text3 }]}>{v.tagline}</Text>
                </View>
                <View style={[styles.badge, { borderColor: Colors.gold }]}>
                  <Text style={[styles.badgeText, { color: Colors.gold }]}>{v.tier.toUpperCase()}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Boosts */}
        {category === 'boosts' && (
          <View>
            <LinearGradient colors={['rgba(255,179,0,0.1)', 'rgba(255,179,0,0.04)']} style={styles.xpBalance}>
              <Text style={[styles.xpBalanceLabel, { color: colors.text3 }]}>XP Balance</Text>
              <Text style={styles.xpBalanceValue}>{xp.toLocaleString()} XP</Text>
            </LinearGradient>
            {BOOSTS.map((b) => (
              <View key={b.name} style={[styles.boostCard, { backgroundColor: colors.slate, borderColor: colors.cardBorder }]}>
                <Text style={styles.boostIcon}>{b.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.boostName, { color: colors.text1 }]}>{b.name}</Text>
                  <Text style={[styles.boostDesc, { color: colors.text3 }]}>{b.description}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8}>
                  <LinearGradient colors={['rgba(255,179,0,0.2)', 'rgba(255,179,0,0.08)']} style={styles.xpBtn}>
                    <Text style={styles.xpBtnText}>{b.cost}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title:   { fontSize: 36, fontWeight: '800', marginBottom: 4 },
  subtitle:{ fontSize: 14, marginBottom: 28 },

  tabs:         { flexDirection: 'row', borderRadius: 16, padding: 4, marginBottom: 24, borderWidth: 1 },
  tab:          { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 12 },
  tabActive:    { backgroundColor: Colors.molten },
  tabText:      { fontSize: 13, fontWeight: '600' },
  tabTextActive:{ color: '#FFFFFF', fontWeight: '700' },

  tierCardWrap:   { marginBottom: 14 },
  tierCard:       { borderRadius: 22, padding: 22, borderWidth: 1.5 },
  tierCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  tierName:       { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  tierPrice:      { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  badge:          { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:      { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  lockIcon:       { fontSize: 22 },
  upgradeBtn:     { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  upgradeBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  tierDivider:    { height: 1, marginBottom: 14 },
  featureRow:     { flexDirection: 'row', gap: 10, marginBottom: 8 },
  featureCheck:   { fontSize: 13, fontWeight: '800', marginTop: 1 },
  featureText:    { fontSize: 13, lineHeight: 19, flex: 1 },

  lockedNote:      { borderRadius: 16, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,179,0,0.3)', borderLeftWidth: 3, borderLeftColor: Colors.gold },
  lockedNoteLabel: { fontSize: 10, fontWeight: '700', color: Colors.gold, letterSpacing: 1, marginBottom: 6 },
  lockedNoteBody:  { fontSize: 13, lineHeight: 19 },

  searchWrap:  { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, marginBottom: 14, gap: 8 },
  searchIcon:  { fontSize: 14 },
  searchInput: { flex: 1, height: 44, fontSize: 14 },

  voiceCard:     { borderRadius: 18, padding: 18, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1 },
  voiceIcon:     { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  voiceIconText: { fontSize: 22 },
  voiceName:     { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  voiceTagline:  { fontSize: 12 },

  xpBalance:      { borderRadius: 16, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(255,179,0,0.3)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpBalanceLabel: { fontSize: 13 },
  xpBalanceValue: { fontSize: 22, fontWeight: '800', color: Colors.gold },

  boostCard: { borderRadius: 18, padding: 18, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1 },
  boostIcon: { fontSize: 28 },
  boostName: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  boostDesc: { fontSize: 12, lineHeight: 17 },
  xpBtn:     { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,179,0,0.4)' },
  xpBtnText: { color: Colors.gold, fontSize: 12, fontWeight: '700' },
});
