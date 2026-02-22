import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Consistent section labeling — replaces per-screen sectionLabel styles
type Props = {
  label: string;
  color?: string;
  style?: object;
};

export function SectionHeader({ label, color, style }: Props) {
  return (
    <Text style={[styles.label, color ? { color } : {}, style]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },
});
