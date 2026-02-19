import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography } from '../theme';

type MissionType = 'daily' | 'weekly' | 'seasonal';
type Mission = {
  id: string;
  title: string;
  description: string;
  xp: number;
  type: MissionType;
  completed: boolean;
};

const MISSIONS: Mission[] = [
  // Daily
  { id: 'd1', title: 'Complete Morning Flow', description: 'Start your day with intention before 9 AM.', xp: 100, type: 'daily', completed: false },
  { id: 'd2', title: 'Log 5 Check-Ins', description: 'Track at least 5 hours throughout the day.', xp: 75, type: 'daily', completed: false },
  { id: 'd3', title: 'Complete Evening Flow', description: 'Reflect and close your loop before midnight.', xp: 100, type: 'daily', completed: false },
  { id: 'd4', title: 'Win 4+ Hours', description: 'Mark 4 or more hours as Won today.', xp: 150, type: 'daily', completed: false },
  // Weekly
  { id: 'w1', title: '7-Day Streak', description: 'Complete Morning Flow 7 days in a row.', xp: 500, type: 'weekly', completed: false },
  { id: 'w2', title: 'Log 30 Check-Ins', description: 'Accumulate 30 hourly check-ins this week.', xp: 350, type: 'weekly', completed: false },
  { id: 'w3', title: 'Perfect Morning', description: 'Start before 8 AM three times this week.', xp: 300, type: 'weekly', completed: false },
  // Seasonal
  { id: 's1', title: 'The Sovereign Path', description: 'Maintain a 30-day streak without a miss.', xp: 2000, type: 'seasonal', completed: false },
  { id: 's2', title: 'Discipline Leaves Receipts', description: 'Log 500 total check-ins this season.', xp: 1500, type: 'seasonal', completed: false },
];

const TABS: MissionType[] = ['daily', 'weekly', 'seasonal'];
const TAB_LABELS: Record<MissionType, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  seasonal: 'Seasonal',
};

export default function MissionsScreen() {
  const [activeTab, setActiveTab] = useState<MissionType>('daily');
  const [missions, setMissions] = useState(MISSIONS);

  const filtered = missions.filter((m) => m.type === activeTab);
  const completed = filtered.filter((m) => m.completed).length;

  function toggleMission(id: string) {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[Typography.display, { marginBottom: 6 }]}>Missions</Text>
        <Text style={[Typography.bodyMuted, { marginBottom: 28 }]}>
          Discipline leaves receipts.
        </Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {TAB_LABELS[tab]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={Typography.bodyMuted}>
            {completed}/{filtered.length} complete
          </Text>
          <Text style={[Typography.body, { color: Colors.gold, fontWeight: '700' }]}>
            {filtered.filter((m) => m.completed).reduce((sum, m) => sum + m.xp, 0)} XP earned
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: filtered.length > 0
                  ? `${(completed / filtered.length) * 100}%`
                  : '0%',
              },
            ]}
          />
        </View>

        {/* Mission List */}
        <View style={{ marginTop: 24 }}>
          {filtered.map((mission) => (
            <TouchableOpacity
              key={mission.id}
              style={[styles.missionCard, mission.completed && styles.missionCardDone]}
              onPress={() => toggleMission(mission.id)}
              activeOpacity={0.8}
            >
              <View style={styles.missionLeft}>
                <View
                  style={[
                    styles.checkbox,
                    mission.completed && styles.checkboxDone,
                  ]}
                >
                  {mission.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      Typography.heading3,
                      mission.completed && { color: Colors.steel },
                    ]}
                  >
                    {mission.title}
                  </Text>
                  <Text style={[Typography.bodyMuted, { marginTop: 4, fontSize: 13 }]}>
                    {mission.description}
                  </Text>
                </View>
              </View>
              <View style={styles.xpBadge}>
                <Text style={styles.xpText}>+{mission.xp}</Text>
                <Text style={[Typography.label, { color: Colors.gold }]}>XP</Text>
              </View>
            </TouchableOpacity>
          ))}
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
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: { backgroundColor: Colors.molten },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.muted },
  tabTextActive: { color: Colors.white },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.slate,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.molten,
    borderRadius: 4,
  },
  missionCard: {
    backgroundColor: Colors.slate,
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  missionCardDone: { opacity: 0.55 },
  missionLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, flex: 1 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.steel,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxDone: { backgroundColor: Colors.molten, borderColor: Colors.molten },
  checkmark: { color: Colors.white, fontSize: 13, fontWeight: '800' },
  xpBadge: { alignItems: 'center', minWidth: 44 },
  xpText: { fontSize: 18, fontWeight: '800', color: Colors.gold },
});
