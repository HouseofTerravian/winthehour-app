import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MatteCard } from '../components/ui';
import {
  loadCheckIns,
  loadUnavailableHours,
  loadMYBED,
  saveMYBED,
  todayStr,
  type CheckInRecord,
  type MYBEDItems,
} from '../lib/checkins';

const WAKING_START = 6;
const WAKING_END   = 23;

function formatHour(h: number) {
  const suffix  = h < 12 ? 'AM' : 'PM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:00 ${suffix}`;
}

export default function TodayScreen() {
  const { colors, skinFonts } = useTheme();
  const today       = todayStr();
  const currentHour = new Date().getHours();
  const r = (n: number) => Math.round(n * skinFonts.borderRadiusScale);

  const [checkIns,    setCheckIns]    = useState<CheckInRecord[]>([]);
  const [unavailable, setUnavailable] = useState<number[]>([]);
  const [mybedItems,  setMybedItems]  = useState<MYBEDItems>(['', '', '', '', '', '']);
  const [mybedSaved,  setMybedSaved]  = useState(false);

  const mybedRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);

  const load = useCallback(async () => {
    const [ins, unav, mybed] = await Promise.all([
      loadCheckIns(),
      loadUnavailableHours(),
      loadMYBED(today),
    ]);
    setCheckIns(ins);
    setUnavailable(unav);
    setMybedItems(mybed);
  }, [today]);

  useEffect(() => { load(); }, [load]);

  const todayIns = checkIns.filter((r) => r.date === today);
  const hours    = Array.from({ length: WAKING_END - WAKING_START + 1 }, (_, i) => i + WAKING_START);

  async function handleMybedSave() {
    await saveMYBED(today, mybedItems);
    setMybedSaved(true);
    setTimeout(() => setMybedSaved(false), 2000);
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[s.root, { backgroundColor: colors.charcoal }]}>
        <ScrollView
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[s.title, {
            color: colors.text1,
            fontFamily: skinFonts.titleFontFamily,
            fontWeight: skinFonts.titleFontWeight,
            letterSpacing: skinFonts.titleLetterSpacing,
          }]}>
            TODAY!
          </Text>
          <Text style={[s.dateStr, { color: colors.text3, fontFamily: skinFonts.fontFamily }]}>
            {dateStr}
          </Text>
          <Text style={s.timeLayerLabel}>24H</Text>

          {/* Hours Overview — MatteCard rows, ~30% reduced glow */}
          <View style={s.hoursSection}>
            {hours.map((hour) => {
              const record    = todayIns.find((r) => r.hour === hour);
              const isUnav    = unavailable.includes(hour);
              const isCurrent = hour === currentHour;
              const isFuture  = hour > currentHour;
              const isWin     = record?.hour_result === 'win';

              // Gradient colors with ~30% reduced alpha vs original
              const gradColors: [string, string] = isCurrent
                ? ['rgba(255,94,26,0.135)', 'rgba(255,94,26,0.05)']
                : isWin
                ? ['rgba(255,94,26,0.077)', 'rgba(255,94,26,0.025)']
                : record
                ? ['rgba(60,79,101,0.117)', 'rgba(60,79,101,0.038)']
                : isUnav
                ? ['rgba(255,255,255,0.014)', 'rgba(255,255,255,0.007)']
                : [colors.rowBg, colors.rowBg];

              const borderCol = isCurrent
                ? colors.molten
                : isWin
                ? 'rgba(255,94,26,0.25)'
                : colors.cardBorder;

              return (
                <MatteCard
                  key={hour}
                  gradientColors={gradColors}
                  borderColor={borderCol}
                  borderWidth={isCurrent ? 1.5 : 1}
                  style={{
                    borderRadius: r(14),
                    opacity: isFuture && !isCurrent ? 0.45 : 1,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[s.hourLabel, {
                      color: isUnav ? colors.text4 : isCurrent ? colors.molten : colors.text1,
                      fontFamily: skinFonts.fontFamily,
                    }]}>
                      {formatHour(hour)}{isCurrent ? '  ← NOW' : ''}
                    </Text>
                    {record?.nextHourPlan ? (
                      <Text
                        style={[s.planSnippet, { color: colors.text4, fontFamily: skinFonts.fontFamily }]}
                        numberOfLines={1}
                      >
                        {record.nextHourPlan}
                      </Text>
                    ) : null}
                  </View>

                  {isUnav ? (
                    <Text style={[s.statusText, { color: colors.text4, fontFamily: skinFonts.fontFamily }]}>UNAVAIL.</Text>
                  ) : record ? (
                    <View style={[s.badge, { borderColor: isWin ? colors.molten : colors.steel, borderRadius: r(8) }]}>
                      <Text style={[s.badgeText, { color: isWin ? colors.molten : colors.steel, fontFamily: skinFonts.fontFamily }]}>
                        {isWin ? 'WON' : `LOST ${record.intensity_rating ?? ''}/5`}
                      </Text>
                    </View>
                  ) : isCurrent ? (
                    <View style={[s.badge, { borderColor: colors.molten, borderRadius: r(8) }]}>
                      <Text style={[s.badgeText, { color: colors.molten }]}>LOG →</Text>
                    </View>
                  ) : isFuture ? (
                    <Text style={[s.statusText, { color: colors.text4 }]}>—</Text>
                  ) : (
                    <View style={[s.badge, { borderColor: colors.cardBorder, borderRadius: r(8) }]}>
                      <Text style={[s.badgeText, { color: colors.text4 }]}>MISSED</Text>
                    </View>
                  )}
                </MatteCard>
              );
            })}
          </View>

          {/* M.Y.B.E.D. — increased top spacing for breathing room */}
          <View style={[s.mybedCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, borderRadius: r(22) }]}>
            <View style={s.mybedHeader}>
              <View>
                <Text style={[s.mybedTitle, {
                  color: colors.text1,
                  fontFamily: skinFonts.titleFontFamily,
                  fontWeight: skinFonts.titleFontWeight,
                  letterSpacing: skinFonts.titleLetterSpacing * 0.4,
                }]}>
                  M.Y.B.E.D.
                </Text>
                <Text style={[s.mybedSubtitle, { color: colors.molten, fontFamily: skinFonts.fontFamily }]}>
                  Make Yourself Better Every Day
                </Text>
              </View>
              {mybedSaved && (
                <View style={[s.savedBadge, { borderRadius: r(10) }]}>
                  <Text style={s.savedBadgeText}>SAVED ✓</Text>
                </View>
              )}
            </View>

            <Text style={[s.mybedQuestion, { color: colors.text3, fontFamily: skinFonts.fontFamily }]}>
              What 6 things, if accomplished, would make you better today?
            </Text>

            {mybedItems.map((item, i) => (
              <View key={i} style={s.mybedRow}>
                <Text style={[s.mybedNum, { color: colors.molten }]}>{i + 1}.</Text>
                <TextInput
                  ref={(ref) => { mybedRefs.current[i] = ref; }}
                  style={[s.mybedInput, {
                    color: colors.text1,
                    borderBottomColor: colors.cardBorder,
                    fontFamily: skinFonts.fontFamily,
                  }]}
                  value={item}
                  placeholder={`Priority ${i + 1}`}
                  placeholderTextColor={colors.text4}
                  onChangeText={(t) => {
                    const updated = [...mybedItems] as MYBEDItems;
                    updated[i] = t;
                    setMybedItems(updated);
                  }}
                  returnKeyType={i < 5 ? 'next' : 'done'}
                  onSubmitEditing={() => { if (i < 5) mybedRefs.current[i + 1]?.focus(); }}
                  blurOnSubmit={i === 5}
                />
              </View>
            ))}

            <TouchableOpacity
              style={[s.saveBtn, { borderColor: colors.molten, borderRadius: r(12) }]}
              onPress={handleMybedSave}
              activeOpacity={0.8}
            >
              <Text style={[s.saveBtnText, { color: colors.molten, fontFamily: skinFonts.fontFamily }]}>
                SAVE TODAY'S PRIORITIES
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1 },
  content: { padding: 24, paddingTop: 20, paddingBottom: 48 },

  title:   { fontSize: 36, marginBottom: 2 },
  dateStr: { fontSize: 13, marginBottom: 6 },
  timeLayerLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 2, color: 'rgba(255,255,255,0.18)', marginBottom: 20 },

  hoursSection: { gap: 8, marginBottom: 52 },
  hourLabel:   { fontSize: 15, fontWeight: '700' },
  planSnippet: { fontSize: 11, marginTop: 2 },
  statusText:  { fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  badge:       { borderWidth: 1.5, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:   { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  mybedCard:     { padding: 22, borderWidth: 1 },
  mybedHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  mybedTitle:    { fontSize: 22 },
  mybedSubtitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginTop: 2 },
  savedBadge:    { borderWidth: 1, borderColor: '#00C850', paddingHorizontal: 10, paddingVertical: 4 },
  savedBadgeText:{ fontSize: 10, fontWeight: '700', color: '#00C850', letterSpacing: 0.8 },
  mybedQuestion: { fontSize: 13, lineHeight: 19, marginBottom: 18 },
  mybedRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  mybedNum:      { fontSize: 16, fontWeight: '800', width: 22 },
  mybedInput:    { flex: 1, fontSize: 15, paddingBottom: 8, borderBottomWidth: 1 },
  saveBtn:       { borderWidth: 1.5, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText:   { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
});
