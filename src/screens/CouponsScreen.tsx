import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export default function CouponsScreen() {
  const { colors, skinFonts } = useTheme();
  const r = (n: number) => Math.round(n * skinFonts.borderRadiusScale);

  return (
    <View style={[s.root, { backgroundColor: colors.charcoal }]}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={[s.title, { color: colors.text1, fontFamily: skinFonts.titleFontFamily, letterSpacing: skinFonts.titleLetterSpacing, fontWeight: skinFonts.titleFontWeight }]}>
          Coupons
        </Text>
        <Text style={[s.subtitle, { color: colors.text3, fontFamily: skinFonts.fontFamily }]}>
          Deals and rewards for your discipline.
        </Text>

        <LinearGradient
          colors={['rgba(255,94,26,0.12)', 'rgba(255,94,26,0.04)']}
          style={[s.comingSoon, { borderRadius: r(22), borderColor: `${colors.molten}44` }]}
        >
          <Text style={[s.comingSoonIcon, { fontFamily: skinFonts.fontFamily }]}>⊕</Text>
          <Text style={[s.comingSoonTitle, { color: colors.text1, fontFamily: skinFonts.titleFontFamily, fontWeight: skinFonts.titleFontWeight }]}>
            Coming Soon
          </Text>
          <Text style={[s.comingSoonBody, { color: colors.text3, fontFamily: skinFonts.fontFamily }]}>
            Partner coupons, discount codes, and exclusive deals for WTH! members who stay consistent.
            {'\n\n'}Varsity and above get early access.
          </Text>
        </LinearGradient>

        <View style={[s.placeholder, { backgroundColor: colors.cardBg, borderRadius: r(18), borderColor: colors.cardBorder }]}>
          <Text style={[s.placeholderLabel, { color: colors.text4, fontFamily: skinFonts.fontFamily }]}>
            AVAILABLE TO VARSITY+
          </Text>
          <Text style={[s.placeholderTitle, { color: colors.text3, fontFamily: skinFonts.fontFamily }]}>
            Partner deal slots unlocking soon
          </Text>
        </View>
        <View style={[s.placeholder, { backgroundColor: colors.cardBg, borderRadius: r(18), borderColor: colors.cardBorder }]}>
          <Text style={[s.placeholderLabel, { color: colors.text4, fontFamily: skinFonts.fontFamily }]}>
            AVAILABLE TO VARSITY+
          </Text>
          <Text style={[s.placeholderTitle, { color: colors.text3, fontFamily: skinFonts.fontFamily }]}>
            Partner deal slots unlocking soon
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 48 },
  title: { fontSize: 36, marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 32 },
  comingSoon: {
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  comingSoonIcon: { fontSize: 40, marginBottom: 14 },
  comingSoonTitle: { fontSize: 22, marginBottom: 10 },
  comingSoonBody: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
  placeholder: {
    padding: 20,
    borderWidth: 1,
    marginBottom: 12,
    opacity: 0.5,
  },
  placeholderLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  placeholderTitle: { fontSize: 14 },
});
