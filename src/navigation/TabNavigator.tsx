import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import CheckInsScreen from '../screens/CheckInsScreen';
import MissionsScreen from '../screens/MissionsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import FlowsScreen from '../screens/FlowsScreen';
import StoreScreen from '../screens/StoreScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// SVG-style unicode icons for each tab
const ICONS: Record<string, { active: string; inactive: string }> = {
  Home:       { active: '⬡', inactive: '⬡' },
  'Check-ins':{ active: '◉', inactive: '◎' },
  Missions:   { active: '◈', inactive: '◈' },
  Statistics: { active: '▦', inactive: '▦' },
  Flows:      { active: '◑', inactive: '◑' },
  Store:      { active: '◆', inactive: '◇' },
  Profile:    { active: '●', inactive: '○' },
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={iconStyles.wrap}>
      <Text style={[iconStyles.icon, { color: focused ? Colors.molten : 'rgba(255,255,255,0.3)' }]}>
        {focused ? ICONS[name]?.active : ICONS[name]?.inactive}
      </Text>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.molten,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Check-ins" component={CheckInsScreen} />
      <Tab.Screen name="Missions" component={MissionsScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Flows" component={FlowsScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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
  tabLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 1,
  },
});

const iconStyles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 17 },
});
