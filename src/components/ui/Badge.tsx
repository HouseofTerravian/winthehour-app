import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme';

// Flexible outline badge — tier labels, result tags, partner marks
type Props = {
  label: string;
  color?: string;
  style?: object;
};

export function Badge({ label, color, style }: Props) {
  const c = color ?? Colors.molten;
  return (
    <View style={[styles.badge, { borderColor: c }, style]}>
      <Text style={[styles.label, { color: c }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
