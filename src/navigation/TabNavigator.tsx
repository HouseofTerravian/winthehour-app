import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme';

import HomeTabs from './HomeTabs';
import CheckInsScreen from '../screens/CheckInsScreen';
import TodayScreen from '../screens/TodayScreen';

const Tab = createBottomTabNavigator();


function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const emoji = name === 'WTH!' ? '⏱' : name === 'TODAY!' ? '☀️' : '🏠';
  return (
    <View style={iconStyles.wrap}>
      <Text style={[iconStyles.icon, { opacity: focused ? 1 : 0.3 }]}>
        {emoji}
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
      <Tab.Screen name="Home" component={HomeTabs} />
      <Tab.Screen name="WTH!" component={CheckInsScreen} />
      <Tab.Screen name="TODAY!" component={TodayScreen} />
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
