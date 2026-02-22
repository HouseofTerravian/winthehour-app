import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme';

// Commitment-grade button — primary (YES) or ghost (NO)
type Props = {
  label: string;
  onPress: () => void;
  variant: 'primary' | 'ghost';
  disabled?: boolean;
  style?: object;
};

export function EliteButton({ label, onPress, variant, disabled, style }: Props) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        style={[styles.wrap, style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.82}
      >
        <LinearGradient
          colors={[Colors.molten, '#FF8C4A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryBtn}
        >
          <Text style={styles.primaryLabel}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.wrap, styles.ghostBtn, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.82}
    >
      <Text style={styles.ghostLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  primaryBtn: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  ghostBtn: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.steel,
  },
  ghostLabel: {
    color: Colors.steel,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
