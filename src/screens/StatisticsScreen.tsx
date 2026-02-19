import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography } from '../theme';

type Range = 'week' | 'month' | 'all';

const WEEKLY_DATA = [
  { day: 'Mon', won: 5, total: 8 },
  { day: 'Tue', won: 7, total: 8 },
  { day: 'Wed', won: 3, total: 8 },
  { day: 'Thu', won: 6, total: 8 },
  { day: 'Fri', won: 8, total: 8 },
  { day: 'Sat', won: 4, total: 6 },
  { day: 'Sun', won: 0, total: 0 },
];

const BAR_HEIGHT = 120;

export default function StatisticsScreen() {
  const [range, setRange] = useState<Range>('week');

  const totalWon = WEEKLY_DATA.reduce((s, d) => s + d.won, 0);
  const totalLogged = WEEKLY_DATA.reduce((s, d) => s + d.total, 0);
  const winRate = totalLogged > 0 ? Math.round((totalWon / totalLogged) * 100) : 0;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[Typography.display, { marginBottom: 6 }]}>Statistics</Text>
        <Text style={[Typography.bodyMuted, { marginBottom: 28 }]}>
          No opinions. Just data.
        </Text>

        {/* Range Tabs */}
        <View style={styles.tabs}>
          {(['week', 'month', 'all'] as Range[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.tab, range === r && styles.tabActive]}
              onPress={() => setRange(r)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabText, range === r && styles.tabTextActive]}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { borderColor: Colors.molten }]}>
            <Text style={[styles.bigNum, { color: Colors.molten }]}>{totalWon}</Text>
            <Text style={Typography.label}>Hours Won</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: Colors.gold }]}>
            <Text style={[styles.bigNum, { color: Colors.gold }]}>{winRate}%</Text>
            <Text style={Typography.label}>Win Rate</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: Colors.steel }]}>
            <Text style={styles.bigNum}>7</Text>
            <Text style={Typography.label}>Streak</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: Colors.steel }]}>
            <Text style={[styles.bigNum, { color: Colors.gold }]}>1,420</Text>
            <Text style={Typography.label}>Total XP</Text>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={[Typography.heading3, { marginBottom: 20 }]}>Hours Won per Day</Text>
          <View style={styles.chart}>
            {WEEKLY_DATA.map((d, i) => {
              const fillRatio = d.total > 0 ? d.won / d.total : 0;
              const barH = Math.round(BAR_HEIGHT * fillRatio);
              return (
                <View key={i} style={styles.chartCol}>
                  <View style={[styles.barTrack, { height: BAR_HEIGHT }]}>
                    <View style={[styles.barFill, { height: barH, backgroundColor: fillRatio >= 0.75 ? Colors.molten : fillRatio >= 0.5 ? Colors.gold : Colors.steel }]} />
                  </View>
                  <Text style={[Typography.label, { marginTop: 8 }]}>{d.day}</Text>
                  <Text style={[styles.barNum, { color: fillRatio > 0 ? Colors.white : Colors.steel }]}>{d.won}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Tier Progress */}
        <View style={styles.tierCard}>
          <View style={styles.tierHeader}>
            <Text style={Typography.heading3}>Tier Progress</Text>
            <Text style={[Typography.label, { color: Colors.molten }]}>STARTER</Text>
          </View>
          <Text style={[Typography.bodyMuted, { marginBottom: 16 }]}>
            1,420 / 2,000 XP to Sovereign
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '71%' }]} />
          </View>
          <Text style={[Typography.label, { marginTop: 10, color: Colors.muted }]}>
            580 XP remaining
          </Text>
        </View>

        {/* Streak Calendar Preview */}
        <View style={styles.streakCard}>
          <Text style={[Typography.heading3, { marginBottom: 16 }]}>Streak</Text>
          <View style={styles.streakGrid}>
            {Array.from({ length: 28 }, (_, i) => {
              const won = i < 24 ? Math.random() > 0.2 : i < 27;
              const today = i === 27;
              return (
                <View
                  key={i}
                  style={[
                    styles.streakDot,
                    { backgroundColor: today ? Colors.molten : won ? `${Colors.molten}60` : Colors.slate },
                    today && { transform: [{ scale: 1.2 }] },
                  ]}
                />
              );
            })}
          </View>
          <Text style={[Typography.bodyMuted, { marginTop: 12, fontSize: 13 }]}>
            Last 28 days
          </Text>
        </View>
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    width: '47%',
    backgroundColor: Colors.slate,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  bigNum: { fontSize: 32, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  chartCard: {
    backgroundColor: Colors.slate,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  chartCol: { alignItems: 'center', flex: 1 },
  barTrack: {
    width: 28,
    backgroundColor: Colors.faint,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 8 },
  barNum: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  tierCard: {
    backgroundColor: Colors.slate,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: { height: 6, backgroundColor: Colors.faint, borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.molten, borderRadius: 6 },
  streakCard: {
    backgroundColor: Colors.slate,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  streakDot: { width: 28, height: 28, borderRadius: 8 },
});
