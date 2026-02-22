import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';

import CheckInsScreen  from '../screens/CheckInsScreen';
import TodayScreen     from '../screens/TodayScreen';
import TomorrowScreen  from '../screens/TomorrowScreen';
import NexusScreen     from './HomeTabs';

const Tab = createBottomTabNavigator();

// ── Alias resolution ──────────────────────────────────────────────────────────
function resolveNexusLabel(alias: string, tier: string): string {
  const isFree = !tier || tier === 'Freshman';
  if (isFree || !alias.trim()) return 'NEXUS';
  const upper = alias.trim().toUpperCase();
  return upper.length > 10 ? upper.slice(0, 9) + '…' : upper;
}

// ── Custom tab item ───────────────────────────────────────────────────────────
function TabItem({
  icon,
  label,
  subIndicator,
  focused,
}: {
  icon: string;
  label: string;
  subIndicator?: string;
  focused: boolean;
}) {
  const active = focused ? Colors.molten : 'rgba(255,255,255,0.3)';
  return (
    <View style={ti.wrap}>
      <Text style={[ti.icon, { opacity: focused ? 1 : 0.3 }]}>{icon}</Text>
      <Text style={[ti.label, { color: active }]}>{label}</Text>
      {subIndicator ? (
        <Text style={ti.sub}>{subIndicator}</Text>
      ) : null}
    </View>
  );
}

// ── Navigator ─────────────────────────────────────────────────────────────────
export default function TabNavigator() {
  const { profile } = useAuth();
  const [alias, setAlias] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('@wth_display_alias').then((val) => {
      if (val) setAlias(val);
    });
  }, []);

  const nexusLabel = resolveNexusLabel(alias, profile?.tier ?? '');

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.molten,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
      }}
    >
      <Tab.Screen
        name="WTH!"
        component={CheckInsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem icon="⏱" label="WTH!" subIndicator="60M" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="TODAY"
        component={TodayScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem icon="☀️" label="TODAY" subIndicator="24H" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="TOMORROW"
        component={TomorrowScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem icon="→" label="TOMORROW" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="NEXUS"
        component={NexusScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem icon="◎" label={nexusLabel} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.slate,
    borderTopWidth: 1,
    borderTopColor: 'rgba(60,79,101,0.5)',
    height: 76,
    paddingBottom: 14,
    paddingTop: 8,
  },
});

const ti = StyleSheet.create({
  wrap:  { alignItems: 'center', justifyContent: 'center', gap: 2 },
  icon:  { fontSize: 15 },
  label: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginTop: 1 },
  sub:   { fontSize: 7, fontWeight: '700', letterSpacing: 1.5, color: 'rgba(255,255,255,0.22)', marginTop: 1 },
});
