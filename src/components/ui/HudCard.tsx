import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Stat card for passive HUD info — 90% opacity, reduced border glow
type Props = {
  value: string;
  label: string;
  gradientColors: [string, string];
  valueColor: string;
  style?: object;
};

export function HudCard({ value, label, gradientColors, valueColor, style }: Props) {
  return (
    <LinearGradient colors={gradientColors} style={[styles.card, style]}>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.16)', // further reduced — HUD recedes behind arena
    opacity: 0.82,
  },
  value: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  label: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, color: 'rgba(255,255,255,0.35)' },
});
