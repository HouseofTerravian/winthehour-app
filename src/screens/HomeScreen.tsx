import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Colors, Typography } from '../theme';

const STREAK = 7;
const XP = 1420;
const TIER = 'Starter';

export default function HomeScreen() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.charcoal} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[Typography.label, { marginBottom: 4 }]}>{greeting}</Text>
            <Text style={Typography.display}>Win The Hour!™</Text>
          </View>
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>{TIER}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{STREAK}</Text>
            <Text style={[Typography.label, { marginTop: 4 }]}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.gold }]}>{XP.toLocaleString()}</Text>
            <Text style={[Typography.label, { marginTop: 4 }]}>Total XP</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.molten }]}>3</Text>
            <Text style={[Typography.label, { marginTop: 4 }]}>Hours Won</Text>
          </View>
        </View>

        {/* Daily Ritual Cards */}
        <Text style={[Typography.heading3, styles.sectionLabel]}>Today's Rituals</Text>

        <TouchableOpacity style={[styles.ritualCard, styles.morningCard]} activeOpacity={0.85}>
          <View>
            <Text style={[Typography.label, { color: Colors.molten, marginBottom: 6 }]}>Morning</Text>
            <Text style={Typography.heading2}>Morning Flow</Text>
            <Text style={[Typography.bodyMuted, { marginTop: 6 }]}>
              Set your North Star. Lock in your mission.
            </Text>
          </View>
          <View style={styles.ritualStatus}>
            <Text style={styles.ritualStatusText}>START</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.ritualCard, styles.eveningCard]} activeOpacity={0.85}>
          <View>
            <Text style={[Typography.label, { color: Colors.steel, marginBottom: 6 }]}>Evening</Text>
            <Text style={Typography.heading2}>Evening Flow</Text>
            <Text style={[Typography.bodyMuted, { marginTop: 6 }]}>
              Reflect. Archive wins. Close your loop.
            </Text>
          </View>
          <View style={[styles.ritualStatus, { borderColor: Colors.steel }]}>
            <Text style={[styles.ritualStatusText, { color: Colors.steel }]}>LATER</Text>
          </View>
        </TouchableOpacity>

        {/* HH:55 Banner */}
        <View style={styles.resetBanner}>
          <View>
            <Text style={[Typography.label, { color: Colors.gold, marginBottom: 4 }]}>HH:55 Reset</Text>
            <Text style={[Typography.body, { fontWeight: '700' }]}>Next reset in 23 min</Text>
          </View>
          <Text style={styles.resetClock}>:55</Text>
        </View>

        {/* Missions Preview */}
        <View style={styles.missionPreview}>
          <Text style={[Typography.heading3, { marginBottom: 12 }]}>Active Missions</Text>
          {['Complete Morning Flow', 'Log 3 check-ins', 'Finish top priority task'].map((m, i) => (
            <View key={i} style={styles.missionRow}>
              <View style={styles.missionDot} />
              <Text style={Typography.body}>{m}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.charcoal,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.steel,
    backgroundColor: Colors.slate,
  },
  tierText: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 36,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.slate,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
  },
  sectionLabel: {
    marginBottom: 16,
  },
  ritualCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  morningCard: {
    backgroundColor: Colors.slate,
    borderColor: Colors.molten,
  },
  eveningCard: {
    backgroundColor: Colors.slate,
    borderColor: Colors.border,
  },
  ritualStatus: {
    borderWidth: 1.5,
    borderColor: Colors.molten,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  ritualStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.molten,
    letterSpacing: 1,
  },
  resetBanner: {
    backgroundColor: Colors.slate,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.gold,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetClock: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 2,
  },
  missionPreview: {
    backgroundColor: Colors.slate,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.faint,
  },
  missionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.molten,
  },
});
