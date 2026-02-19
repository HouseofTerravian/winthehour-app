import React, { useState } from 'react';
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

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6);

type CheckInStatus = 'won' | 'lost' | 'pending';

const mockData: Record<number, CheckInStatus> = {
  6: 'won', 7: 'won', 8: 'won', 9: 'lost', 10: 'won', 11: 'won', 12: 'pending',
};

function formatHour(h: number) {
  const suffix = h < 12 ? 'AM' : 'PM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

export default function CheckInsScreen() {
  const [data, setData] = useState<Record<number, CheckInStatus>>(mockData);
  const currentHour = new Date().getHours();

  const won = Object.values(data).filter((v) => v === 'won').length;
  const total = Object.values(data).filter((v) => v !== 'pending').length;
  const winRate = total > 0 ? Math.round((won / total) * 100) : 0;

  function toggleCheckIn(hour: number) {
    setData((prev) => {
      const current = prev[hour];
      if (!current || current === 'pending') return { ...prev, [hour]: 'won' };
      if (current === 'won') return { ...prev, [hour]: 'lost' };
      return { ...prev, [hour]: 'pending' };
    });
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Check-Ins</Text>
        <Text style={styles.subtitle}>Log each hour. Win the day.</Text>

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <LinearGradient colors={['rgba(255,94,26,0.18)', 'rgba(255,94,26,0.04)']} style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: Colors.molten }]}>{won}</Text>
            <Text style={styles.summaryLabel}>HOURS WON</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)']} style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{total}</Text>
            <Text style={styles.summaryLabel}>LOGGED</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(255,179,0,0.18)', 'rgba(255,179,0,0.04)']} style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: Colors.gold }]}>{winRate}%</Text>
            <Text style={styles.summaryLabel}>WIN RATE</Text>
          </LinearGradient>
        </View>

        {/* HH:55 Banner */}
        <View style={styles.resetNote}>
          <Text style={styles.resetNoteLabel}>HH:55 RESET RITUAL</Text>
          <Text style={styles.resetNoteBody}>
            At :55 of every hour — pause, assess, log. Then go again.
          </Text>
        </View>

        {/* Hours List */}
        <Text style={styles.sectionLabel}>Today's Hours</Text>
        {HOURS.map((hour) => {
          const status: CheckInStatus = data[hour] ?? 'pending';
          const isCurrent = hour === currentHour;
          const isFuture = hour > currentHour;
          const isWon = status === 'won';
          const isLost = status === 'lost';

          return (
            <TouchableOpacity
              key={hour}
              onPress={() => !isFuture && toggleCheckIn(hour)}
              activeOpacity={isFuture ? 1 : 0.75}
              style={styles.hourRowWrap}
            >
              <LinearGradient
                colors={
                  isWon
                    ? ['rgba(255,94,26,0.12)', 'rgba(255,94,26,0.04)']
                    : isLost
                    ? ['rgba(60,79,101,0.2)', 'rgba(60,79,101,0.08)']
                    : ['rgba(31,32,37,1)', 'rgba(31,32,37,1)']
                }
                style={[
                  styles.hourRow,
                  isCurrent && styles.hourRowCurrent,
                  isFuture && styles.hourRowFuture,
                  isWon && { borderColor: 'rgba(255,94,26,0.4)' },
                ]}
              >
                <View style={styles.hourLeft}>
                  <Text style={[styles.hourLabel, isFuture && { color: Colors.steel }]}>
                    {formatHour(hour)}
                  </Text>
                  {isCurrent && (
                    <View style={styles.nowBadge}>
                      <Text style={styles.nowText}>NOW</Text>
                    </View>
                  )}
                </View>

                {isFuture ? (
                  <Text style={styles.futureDash}>—</Text>
                ) : isWon ? (
                  <Image
                    source={require('../../assets/checkmark-neon.png')}
                    style={styles.checkmarkImg}
                    resizeMode="contain"
                  />
                ) : isLost ? (
                  <View style={styles.lostBadge}>
                    <Text style={styles.lostText}>LOST</Text>
                  </View>
                ) : (
                  <View style={styles.logBadge}>
                    <Text style={styles.logText}>LOG</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.charcoal },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 36, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 },

  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.4)',
  },
  summaryValue: { fontSize: 26, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  summaryLabel: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: 0.8 },

  resetNote: {
    backgroundColor: Colors.slate,
    borderRadius: 16,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,179,0,0.3)',
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
  },
  resetNoteLabel: { fontSize: 10, fontWeight: '700', color: Colors.gold, letterSpacing: 1, marginBottom: 6 },
  resetNoteBody: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 20 },

  sectionLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },

  hourRowWrap: { marginBottom: 8 },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.35)',
  },
  hourRowCurrent: { borderColor: Colors.molten },
  hourRowFuture: { opacity: 0.35 },
  hourLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  hourLabel: { fontSize: 16, fontWeight: '700', color: Colors.white },
  nowBadge: { backgroundColor: Colors.molten, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  nowText: { fontSize: 9, fontWeight: '800', color: Colors.white, letterSpacing: 0.8 },
  futureDash: { color: Colors.steel, fontSize: 18 },

  checkmarkImg: { width: 36, height: 36 },

  lostBadge: {
    borderWidth: 1.5,
    borderColor: Colors.steel,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  lostText: { fontSize: 11, fontWeight: '700', color: Colors.steel, letterSpacing: 0.8 },

  logBadge: {
    borderWidth: 1.5,
    borderColor: Colors.molten,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  logText: { fontSize: 11, fontWeight: '700', color: Colors.molten, letterSpacing: 0.8 },
});
