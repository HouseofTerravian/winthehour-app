import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography } from '../theme';

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM – 9 PM

type CheckInStatus = 'won' | 'lost' | 'pending';

const mockData: Record<number, CheckInStatus> = {
  6: 'won',
  7: 'won',
  8: 'won',
  9: 'lost',
  10: 'won',
  11: 'won',
  12: 'pending',
};

const statusColor: Record<CheckInStatus, string> = {
  won: Colors.molten,
  lost: Colors.steel,
  pending: Colors.gold,
};

const statusLabel: Record<CheckInStatus, string> = {
  won: 'WON',
  lost: 'LOST',
  pending: 'LOG',
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
        {/* Header */}
        <Text style={[Typography.display, { marginBottom: 6 }]}>Check-Ins</Text>
        <Text style={[Typography.bodyMuted, { marginBottom: 28 }]}>
          Log each hour. Win the day.
        </Text>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: Colors.molten }]}>{won}</Text>
            <Text style={Typography.label}>Hours Won</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{total}</Text>
            <Text style={Typography.label}>Logged</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: Colors.gold }]}>
              {total > 0 ? Math.round((won / total) * 100) : 0}%
            </Text>
            <Text style={Typography.label}>Win Rate</Text>
          </View>
        </View>

        {/* HH:55 Reset Info */}
        <View style={styles.resetNote}>
          <Text style={[Typography.label, { color: Colors.gold }]}>HH:55 RESET RITUAL</Text>
          <Text style={[Typography.body, { marginTop: 4 }]}>
            At :55 of every hour — pause, assess, log. Then go again.
          </Text>
        </View>

        {/* Hourly Grid */}
        <Text style={[Typography.heading3, { marginBottom: 16 }]}>Today's Hours</Text>
        {HOURS.map((hour) => {
          const status: CheckInStatus = data[hour] ?? 'pending';
          const isCurrent = hour === currentHour;
          const isFuture = hour > currentHour;

          return (
            <TouchableOpacity
              key={hour}
              style={[
                styles.hourRow,
                isCurrent && styles.hourRowCurrent,
                isFuture && styles.hourRowFuture,
              ]}
              onPress={() => !isFuture && toggleCheckIn(hour)}
              activeOpacity={isFuture ? 1 : 0.7}
            >
              <View style={styles.hourLeft}>
                <Text style={[Typography.heading3, isFuture && { color: Colors.steel }]}>
                  {formatHour(hour)}
                </Text>
                {isCurrent && (
                  <View style={styles.nowBadge}>
                    <Text style={styles.nowText}>NOW</Text>
                  </View>
                )}
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    borderColor: isFuture ? Colors.faint : statusColor[status],
                    backgroundColor: isFuture
                      ? 'transparent'
                      : `${statusColor[status]}20`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: isFuture ? Colors.steel : statusColor[status] },
                  ]}
                >
                  {isFuture ? '—' : statusLabel[status]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.charcoal },
  content: { padding: 24, paddingTop: 64, paddingBottom: 40 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.slate,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryValue: { fontSize: 28, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  resetNote: {
    backgroundColor: Colors.slate,
    borderRadius: 16,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.slate,
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hourRowCurrent: { borderColor: Colors.molten },
  hourRowFuture: { opacity: 0.45 },
  hourLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nowBadge: {
    backgroundColor: Colors.molten,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  nowText: { fontSize: 10, fontWeight: '800', color: Colors.white, letterSpacing: 0.8 },
  statusBadge: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  statusText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
});
