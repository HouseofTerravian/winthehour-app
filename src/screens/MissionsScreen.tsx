import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';
import { useTheme } from '../context/ThemeContext';

type MissionType = 'daily' | 'weekly' | 'seasonal';
type Mission = { id: string; title: string; description: string; xp: number; type: MissionType; completed: boolean };

const MISSIONS: Mission[] = [
  { id: 'd1', title: 'Complete Morning Flow',   description: 'Start your day with intention before 9 AM.',              xp: 100,  type: 'daily',    completed: false },
  { id: 'd2', title: 'Log 5 Check-Ins',         description: 'Track at least 5 hours throughout the day.',              xp: 75,   type: 'daily',    completed: false },
  { id: 'd3', title: 'Complete Evening Flow',   description: 'Reflect and close your loop before midnight.',            xp: 100,  type: 'daily',    completed: false },
  { id: 'd4', title: 'Win 4+ Hours',            description: 'Mark 4 or more hours as Won today.',                     xp: 150,  type: 'daily',    completed: false },
  { id: 'w1', title: '7-Day Streak',            description: 'Complete Morning Flow 7 days in a row.',                  xp: 500,  type: 'weekly',   completed: false },
  { id: 'w2', title: 'Log 30 Check-Ins',        description: 'Accumulate 30 hourly check-ins this week.',              xp: 350,  type: 'weekly',   completed: false },
  { id: 'w3', title: 'Perfect Morning',         description: 'Start before 8 AM three times this week.',               xp: 300,  type: 'weekly',   completed: false },
  { id: 's1', title: 'The Sovereign Path',      description: 'Maintain a 30-day streak without a miss.',               xp: 2000, type: 'seasonal', completed: false },
  { id: 's2', title: 'Discipline Leaves Receipts', description: 'Log 500 total check-ins this season.',               xp: 1500, type: 'seasonal', completed: false },
];

const TABS: MissionType[] = ['daily', 'weekly', 'seasonal'];
const TAB_LABELS = { daily: 'Daily', weekly: 'Weekly', seasonal: 'Seasonal' };

export default function MissionsScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<MissionType>('daily');
  const [missions,  setMissions]  = useState(MISSIONS);

  const filtered    = missions.filter((m) => m.type === activeTab);
  const completed   = filtered.filter((m) => m.completed).length;
  const earnedXP    = filtered.filter((m) => m.completed).reduce((s, m) => s + m.xp, 0);
  const progressPct = filtered.length > 0 ? (completed / filtered.length) * 100 : 0;

  function toggleMission(id: string) {
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)));
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.charcoal }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text1 }]}>Missions</Text>
        <Text style={[styles.subtitle, { color: colors.text3 }]}>Discipline leaves receipts.</Text>

        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: colors.slate, borderColor: colors.cardBorder }]}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabText, { color: colors.text4 }, activeTab === tab && styles.tabTextActive]}>
                {TAB_LABELS[tab]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressMeta}>
            <Text style={[styles.progressMetaText, { color: colors.text3 }]}>{completed}/{filtered.length} complete</Text>
            <Text style={[styles.progressMetaText, { color: Colors.gold }]}>+{earnedXP} XP</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.faint }]}>
            <LinearGradient
              colors={[Colors.molten, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progressPct}%` }]}
            />
          </View>
        </View>

        {/* Mission Cards */}
        {filtered.map((mission) => (
          <TouchableOpacity
            key={mission.id}
            style={styles.missionCardWrap}
            onPress={() => toggleMission(mission.id)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.missionCard,
              { backgroundColor: colors.slate, borderColor: colors.cardBorder },
              mission.completed && styles.missionCardDone,
            ]}>
              <View style={styles.missionLeft}>
                <View style={[styles.checkbox, { borderColor: colors.cardBorder }, mission.completed && styles.checkboxDone]}>
                  {mission.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.missionText}>
                  <Text style={[styles.missionTitle, { color: colors.text1 }, mission.completed && { color: colors.steel }]}>
                    {mission.title}
                  </Text>
                  <Text style={[styles.missionDesc, { color: colors.text4 }]}>{mission.description}</Text>
                </View>
              </View>
              <View style={[styles.xpBadge, { borderColor: mission.completed ? colors.cardBorder : 'rgba(255,179,0,0.4)' }]}>
                <Text style={[styles.xpValue, { color: mission.completed ? colors.text4 : Colors.gold }]}>
                  +{mission.xp}
                </Text>
                <Text style={[styles.xpLabel, { color: mission.completed ? colors.text4 : 'rgba(255,179,0,0.6)' }]}>XP</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title:   { fontSize: 36, fontWeight: '800', marginBottom: 4 },
  subtitle:{ fontSize: 14, marginBottom: 28 },

  tabs: { flexDirection: 'row', borderRadius: 16, padding: 4, marginBottom: 20, borderWidth: 1 },
  tab:         { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 12 },
  tabActive:   { backgroundColor: Colors.molten },
  tabText:     { fontSize: 13, fontWeight: '600' },
  tabTextActive:{ color: '#FFFFFF', fontWeight: '700' },

  progressSection: { marginBottom: 24 },
  progressMeta:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressMetaText:{ fontSize: 13, fontWeight: '600' },
  progressTrack:   { height: 4, borderRadius: 4, overflow: 'hidden' },
  progressFill:    { height: '100%', borderRadius: 4 },

  missionCardWrap: { marginBottom: 10 },
  missionCard: { borderRadius: 18, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderWidth: 1 },
  missionCardDone: { opacity: 0.5 },
  missionLeft:  { flexDirection: 'row', alignItems: 'flex-start', gap: 14, flex: 1 },
  checkbox:     { width: 24, height: 24, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 },
  checkboxDone: { backgroundColor: Colors.molten, borderColor: Colors.molten },
  checkmark:    { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  missionText:  { flex: 1 },
  missionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  missionDesc:  { fontSize: 12, lineHeight: 17 },
  xpBadge:      { alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, minWidth: 52 },
  xpValue:      { fontSize: 16, fontWeight: '800' },
  xpLabel:      { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
});
