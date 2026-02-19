import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  display: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  heading1: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  heading2: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.white,
    lineHeight: 22,
  },
  bodyMuted: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.muted,
    lineHeight: 22,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  accent: {
    color: Colors.molten,
  },
  gold: {
    color: Colors.gold,
  },
});
