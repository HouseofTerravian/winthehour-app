import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DEFAULT_TAB_ORDER } from '../lib/app-settings';

import HomeScreen from '../screens/HomeScreen';
import MissionsScreen from '../screens/MissionsScreen';
import FlowsScreen from '../screens/FlowsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import StoreScreen from '../screens/StoreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FeatureUpdatesScreen from '../screens/FeatureUpdatesScreen';
import CouponsScreen from '../screens/CouponsScreen';
import IntegrationsScreen from '../screens/IntegrationsScreen';

const ALL_TABS: Record<string, { key: string; label: string; icon: string }> = {
  profile:   { key: 'profile',   label: 'Profile',   icon: '●' },
  dashboard: { key: 'dashboard', label: 'Dashboard', icon: '⬡' },
  missions:  { key: 'missions',  label: 'Missions',  icon: '◈' },
  flows:     { key: 'flows',     label: 'Flows',     icon: '◑' },
  stats:     { key: 'stats',     label: 'Stats',     icon: '▦' },
  updates:   { key: 'updates',   label: 'Updates',   icon: '★' },
  store:        { key: 'store',        label: 'Store',        icon: '◆' },
  integrations: { key: 'integrations', label: 'Integrations', icon: '◎' },
  coupons:      { key: 'coupons',      label: 'Coupons',      icon: '⊕' },
};

function renderScreen(key: string) {
  switch (key) {
    case 'profile':   return <ProfileScreen />;
    case 'dashboard': return <HomeScreen />;
    case 'missions':  return <MissionsScreen />;
    case 'flows':     return <FlowsScreen />;
    case 'stats':     return <StatisticsScreen />;
    case 'updates':   return <FeatureUpdatesScreen />;
    case 'store':        return <StoreScreen />;
    case 'integrations': return <IntegrationsScreen />;
    case 'coupons':      return <CouponsScreen />;
    default:          return null;
  }
}

export default function HomeTabs() {
  const { colors, skinFonts, tabOrder, setTabOrder } = useTheme();

  const tabs = (tabOrder.length ? tabOrder : DEFAULT_TAB_ORDER)
    .map((k) => ALL_TABS[k])
    .filter(Boolean);

  const [activeTab, setActiveTab]   = useState('dashboard');
  const [reorderMode, setReorderMode] = useState(false);
  const [pickedTab, setPickedTab]   = useState<string | null>(null);

  function handleTabPress(key: string) {
    if (!reorderMode) {
      setActiveTab(key);
      return;
    }
    if (!pickedTab) {
      setPickedTab(key);
      return;
    }
    if (pickedTab === key) {
      setPickedTab(null);
      return;
    }
    // Swap pickedTab into the position of key
    const next = [...tabOrder];
    const from = next.indexOf(pickedTab);
    const to   = next.indexOf(key);
    if (from !== -1 && to !== -1) {
      next.splice(from, 1);
      next.splice(to, 0, pickedTab);
      setTabOrder(next);
    }
    setPickedTab(null);
  }

  function handleLongPress(key: string) {
    setReorderMode(true);
    setPickedTab(key);
  }

  function exitReorder() {
    setReorderMode(false);
    setPickedTab(null);
  }

  const r = (n: number) => Math.round(n * skinFonts.borderRadiusScale);

  return (
    <View style={[s.root, { backgroundColor: colors.charcoal }]}>

      {/* Tab bar */}
      <View style={[s.tabBarWrap, { backgroundColor: colors.slate, borderBottomColor: colors.cardBorder }]}>

        {reorderMode && (
          <View style={[s.reorderBanner, { backgroundColor: `${colors.gold}22` }]}>
            <Text style={[s.reorderBannerText, { color: colors.gold, fontFamily: skinFonts.fontFamily }]}>
              {pickedTab
                ? `Tap where to move "${ALL_TABS[pickedTab]?.label}"`
                : 'Tap a tab to pick it up'}
            </Text>
            <TouchableOpacity onPress={exitReorder} style={s.reorderDoneBtn}>
              <Text style={[s.reorderDoneText, { color: colors.molten, fontFamily: skinFonts.fontFamily }]}>DONE</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabBar}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key && !reorderMode;
            const isPicked = pickedTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  s.tab,
                  { borderRadius: r(20) },
                  isActive && { backgroundColor: 'rgba(255,94,26,0.15)', borderColor: colors.molten },
                  isPicked && { backgroundColor: `${colors.gold}33`, borderColor: colors.gold, borderWidth: 1.5 },
                  reorderMode && !isPicked && { opacity: 0.55 },
                ]}
                onPress={() => handleTabPress(tab.key)}
                onLongPress={() => handleLongPress(tab.key)}
                delayLongPress={400}
                activeOpacity={0.75}
              >
                <Text style={[
                  s.tabIcon,
                  { color: isActive ? colors.molten : isPicked ? colors.gold : colors.text3 },
                ]}>
                  {reorderMode ? '≡' : tab.icon}
                </Text>
                <Text style={[
                  s.tabLabel,
                  {
                    color: isActive ? colors.molten : isPicked ? colors.gold : colors.text3,
                    fontFamily: skinFonts.fontFamily,
                    fontWeight: isActive ? '700' : '600',
                    letterSpacing: skinFonts.titleLetterSpacing * 0.3,
                  },
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Screen content */}
      <View style={s.content}>
        {reorderMode ? (
          // Reorder overlay
          <View style={[s.reorderOverlay, { backgroundColor: colors.charcoal }]}>
            <Text style={[s.reorderTitle, {
              color: colors.text1,
              fontFamily: skinFonts.titleFontFamily,
              fontWeight: skinFonts.titleFontWeight,
              letterSpacing: skinFonts.titleLetterSpacing,
            }]}>
              Arrange Your Tabs
            </Text>
            <Text style={[s.reorderSub, { color: colors.text3, fontFamily: skinFonts.fontFamily }]}>
              Long-press a tab above to pick it up, then tap its destination.
            </Text>
            <View style={s.reorderList}>
              {tabs.map((tab, i) => (
                <View
                  key={tab.key}
                  style={[s.reorderItem, {
                    backgroundColor: colors.cardBg,
                    borderColor: pickedTab === tab.key ? colors.gold : colors.cardBorder,
                    borderRadius: r(14),
                    borderWidth: pickedTab === tab.key ? 1.5 : 1,
                  }]}
                >
                  <Text style={[s.reorderNum, { color: colors.text4 }]}>{i + 1}</Text>
                  <Text style={[s.reorderIcon, { color: colors.molten }]}>{tab.icon}</Text>
                  <Text style={[s.reorderLabel, { color: colors.text1, fontFamily: skinFonts.fontFamily }]}>
                    {tab.label}
                  </Text>
                  {pickedTab === tab.key && (
                    <Text style={[s.reorderPickedBadge, { color: colors.gold }]}>MOVING</Text>
                  )}
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[s.reorderSaveBtn, { borderColor: colors.molten, borderRadius: r(14) }]}
              onPress={exitReorder}
              activeOpacity={0.8}
            >
              <Text style={[s.reorderSaveBtnText, { color: colors.molten, fontFamily: skinFonts.fontFamily }]}>
                SAVE ORDER & EXIT
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          tabs.map((tab) => (
            <View
              key={tab.key}
              style={[s.screen, { display: activeTab === tab.key ? 'flex' : 'none' }]}
            >
              {renderScreen(tab.key)}
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  tabBarWrap: {
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'ios' ? 44 : Platform.OS === 'android' ? 24 : 16,
  },
  reorderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  reorderBannerText: { fontSize: 12, fontWeight: '600', flex: 1 },
  reorderDoneBtn: { paddingHorizontal: 12, paddingVertical: 4 },
  reorderDoneText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },

  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabIcon:  { fontSize: 13 },
  tabLabel: { fontSize: 12, letterSpacing: 0.2 },

  content: { flex: 1 },
  screen:  { flex: 1 },

  // Reorder overlay
  reorderOverlay: { flex: 1, padding: 24, paddingTop: 32 },
  reorderTitle:   { fontSize: 28, marginBottom: 8 },
  reorderSub:     { fontSize: 13, lineHeight: 19, marginBottom: 24 },
  reorderList:    { gap: 10, marginBottom: 28 },
  reorderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  reorderNum:       { fontSize: 13, fontWeight: '700', width: 20 },
  reorderIcon:      { fontSize: 16 },
  reorderLabel:     { flex: 1, fontSize: 15, fontWeight: '600' },
  reorderPickedBadge: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  reorderSaveBtn: {
    borderWidth: 1.5,
    paddingVertical: 14,
    alignItems: 'center',
  },
  reorderSaveBtnText: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
});
