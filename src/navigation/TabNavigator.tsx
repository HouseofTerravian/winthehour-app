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

const Tab = createBottomTabNavigator();

type IconProps = { focused: boolean; color: string };

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '⬡',
    'Check-ins': '◎',
    Missions: '◈',
    Statistics: '▦',
    Flows: '◑',
    Store: '◆',
  };
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.iconText, { color: focused ? Colors.molten : Colors.steel }]}>
        {icons[label] ?? '○'}
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
        tabBarInactiveTintColor: Colors.steel,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Check-ins" component={CheckInsScreen} />
      <Tab.Screen name="Missions" component={MissionsScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Flows" component={FlowsScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.slate,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 72,
    paddingBottom: 12,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
});
