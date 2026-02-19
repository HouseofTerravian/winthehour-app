import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography } from '../theme';

type Category = 'tiers' | 'voices' | 'boosts';

const TIERS = [
  {
    name: 'Starter',
    price: 'Free',
    color: Colors.steel,
    current: true,
    features: ['Plan up to 6 hours/day', 'Morning & Evening Flow', '7-day streak tracking', 'Basic check-ins'],
  },
  {
    name: 'Sovereign',
    price: '$12/mo',
    color: Colors.molten,
    current: false,
    features: ['Full 24-hour planning', 'AI co-pilot suggestions', 'Unlimited streak tracking', 'Encrypted reflection log', 'Full analytics dashboard', 'Referral bonuses'],
  },
  {
    name: 'Elite',
    price: '$29/mo',
    color: Colors.gold,
    current: false,
    features: ['Everything in Sovereign', 'Advanced AI pattern detection', 'Weekly + Monthly reports', 'Community groups access', 'Premium voice packs', '30% OFF voice packs'],
  },
  {
    name: 'Elite+',
    price: 'Earned',
    color: Colors.white,
    current: false,
    locked: true,
    features: ['Everything in Elite', 'Host groups & cohorts', 'Group stats dashboard', 'Cannot be purchased', 'Requires sustained discipline'],
  },
];

const VOICES = [
  { name: 'The Sovereign', tagline: 'Commanding. Measured. Inevitable.', tier: 'Elite', preview: '🎙' },
  { name: 'The Architect', tagline: 'Systems. Structure. Execution.', tier: 'Elite', preview: '🎙' },
  { name: 'The Disruptor', tagline: 'Raw. Direct. No filter.', tier: 'Elite', preview: '🎙' },
  { name: 'The Scholar', tagline: 'Calm. Precise. Enlightened.', tier: 'Sovereign', preview: '🎙' },
];

const BOOSTS = [
  { name: 'Streak Shield', description: 'Protect your streak from a single missed day.', cost: '200 XP', icon: '🛡' },
  { name: 'XP Multiplier', description: '2x XP for the next 3 hours.', cost: '150 XP', icon: '⚡️' },
  { name: 'Silent Mode Pass', description: 'Pause all notifications for 4 hours without streak risk.', cost: '100 XP', icon: '🔇' },
];

export default function StoreScreen() {
  const [category, setCategory] = useState<Category>('tiers');

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[Typography.display, { marginBottom: 6 }]}>Store</Text>
        <Text style={[Typography.bodyMuted, { marginBottom: 28 }]}>
          You don't buy status. You earn it.
        </Text>

        {/* Category Tabs */}
        <View style={styles.tabs}>
          {(['tiers', 'voices', 'boosts'] as Category[]).map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.tab, category === c && styles.tabActive]}
              onPress={() => setCategory(c)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabText, category === c && styles.tabTextActive]}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tiers */}
        {category === 'tiers' && (
          <View>
            {TIERS.map((tier) => (
              <View
                key={tier.name}
                style={[
                  styles.tierCard,
                  { borderColor: tier.current ? tier.color : Colors.border },
                  tier.locked && { opacity: 0.6 },
                ]}
              >
                <View style={styles.tierHeader}>
                  <View>
                    <Text style={[Typography.heading2, { color: tier.color }]}>{tier.name}</Text>
                    <Text style={[Typography.label, { color: Colors.muted, marginTop: 2 }]}>
                      {tier.locked ? 'EARNED — NOT PURCHASED' : tier.price}
                    </Text>
                  </View>
                  {tier.current ? (
                    <View style={[styles.badge, { borderColor: tier.color }]}>
                      <Text style={[styles.badgeText, { color: tier.color }]}>CURRENT</Text>
                    </View>
                  ) : tier.locked ? (
                    <Text style={{ fontSize: 24 }}>🔒</Text>
                  ) : (
                    <TouchableOpacity style={[styles.upgradeBtn, { borderColor: tier.color }]} activeOpacity={0.8}>
                      <Text style={[styles.upgradeBtnText, { color: tier.color }]}>UPGRADE</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.divider} />
                {tier.features.map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Text style={[styles.checkmark, { color: tier.color }]}>✓</Text>
                    <Text style={[Typography.body, { flex: 1 }]}>{f}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Voice Packs */}
        {category === 'voices' && (
          <View>
            <View style={styles.lockedNote}>
              <Text style={[Typography.label, { color: Colors.gold }]}>ELITE TIER REQUIRED</Text>
              <Text style={[Typography.bodyMuted, { marginTop: 6 }]}>
                Upgrade to Elite to unlock AI Coach voice packs for your Morning and Evening Flows.
              </Text>
            </View>
            {VOICES.map((v) => (
              <View key={v.name} style={styles.voiceCard}>
                <Text style={styles.voiceIcon}>{v.preview}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={Typography.heading3}>{v.name}</Text>
                  <Text style={[Typography.bodyMuted, { marginTop: 4, fontSize: 13 }]}>{v.tagline}</Text>
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
            <View style={styles.xpBalanceRow}>
              <Text style={Typography.bodyMuted}>XP Balance</Text>
              <Text style={[Typography.heading2, { color: Colors.gold }]}>1,420 XP</Text>
            </View>
            {BOOSTS.map((b) => (
              <View key={b.name} style={styles.boostCard}>
                <Text style={styles.boostIcon}>{b.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={Typography.heading3}>{b.name}</Text>
                  <Text style={[Typography.bodyMuted, { marginTop: 4, fontSize: 13 }]}>{b.description}</Text>
                </View>
                <TouchableOpacity style={styles.xpBtn} activeOpacity={0.8}>
                  <Text style={styles.xpBtnText}>{b.cost}</Text>
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
  root: { flex: 1, backgroundColor: Colors.charcoal },
  content: { padding: 24, paddingTop: 64, paddingBottom: 40 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.slate,
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: Colors.molten },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.muted },
  tabTextActive: { color: Colors.white },

  // Tiers
  tierCard: {
    backgroundColor: Colors.slate,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1.5,
  },
  tierHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  badge: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  upgradeBtn: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  upgradeBtnText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
  divider: { height: 1, backgroundColor: Colors.faint, marginBottom: 16 },
  featureRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 8 },
  checkmark: { fontSize: 14, fontWeight: '800', marginTop: 2 },

  // Voices
  lockedNote: {
    backgroundColor: Colors.slate,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  voiceCard: {
    backgroundColor: Colors.slate,
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  voiceIcon: { fontSize: 32 },

  // Boosts
  xpBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: Colors.slate,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  boostCard: {
    backgroundColor: Colors.slate,
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  boostIcon: { fontSize: 28 },
  xpBtn: {
    backgroundColor: `${Colors.gold}20`,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  xpBtnText: { color: Colors.gold, fontSize: 12, fontWeight: '700' },
});
