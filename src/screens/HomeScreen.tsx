import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';

const STREAK = 7;
const XP = 1420;
const TIER = 'Freshman';

export default function HomeScreen() {
  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? 'Late night.' : hour < 12 ? 'Good morning.' : hour < 17 ? 'Good afternoon.' : 'Good evening.';

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
          <View style={styles.headerLeft}>
            <Text style={styles.greetingText}>{greeting}</Text>
            <Image
              source={require('../../assets/logo-wth.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>{TIER.toUpperCase()}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <LinearGradient
            colors={['rgba(255,94,26,0.15)', 'rgba(255,94,26,0.05)']}
            style={styles.statCard}
          >
            <Text style={[styles.statValue, { color: Colors.molten }]}>{STREAK}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(255,179,0,0.15)', 'rgba(255,179,0,0.05)']}
            style={styles.statCard}
          >
            <Text style={[styles.statValue, { color: Colors.gold }]}>{XP.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
            style={styles.statCard}
          >
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Hrs Won</Text>
          </LinearGradient>
        </View>

        {/* Today Section */}
        <Text style={styles.sectionLabel}>Today's Rituals</Text>

        {/* Morning Flow Card */}
        <TouchableOpacity activeOpacity={0.88} style={styles.ritualCardWrap}>
          <LinearGradient
            colors={['rgba(255,94,26,0.18)', 'rgba(255,94,26,0.04)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ritualCard, { borderColor: Colors.molten }]}
          >
            <View style={styles.ritualCardTop}>
              <View>
                <Text style={[styles.ritualEyebrow, { color: Colors.molten }]}>MORNING RITUAL</Text>
                <Text style={styles.ritualTitle}>Morning Flow</Text>
                <Text style={styles.ritualSub}>Set your North Star. Lock in your mission.</Text>
              </View>
              <LinearGradient
                colors={[Colors.molten, '#FF8C4A']}
                style={styles.startBtn}
              >
                <Text style={styles.startBtnText}>START</Text>
              </LinearGradient>
            </View>
            <View style={styles.ritualMeta}>
              <Text style={styles.ritualMetaText}>4 steps · +100 XP · ~5 min</Text>
              <Text style={styles.ritualMetaDot}>AVAILABLE NOW</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Evening Flow Card */}
        <TouchableOpacity activeOpacity={0.88} style={[styles.ritualCardWrap, { marginBottom: 28 }]}>
          <View style={[styles.ritualCard, { borderColor: 'rgba(60,79,101,0.6)' }]}>
            <View style={styles.ritualCardTop}>
              <View>
                <Text style={[styles.ritualEyebrow, { color: Colors.steel }]}>EVENING RITUAL</Text>
                <Text style={[styles.ritualTitle, { color: 'rgba(255,255,255,0.6)' }]}>Evening Flow</Text>
                <Text style={styles.ritualSub}>Reflect. Archive wins. Close your loop.</Text>
              </View>
              <View style={styles.laterBtn}>
                <Text style={styles.laterBtnText}>LATER</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* HH:55 Banner */}
        <LinearGradient
          colors={['rgba(255,179,0,0.12)', 'rgba(255,179,0,0.04)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.resetBanner}
        >
          <View>
            <Text style={styles.resetLabel}>HH:55 RESET RITUAL</Text>
            <Text style={styles.resetCaption}>Pause · Assess · Log · Go again</Text>
          </View>
          <View style={styles.resetClockWrap}>
            <Text style={styles.resetClock}>:55</Text>
          </View>
        </LinearGradient>

        {/* Active Missions */}
        <View style={styles.missionsCard}>
          <View style={styles.missionsHeader}>
            <Text style={styles.sectionLabel2}>Active Missions</Text>
            <Text style={styles.missionsCount}>0 / 4</Text>
          </View>
          {[
            'Complete Morning Flow',
            'Log 3 check-ins',
            'Finish top priority task',
          ].map((m, i) => (
            <View key={i} style={styles.missionRow}>
              <View style={styles.missionCheck} />
              <Text style={styles.missionText}>{m}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.charcoal },
  scroll: { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  headerLeft: { flex: 1 },
  greetingText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  logo: {
    width: 200,
    height: 52,
    marginLeft: -4,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.steel,
    backgroundColor: 'rgba(60,79,101,0.2)',
    marginTop: 8,
  },
  tierText: { color: Colors.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.4)',
    alignItems: 'center',
  },
  statValue: { fontSize: 28, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  statLabel: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5, textAlign: 'center' },

  sectionLabel: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' },

  ritualCardWrap: { marginBottom: 12 },
  ritualCard: {
    borderRadius: 20,
    padding: 22,
    borderWidth: 1.5,
    backgroundColor: Colors.slate,
  },
  ritualCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  ritualEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 6 },
  ritualTitle: { fontSize: 22, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  ritualSub: { fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 18 },
  startBtn: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  startBtnText: { color: Colors.white, fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  laterBtn: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.5)',
  },
  laterBtnText: { color: Colors.steel, fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
  ritualMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,94,26,0.15)' },
  ritualMetaText: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  ritualMetaDot: { fontSize: 10, fontWeight: '700', color: Colors.molten, letterSpacing: 0.5 },

  resetBanner: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,179,0,0.25)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetLabel: { fontSize: 11, fontWeight: '700', color: Colors.gold, letterSpacing: 1, marginBottom: 4 },
  resetCaption: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  resetClockWrap: { borderWidth: 2, borderColor: 'rgba(255,179,0,0.4)', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8 },
  resetClock: { fontSize: 30, fontWeight: '800', color: Colors.gold, letterSpacing: 2 },

  missionsCard: {
    backgroundColor: Colors.slate,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.4)',
  },
  missionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionLabel2: { fontSize: 15, fontWeight: '700', color: Colors.white },
  missionsCount: { fontSize: 12, fontWeight: '600', color: Colors.muted },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  missionCheck: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(60,79,101,0.8)',
  },
  missionText: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
});
