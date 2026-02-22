import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Slightly darker than charcoal — pulls focus inward
const ARENA_BG = '#040405';
// Vignette fade color matches arena bg
const VIGNETTE_DARK = 'rgba(4,4,5,0.72)';

type Props = {
  children: React.ReactNode;
  style?: object;
};

export function ArenaContainer({ children, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {children}
      {/* Top vignette — soft edge darkening, pointer-events passthrough */}
      <View style={styles.vignetteTop} pointerEvents="none">
        <LinearGradient colors={[VIGNETTE_DARK, 'transparent']} style={{ flex: 1 }} />
      </View>
      {/* Bottom vignette */}
      <View style={styles.vignetteBottom} pointerEvents="none">
        <LinearGradient colors={['transparent', VIGNETTE_DARK]} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ARENA_BG },
  vignetteTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 72,
    zIndex: 10,
  },
  vignetteBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 72,
    zIndex: 10,
  },
});
