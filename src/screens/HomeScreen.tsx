import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { profile } = useAuth();
  const { colors }  = useTheme();

  const streak = profile?.streak ?? 0;
  const xp     = profile?.xp ?? 0;
  const tier   = profile?.tier ?? 'Freshman';

  const hour    = new Date().getHours();
  const timeGreeting =
    hour < 5 ? 'Late night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = profile?.display_name?.split(' ')[0];
  const greeting  = firstName ? `${timeGreeting}, ${firstName}.` : `${timeGreeting}.`;

  return (
    <View style={[styles.root, { backgroundColor: colors.charcoal }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greetingText, { color: colors.text3 }]}>{greeting}</Text>
            <Image
              source={require('../../assets/logo-wth.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.timeLayerLabel}>LIFETIME</Text>
          </View>
          <View style={[styles.tierBadge, { borderColor: colors.steel, backgroundColor: colors.faint }]}>
            <Text style={[styles.tierText, { color: colors.muted }]}>{tier.toUpperCase()}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <LinearGradient
            colors={['rgba(255,94,26,0.10)', 'rgba(255,94,26,0.03)']}
            style={styles.statCard}
          >
            <Text style={[styles.statValue, { color: Colors.molten }]}>{streak}</Text>
            <Text style={[styles.statLabel, { color: colors.text3 }]}>Day Streak</Text>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(255,179,0,0.10)', 'rgba(255,179,0,0.03)']}
            style={styles.statCard}
          >
            <Text style={[styles.statValue, { color: Colors.gold }]}>{xp.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.text3 }]}>Total XP</Text>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.015)']}
            style={styles.statCard}
          >
            <Text style={[styles.statValue, { color: colors.text1 }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.text3 }]}>Hrs Won</Text>
          </LinearGradient>
        </View>

        {/* Today Section */}
        <Text style={[styles.sectionLabel, { color: colors.text3 }]}>Today's Rituals</Text>

        {/* Morning Flow Card */}
        <TouchableOpacity activeOpacity={0.88} style={styles.ritualCardWrap}>
          <LinearGradient
            colors={['rgba(255,94,26,0.18)', 'rgba(255,94,26,0.04)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ritualCard, { borderColor: Colors.molten, backgroundColor: 'transparent' }]}
          >
            <View style={styles.ritualCardTop}>
              <View>
                <Text style={[styles.ritualEyebrow, { color: Colors.molten }]}>MORNING RITUAL</Text>
                <Text style={[styles.ritualTitle, { color: colors.text1 }]}>Morning Flow</Text>
                <Text style={[styles.ritualSub, { color: colors.text3 }]}>Set your North Star. Lock in your mission.</Text>
              </View>
              <LinearGradient
                colors={[Colors.molten, '#FF8C4A']}
                style={styles.startBtn}
              >
                <Text style={styles.startBtnText}>START</Text>
              </LinearGradient>
            </View>
            <View style={styles.ritualMeta}>
              <Text style={[styles.ritualMetaText, { color: colors.text4 }]}>4 steps · +100 XP · ~5 min</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Evening Flow Card */}
        <TouchableOpacity activeOpacity={0.88} style={[styles.ritualCardWrap, { marginBottom: 28 }]}>
          <View style={[styles.ritualCard, { backgroundColor: colors.slate, borderColor: colors.cardBorder }]}>
            <View style={styles.ritualCardTop}>
              <View>
                <Text style={[styles.ritualEyebrow, { color: colors.steel }]}>EVENING RITUAL</Text>
                <Text style={[styles.ritualTitle, { color: colors.text3 }]}>Evening Flow</Text>
                <Text style={[styles.ritualSub, { color: colors.text3 }]}>Reflect. Archive wins. Close your loop.</Text>
              </View>
              <View style={[styles.laterBtn, { borderColor: colors.cardBorder }]}>
                <Text style={[styles.laterBtnText, { color: colors.steel }]}>LATER</Text>
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
            <Text style={[styles.resetCaption, { color: colors.text3 }]}>Pause · Assess · Log · Go again</Text>
          </View>
          <View style={styles.resetClockWrap}>
            <Text style={styles.resetClock}>:55</Text>
          </View>
        </LinearGradient>

        {/* Active Missions */}
        <View style={[styles.missionsCard, { backgroundColor: colors.slate }]}>
          <View style={styles.missionsHeader}>
            <Text style={[styles.sectionLabel2, { color: colors.text1 }]}>Active Missions</Text>
            <Text style={[styles.missionsCount, { color: colors.text3 }]}>0 / 4</Text>
          </View>
          {[
            'Complete Morning Flow',
            'Log 3 check-ins',
            'Finish top priority task',
          ].map((m, i) => (
            <View key={i} style={[styles.missionRow, { borderBottomColor: colors.faint }]}>
              <View style={[styles.missionCheck, { borderColor: colors.cardBorder }]} />
              <Text style={[styles.missionText, { color: colors.text2 }]}>{m}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  scroll:  { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },

  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  headerLeft:  { flex: 1 },
  greetingText:{ fontSize: 13, fontWeight: '500', marginBottom: 4, letterSpacing: 0.3 },
  logo:        { width: 200, height: 52, marginLeft: -4 },
  tierBadge:   { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, marginTop: 8 },
  tierText:    { fontSize: 10, fontWeight: '700', letterSpacing: 1 },

  timeLayerLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 2, color: 'rgba(255,255,255,0.18)', marginTop: 3 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  statCard: { flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(60,79,101,0.28)', alignItems: 'center' },
  statValue:{ fontSize: 28, fontWeight: '800', marginBottom: 4 },
  statLabel:{ fontSize: 10, fontWeight: '600', letterSpacing: 0.5, textAlign: 'center' },

  sectionLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' },

  ritualCardWrap: { marginBottom: 12 },
  ritualCard:     { borderRadius: 20, padding: 22, borderWidth: 1.5 },
  ritualCardTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  ritualEyebrow:  { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 6 },
  ritualTitle:    { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  ritualSub:      { fontSize: 13, lineHeight: 18 },
  startBtn:       { borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, minWidth: 70, alignItems: 'center' },
  startBtnText:   { color: '#FFFFFF', fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  laterBtn:       { borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1 },
  laterBtnText:   { fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
  ritualMeta:     { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,94,26,0.15)' },
  ritualMetaText: { fontSize: 11 },

  resetBanner: { borderRadius: 18, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,179,0,0.25)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resetLabel:  { fontSize: 11, fontWeight: '700', color: Colors.gold, letterSpacing: 1, marginBottom: 4 },
  resetCaption:{ fontSize: 13 },
  resetClockWrap: { borderWidth: 2, borderColor: 'rgba(255,179,0,0.4)', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8 },
  resetClock:  { fontSize: 30, fontWeight: '800', color: Colors.gold, letterSpacing: 2 },

  missionsCard:   { borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(60,79,101,0.4)' },
  missionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionLabel2:  { fontSize: 15, fontWeight: '700' },
  missionsCount:  { fontSize: 12, fontWeight: '600' },
  missionRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1 },
  missionCheck:   { width: 20, height: 20, borderRadius: 6, borderWidth: 2 },
  missionText:    { fontSize: 14 },
});
