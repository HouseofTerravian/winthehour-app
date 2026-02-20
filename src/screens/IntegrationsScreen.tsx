import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const INTEGRATIONS = [
  { name: 'Google Calendar', description: 'Sync your schedule and get smart time blocks.', icon: '📅' },
  { name: 'Apple Health',    description: 'Track sleep, activity, and energy levels.',       icon: '❤️' },
  { name: 'Notion',          description: 'Export flows and daily plans to your workspace.',  icon: '📝' },
  { name: 'Slack',           description: 'Get check-in reminders sent to your Slack.',       icon: '💬' },
  { name: 'Spotify',         description: 'Auto-play focus playlists during work hours.',     icon: '🎵' },
  { name: 'Zapier',          description: 'Automate workflows across 5,000+ apps.',           icon: '⚡' },
];

export default function IntegrationsScreen() {
  const { colors, skinFonts } = useTheme();
  const r = (n: number) => Math.round(n * skinFonts.borderRadiusScale);

  return (
    <View style={[s.root, { backgroundColor: colors.charcoal }]}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={[s.title, {
          color: colors.text1,
          fontFamily: skinFonts.titleFontFamily,
          fontWeight: skinFonts.titleFontWeight,
          letterSpacing: skinFonts.titleLetterSpacing,
        }]}>
          Integrations
        </Text>
        <Text style={[s.subtitle, { color: colors.text3, fontFamily: skinFonts.fontFamily }]}>
          Connect your tools. Unify your day.
        </Text>

        <LinearGradient
          colors={['rgba(255,179,0,0.12)', 'rgba(255,179,0,0.04)']}
          style={[s.banner, { borderRadius: r(16) }]}
        >
          <Text style={[s.bannerLabel, { color: colors.gold }]}>VARSITY+ FEATURE</Text>
          <Text style={[s.bannerBody, { color: colors.text2, fontFamily: skinFonts.fontFamily }]}>
            Integrations are available to Varsity members and above. Connect your favorite apps to supercharge your daily performance.
          </Text>
        </LinearGradient>

        {INTEGRATIONS.map((item) => (
          <View
            key={item.name}
            style={[s.card, {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
              borderRadius: r(18),
            }]}
          >
            <Text style={s.icon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.name, { color: colors.text1, fontFamily: skinFonts.fontFamily }]}>{item.name}</Text>
              <Text style={[s.desc, { color: colors.text3, fontFamily: skinFonts.fontFamily }]}>{item.description}</Text>
            </View>
            <View style={[s.badge, { borderColor: colors.cardBorder, borderRadius: r(8) }]}>
              <Text style={[s.badgeText, { color: colors.text4, fontFamily: skinFonts.fontFamily }]}>SOON</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },

  title:    { fontSize: 36, marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 24 },

  banner: {
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,179,0,0.3)',
    borderLeftWidth: 3,
    borderLeftColor: '#FFB300',
  },
  bannerLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  bannerBody:  { fontSize: 13, lineHeight: 19 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginBottom: 10,
    gap: 14,
    borderWidth: 1,
  },
  icon:      { fontSize: 28 },
  name:      { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  desc:      { fontSize: 12, lineHeight: 17 },
  badge:     { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
});
