import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type Range = 'week' | 'month' | 'all';

const WEEKLY_DATA = [
  { day: 'M', won: 0, total: 0 },
  { day: 'T', won: 0, total: 0 },
  { day: 'W', won: 0, total: 0 },
  { day: 'T', won: 0, total: 0 },
  { day: 'F', won: 0, total: 0 },
  { day: 'S', won: 0, total: 0 },
  { day: 'S', won: 0, total: 0 },
];

const BAR_TRACK_H = 110;

const TIER_NEXT: Record<string, { name: string; goal: number }> = {
  Freshman: { name: 'Varsity',  goal: 2000  },
  Varsity:  { name: 'Crucible', goal: 10000 },
};

export default function StatisticsScreen() {
  const { profile } = useAuth();
  const { colors, skinFonts } = useTheme();
  const [range, setRange] = useState<Range>('week');
  const r = (n: number) => Math.round(n * skinFonts.borderRadiusScale);

  const totalWon = WEEKLY_DATA.reduce((s, d) => s + d.won, 0);
  const totalLogged = WEEKLY_DATA.reduce((s, d) => s + d.total, 0);
  const winRate = totalLogged > 0 ? Math.round((totalWon / totalLogged) * 100) : 0;
  const maxWon = Math.max(...WEEKLY_DATA.map((d) => d.won), 1);

  const streak = profile?.streak ?? 0;
  const xp = profile?.xp ?? 0;
  const tierName = profile?.tier ?? 'Freshman';
  const nextTier = TIER_NEXT[tierName];
  const progressPct = nextTier ? Math.min(100, Math.round((xp / nextTier.goal) * 100)) : 100;
  const xpRemaining = nextTier ? Math.max(0, nextTier.goal - xp) : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.charcoal }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text1 }]}>Statistics</Text>
        <Text style={[styles.subtitle, { color: colors.text3 }]}>No opinions. Just data.</Text>

        {/* Range Tabs */}
        <View style={[styles.tabs, { backgroundColor: colors.slate, borderColor: colors.cardBorder }]}>
          {(['week', 'month', 'all'] as Range[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.tab, range === r && styles.tabActive]}
              onPress={() => setRange(r)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabText, range === r && styles.tabTextActive]}>
                {r === 'all' ? 'All Time' : r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Stats Grid */}
        <View style={styles.statsGrid}>
          <LinearGradient colors={['rgba(255,94,26,0.18)', 'rgba(255,94,26,0.05)']} style={[styles.statCard, styles.statCardWide]}>
            <Text style={[styles.statBig, { color: Colors.molten }]}>{totalWon}</Text>
            <Text style={styles.statMeta}>Hours Won</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(255,179,0,0.18)', 'rgba(255,179,0,0.05)']} style={[styles.statCard, styles.statCardWide]}>
            <Text style={[styles.statBig, { color: Colors.gold }]}>{winRate}%</Text>
            <Text style={styles.statMeta}>Win Rate</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)']} style={styles.statCard}>
            <Text style={[styles.statBig, { color: colors.text1 }]}>{streak}</Text>
            <Text style={[styles.statMeta, { color: colors.text3 }]}>Streak</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(255,179,0,0.1)', 'rgba(255,179,0,0.02)']} style={styles.statCard}>
            <Text style={[styles.statBig, { color: Colors.gold, fontSize: 26 }]}>{xp.toLocaleString()}</Text>
            <Text style={styles.statMeta}>Total XP</Text>
          </LinearGradient>
        </View>

        {/* Bar Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.slate }]}>
          <Text style={[styles.cardTitle, { color: colors.text1 }]}>Hours Won per Day</Text>
          <View style={styles.chart}>
            {WEEKLY_DATA.map((d, i) => {
              const fillH = maxWon > 0 ? Math.round((d.won / maxWon) * BAR_TRACK_H) : 0;
              const ratio = d.total > 0 ? d.won / d.total : 0;
              const barColor = ratio >= 0.75 ? Colors.molten : ratio >= 0.5 ? Colors.gold : Colors.steel;
              return (
                <View key={i} style={styles.chartCol}>
                  <Text style={[styles.barNum, { color: d.won > 0 ? Colors.white : 'transparent' }]}>
                    {d.won}
                  </Text>
                  <View style={styles.barTrack}>
                    {fillH > 0 && (
                      <LinearGradient
                        colors={[barColor, `${barColor}55`]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ width: '100%', height: fillH, borderRadius: 8 }}
                      />
                    )}
                  </View>
                  <Text style={[styles.barLabel, { color: colors.text4 }]}>{d.day}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.molten }]} />
              <Text style={[styles.legendText, { color: colors.text4 }]}>≥75%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.gold }]} />
              <Text style={[styles.legendText, { color: colors.text4 }]}>≥50%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.steel }]} />
              <Text style={[styles.legendText, { color: colors.text4 }]}>{'<'}50%</Text>
            </View>
          </View>
        </View>

        {/* Tier Progress */}
        <View style={[styles.tierCard, { backgroundColor: colors.slate }]}>
          <View style={styles.tierCardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text1 }]}>Tier Progress</Text>
            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>{tierName.toUpperCase()}</Text>
            </View>
          </View>
          {nextTier ? (
            <>
              <View style={styles.tierProgressInfo}>
                <Text style={styles.tierXP}>{xp.toLocaleString()} XP</Text>
                <Text style={[styles.tierXPGoal, { color: colors.text3 }]}>/ {nextTier.goal.toLocaleString()} to {nextTier.name}</Text>
              </View>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={[Colors.molten, Colors.gold]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progressPct}%` }]}
                />
              </View>
              <Text style={[styles.progressNote, { color: colors.text4 }]}>{xpRemaining.toLocaleString()} XP remaining</Text>
            </>
          ) : (
            <Text style={[styles.progressNote, { color: colors.text4 }]}>Max earned tier achieved</Text>
          )}
        </View>

        {/* Monthly Calendar */}
        <View style={[styles.streakCard, { backgroundColor: colors.slate }]}>
          <Text style={[styles.cardTitle, { marginBottom: 4, fontFamily: skinFonts.titleFontFamily, fontWeight: skinFonts.titleFontWeight }]}>
            This Month at a Glance
          </Text>
          <Text style={[styles.monthLabel, { color: colors.text3, fontFamily: skinFonts.fontFamily }]}>
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <View style={styles.streakGrid}>
            {(() => {
              const now = new Date();
              const todayDate = now.getDate();          // 1-indexed
              const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
              return Array.from({ length: daysInMonth }, (_, i) => {
                const dayNum = i + 1;                   // 1-indexed, left = day 1
                const isToday = dayNum === todayDate;
                const daysAgo = todayDate - dayNum;     // 0 = today, positive = past
                const active  = daysAgo >= 0 && daysAgo < streak;
                const isFuture = dayNum > todayDate;
                return (
                  <LinearGradient
                    key={i}
                    colors={
                      isToday
                        ? [Colors.molten, Colors.gold]
                        : active
                        ? [`${Colors.molten}50`, `${Colors.molten}20`]
                        : isFuture
                        ? ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.01)']
                        : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']
                    }
                    style={[styles.streakDot, isToday && styles.streakDotToday]}
                  />
                );
              });
            })()}
          </View>
          <Text style={[styles.streakCaption, { fontFamily: skinFonts.fontFamily, color: colors.text4 }]}>
            Day 1 on the left · Today highlighted in orange
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.charcoal },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 36, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 },

  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.slate,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.5)',
  },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: Colors.molten },
  tabText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.4)' },
  tabTextActive: { color: Colors.white, fontWeight: '700' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: {
    width: '47.5%',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.35)',
  },
  statCardWide: {},
  statBig: { fontSize: 32, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  statMeta: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 },

  chartCard: {
    backgroundColor: Colors.slate,
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.4)',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.white, marginBottom: 20 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 12 },
  chartCol: { flex: 1, alignItems: 'center', gap: 6 },
  barNum: { fontSize: 11, fontWeight: '700', color: Colors.white, height: 16 },
  barTrack: {
    width: '100%',
    height: BAR_TRACK_H,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.35)' },
  chartLegend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },

  tierCard: {
    backgroundColor: Colors.slate,
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.4)',
  },
  tierCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tierBadge: {
    borderWidth: 1,
    borderColor: Colors.molten,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tierBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.molten, letterSpacing: 0.8 },
  tierProgressInfo: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 10 },
  tierXP: { fontSize: 22, fontWeight: '800', color: Colors.gold },
  tierXPGoal: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6 },
  progressNote: { fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 8 },

  streakCard: {
    backgroundColor: Colors.slate,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.4)',
  },
  monthLabel: { fontSize: 12, marginBottom: 14 },
  streakGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  streakDot: { width: 30, height: 30, borderRadius: 8 },
  streakDotToday: { transform: [{ scale: 1.15 }] },
  streakCaption: { fontSize: 11, color: 'rgba(255,255,255,0.25)' },
});
