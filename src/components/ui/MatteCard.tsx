import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Reduced-glow row card for planner views (TODAY)
type Props = {
  children: React.ReactNode;
  gradientColors?: [string, string];
  borderColor?: string;
  borderWidth?: number;
  style?: object;
};

export function MatteCard({
  children,
  gradientColors,
  borderColor,
  borderWidth,
  style,
}: Props) {
  return (
    <LinearGradient
      colors={gradientColors ?? ['rgba(255,255,255,0.025)', 'rgba(255,255,255,0.01)']}
      style={[
        styles.card,
        {
          borderColor: borderColor ?? 'rgba(60,79,101,0.3)',
          borderWidth: borderWidth ?? 1,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
});
