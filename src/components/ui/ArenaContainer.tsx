import React from 'react';
import { View, StyleSheet } from 'react-native';

// Slightly darker than charcoal (#0B0C10) — pulls focus inward
const ARENA_BG = '#060708';

type Props = {
  children: React.ReactNode;
  style?: object;
};

export function ArenaContainer({ children, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ARENA_BG,
  },
});
