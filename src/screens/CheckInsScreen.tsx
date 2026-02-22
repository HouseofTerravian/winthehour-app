import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  loadCheckIns,
  saveCheckIn,
  loadUnavailableHours,
  loadBeastLastSubmit,
  saveBeastLastSubmit,
  todayStr,
  type CheckInRecord,
} from '../lib/checkins';
import { ArenaContainer, HudCard, EliteButton, SectionHeader } from '../components/ui';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Flow steps: ask → plan (win) | ask → loss_reason → rate (loss)
type Step = 'ask' | 'plan' | 'loss_reason' | 'rate' | 'done';

const BEAST_SECONDS = 15 * 60;

function formatHour(h: number) {
  const suffix  = h < 12 ? 'AM' : 'PM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:00 ${suffix}`;
}

function formatHourRange(h: number) {
  const next = h + 1 > 23 ? 0 : h + 1;
  return `${formatHour(h)} – ${formatHour(next)}`;
}

function formatCountdown(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function CheckInsScreen() {
  const { colors, skinFonts } = useTheme();
  const { profile } = useAuth();
  const currentHour = new Date().getHours();
  const today = todayStr();
  const r = (n: number) => Math.round(n * skinFonts.borderRadiusScale);

  const isFree = !profile?.tier || profile.tier === 'Freshman';

  // ── Data state ──────────────────────────────────────────────────────────────
  const [allCheckIns, setAllCheckIns] = useState<CheckInRecord[]>([]);
  const [unavailable, setUnavailable] = useState<number[]>([]);
  const [activeHour,  setActiveHour]  = useState(currentHour);

  // ── Flow state ──────────────────────────────────────────────────────────────
  const [step,        setStep]        = useState<Step>('ask');
  const [tempResult,  setTempResult]  = useState<'win' | 'loss' | null>(null);
  const [lossReason,  setLossReason]  = useState('');
  const [tempRating,  setTempRating]  = useState<number | null>(null);
  const [plan,        setPlan]        = useState('');

  // ── BeastMode ───────────────────────────────────────────────────────────────
  const [beastMode, setBeastMode] = useState(false);
  const [timeLeft,  setTimeLeft]  = useState(BEAST_SECONDS);

  const todayIns       = allCheckIns.filter((r) => r.date === today);
  const existingRecord = todayIns.find((r) => r.hour === activeHour);
  const won     = todayIns.filter((r) => r.hour_result === 'win').length;
  const logged  = todayIns.length;
  const winRate = logged > 0 ? Math.round((won / logged) * 100) : 0;

  const loggedHours = todayIns
    .filter((r) => r.hour !== activeHour)
    .sort((a, b) => a.hour - b.hour);

  // ── Load data ───────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    const [ins, unav, beastRaw, lastRaw] = await Promise.all([
      loadCheckIns(),
      loadUnavailableHours(),
      AsyncStorage.getItem('@wth_beast_mode'),
      loadBeastLastSubmit(),
    ]);
    setAllCheckIns(ins);
    setUnavailable(unav);

    const isBeast = beastRaw === 'true';
    setBeastMode(isBeast);
    if (isBeast && lastRaw) {
      const elapsed = Math.floor((Date.now() - lastRaw) / 1000);
      setTimeLeft(Math.max(0, BEAST_SECONDS - elapsed));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Reset flow when switching active hour ────────────────────────────────
  useEffect(() => {
    const rec = allCheckIns.find((r) => r.date === today && r.hour === activeHour);
    setStep(rec ? 'done' : 'ask');
    setTempResult(null);
    setLossReason('');
    setTempRating(null);
    setPlan('');
  }, [activeHour]);

  // ── BeastMode countdown ──────────────────────────────────────────────────
  useEffect(() => {
    if (!beastMode) return;
    const iv = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStep('ask');
          setTempResult(null);
          setLossReason('');
          setTempRating(null);
          setPlan('');
          return BEAST_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [beastMode]);

  async function toggleBeastMode() {
    const next = !beastMode;
    setBeastMode(next);
    await AsyncStorage.setItem('@wth_beast_mode', next ? 'true' : 'false');
    if (next) setTimeLeft(BEAST_SECONDS);
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  async function submitWin(planText: string) {
    const record: CheckInRecord = {
      date: today,
      hour: activeHour,
      hour_result: 'win',
      nextHourPlan: planText,
      loggedAt: new Date().toISOString(),
    };
    await saveCheckIn(record);
    setAllCheckIns((prev) => {
      const rest = prev.filter((r) => !(r.date === today && r.hour === activeHour));
      return [...rest, record];
    });
    setStep('done');
    if (beastMode) { await saveBeastLastSubmit(Date.now()); setTimeLeft(BEAST_SECONDS); }
  }

  async function submitLoss(reasonText: string, rating: number) {
    const record: CheckInRecord = {
      date: today,
      hour: activeHour,
      hour_result: 'loss',
      intensity_rating: rating,
      loss_reason_text: reasonText,
      loggedAt: new Date().toISOString(),
    };
    await saveCheckIn(record);
    setAllCheckIns((prev) => {
      const rest = prev.filter((r) => !(r.date === today && r.hour === activeHour));
      return [...rest, record];
    });
    setStep('done');
    if (beastMode) { await saveBeastLastSubmit(Date.now()); setTimeLeft(BEAST_SECONDS); }
  }

  const isUnavailable = unavailable.includes(activeHour);
  const isFuture      = activeHour > currentHour;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ArenaContainer>
        <ScrollView
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={s.headerRow}>
            <View>
              <Text style={[s.title, {
                color: colors.text1,
                fontFamily: skinFonts.titleFontFamily,
                fontWeight: skinFonts.titleFontWeight,
                letterSpacing: skinFonts.titleLetterSpacing,
              }]}>
                WTH!
              </Text>
              <Text style={[s.subtitle, { color: colors.text3, fontFamily: skinFonts.fontFamily }]}>
                Win This Hour. Every hour.
              </Text>
              <Text style={s.timeLayerLabel}>60M</Text>
            </View>
            <View style={[s.beastToggleWrap, {
              backgroundColor: colors.cardBg,
              borderColor: beastMode ? colors.molten : colors.cardBorder,
              borderRadius: r(16),
            }]}>
              <View>
                <Text style={[s.beastLabel, { color: beastMode ? colors.molten : colors.text3, fontFamily: skinFonts.fontFamily }]}>
                  BEAST
                </Text>
                {beastMode && (
                  <Text style={[s.beastTimer, { color: colors.gold }]}>{formatCountdown(timeLeft)}</Text>
                )}
              </View>
              <Switch
                value={beastMode}
                onValueChange={toggleBeastMode}
                trackColor={{ false: colors.steel, true: colors.molten }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          {/* HUD Stats */}
          <View style={s.statsRow}>
            <HudCard
              value={String(won)}
              label="HOURS WON"
              gradientColors={['rgba(255,94,26,0.16)', 'rgba(255,94,26,0.03)']}
              valueColor={colors.molten}
            />
            <HudCard
              value={String(logged)}
              label="LOGGED"
              gradientColors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
              valueColor={colors.text1}
            />
            <HudCard
              value={`${winRate}%`}
              label="WIN RATE"
              gradientColors={['rgba(255,179,0,0.16)', 'rgba(255,179,0,0.03)']}
              valueColor={colors.gold}
            />
          </View>

          {/* ── Flow Card ── */}
          {isUnavailable ? (
            <View style={[s.flowCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, borderRadius: r(22) }]}>
              <Text style={[s.flowHourRange, { color: colors.text3 }]}>{formatHourRange(activeHour)}</Text>
              <Text style={[s.flowSubNote, { color: colors.text3 }]}>This hour is marked unavailable.</Text>
              {isFree && <SponsorPlaceholder />}
            </View>

          ) : isFuture ? (
            <View style={[s.flowCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, borderRadius: r(22), opacity: 0.4 }]}>
              <Text style={[s.flowHourRange, { color: colors.text3 }]}>{formatHourRange(activeHour)}</Text>
              <Text style={[s.flowSubNote, { color: colors.text3 }]}>This hour hasn't started yet.</Text>
            </View>

          ) : step === 'done' && existingRecord ? (
            <LinearGradient
              colors={existingRecord.hour_result === 'win'
                ? ['rgba(255,94,26,0.18)', 'rgba(255,94,26,0.05)']
                : ['rgba(60,79,101,0.22)', 'rgba(60,79,101,0.06)']}
              style={[s.flowCard, {
                borderColor: existingRecord.hour_result === 'win' ? colors.molten : colors.steel,
                borderRadius: r(22),
              }]}
            >
              <View style={s.flowDoneHeader}>
                <Text style={[s.flowHourRange, { color: colors.text3 }]}>{formatHourRange(activeHour)}</Text>
                <View style={[s.resultBadge, {
                  borderColor: existingRecord.hour_result === 'win' ? colors.molten : colors.steel,
                  borderRadius: r(10),
                }]}>
                  <Text style={[s.resultBadgeText, {
                    color: existingRecord.hour_result === 'win' ? colors.molten : colors.steel,
                  }]}>
                    {existingRecord.hour_result === 'win'
                      ? 'WON'
                      : `LOST · ${existingRecord.intensity_rating ?? '—'}/5`}
                  </Text>
                </View>
              </View>
              {existingRecord.hour_result === 'win' && (
                <Image source={require('../../assets/checkmark-neon.png')} style={s.checkImg} resizeMode="contain" />
              )}
              {existingRecord.nextHourPlan ? (
                <View style={[s.planPreview, { backgroundColor: colors.inputBg, borderRadius: r(12) }]}>
                  <Text style={[s.planPreviewLabel, { color: colors.text4, fontFamily: skinFonts.fontFamily }]}>NEXT HOUR PLAN</Text>
                  <Text style={[s.planPreviewText, { color: colors.text2, fontFamily: skinFonts.fontFamily }]}>{existingRecord.nextHourPlan}</Text>
                </View>
              ) : null}
              <TouchableOpacity style={s.relogBtn} onPress={() => setStep('ask')} activeOpacity={0.75}>
                <Text style={[s.relogBtnText, { color: colors.text4 }]}>RE-LOG THIS HOUR</Text>
              </TouchableOpacity>
              {isFree && <SponsorPlaceholder />}
            </LinearGradient>

          ) : step === 'ask' ? (
            <LinearGradient
              colors={['rgba(255,94,26,0.15)', 'rgba(255,94,26,0.04)']}
              style={[s.flowCard, { borderColor: colors.molten, borderRadius: r(22) }]}
            >
              <Text style={[s.flowHourRange, { color: colors.text3 }]}>{formatHourRange(activeHour)}</Text>
              <Text style={[s.flowQuestion, {
                color: colors.text1,
                fontFamily: skinFonts.titleFontFamily,
                fontWeight: skinFonts.titleFontWeight,
              }]}>
                Did you win this hour?
              </Text>
              <View style={s.flowBtnRow}>
                <EliteButton
                  label="YES"
                  variant="primary"
                  onPress={() => { setTempResult('win'); setStep('plan'); }}
                />
                <EliteButton
                  label="NO"
                  variant="ghost"
                  onPress={() => { setTempResult('loss'); setStep('loss_reason'); }}
                />
              </View>
              {isFree && <SponsorPlaceholder />}
            </LinearGradient>

          ) : step === 'plan' ? (
            <LinearGradient
              colors={['rgba(255,94,26,0.15)', 'rgba(255,94,26,0.04)']}
              style={[s.flowCard, { borderColor: colors.molten, borderRadius: r(22) }]}
            >
              <Text style={[s.flowWonFlag, { color: colors.molten, fontFamily: skinFonts.fontFamily }]}>✓ HOUR WON</Text>
              <Text style={[s.flowQuestion, {
                color: colors.text1,
                fontFamily: skinFonts.titleFontFamily,
                fontWeight: skinFonts.titleFontWeight,
              }]}>
                What do you need to do to win the next hour?
              </Text>
              <TextInput
                style={[s.planInput, {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.cardBorder,
                  color: colors.text1,
                  borderRadius: r(14),
                }]}
                placeholder="Type your plan…"
                placeholderTextColor={colors.text4}
                value={plan}
                onChangeText={setPlan}
                multiline
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[s.submitWrap, !plan.trim() && { opacity: 0.4 }]}
                onPress={() => submitWin(plan)}
                disabled={!plan.trim()}
                activeOpacity={0.8}
              >
                <LinearGradient colors={[colors.molten, '#FF8C4A']} style={[s.submitBtn, { borderRadius: r(14) }]}>
                  <Text style={[s.submitBtnText, { fontFamily: skinFonts.fontFamily }]}>LOCK IT IN</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>

          ) : step === 'loss_reason' ? (
            <LinearGradient
              colors={['rgba(60,79,101,0.22)', 'rgba(60,79,101,0.06)']}
              style={[s.flowCard, { borderColor: colors.steel, borderRadius: r(22) }]}
            >
              <Text style={[s.flowLostFlag, { color: colors.steel, fontFamily: skinFonts.fontFamily }]}>HOUR LOST</Text>
              <Text style={[s.flowQuestion, {
                color: colors.text1,
                fontFamily: skinFonts.titleFontFamily,
                fontWeight: skinFonts.titleFontWeight,
              }]}>
                Why did you not win this hour?
              </Text>
              <TextInput
                style={[s.planInput, {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.cardBorder,
                  color: colors.text1,
                  borderRadius: r(14),
                }]}
                placeholder="Be honest with yourself…"
                placeholderTextColor={colors.text4}
                value={lossReason}
                onChangeText={setLossReason}
                multiline
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[s.submitWrap, !lossReason.trim() && { opacity: 0.4 }]}
                onPress={() => setStep('rate')}
                disabled={!lossReason.trim()}
                activeOpacity={0.8}
              >
                <LinearGradient colors={[colors.steel, colors.molten]} style={[s.submitBtn, { borderRadius: r(14) }]}>
                  <Text style={[s.submitBtnText, { fontFamily: skinFonts.fontFamily }]}>NEXT</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>

          ) : step === 'rate' ? (
            <LinearGradient
              colors={['rgba(60,79,101,0.22)', 'rgba(60,79,101,0.06)']}
              style={[s.flowCard, { borderColor: colors.steel, borderRadius: r(22) }]}
            >
              <Text style={[s.flowLostFlag, { color: colors.steel, fontFamily: skinFonts.fontFamily }]}>HOUR LOST</Text>
              <Text style={[s.flowQuestion, {
                color: colors.text1,
                fontFamily: skinFonts.titleFontFamily,
                fontWeight: skinFonts.titleFontWeight,
              }]}>
                Rate this hour (1–5)
              </Text>
              <View style={s.ratingRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={s.ratingBtn}
                    onPress={() => submitLoss(lossReason, n)}
                    activeOpacity={0.6}
                  >
                    <Text style={[s.ratingNum, { color: tempRating === n ? colors.molten : 'rgba(255,255,255,0.3)' }]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          ) : null}

          {/* Past Logged Hours */}
          {loggedHours.length > 0 && (
            <>
              <SectionHeader label="Past Hours" color={colors.text4} style={{ fontFamily: skinFonts.fontFamily }} />
              {loggedHours.map((record) => (
                <TouchableOpacity
                  key={record.hour}
                  style={s.hourRowWrap}
                  onPress={() => setActiveHour(record.hour)}
                  activeOpacity={0.75}
                >
                  <LinearGradient
                    colors={
                      record.hour_result === 'win'
                        ? ['rgba(255,94,26,0.12)', 'rgba(255,94,26,0.04)']
                        : ['rgba(60,79,101,0.2)', 'rgba(60,79,101,0.06)']
                    }
                    style={[s.hourRow, {
                      borderRadius: r(16),
                      borderColor: record.hour_result === 'win' ? 'rgba(255,94,26,0.4)' : colors.cardBorder,
                    }]}
                  >
                    <Text style={[s.hourLabel, { color: colors.text1, fontFamily: skinFonts.fontFamily }]}>
                      {formatHour(record.hour)}
                    </Text>
                    <View style={[s.hourBadge, {
                      borderColor: record.hour_result === 'win' ? colors.molten : colors.steel,
                      borderRadius: r(10),
                    }]}>
                      <Text style={[s.hourBadgeText, {
                        color: record.hour_result === 'win' ? colors.molten : colors.steel,
                        fontFamily: skinFonts.fontFamily,
                      }]}>
                        {record.hour_result === 'win' ? 'WON' : `LOST ${record.intensity_rating ?? '—'}/5`}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </>
          )}

        </ScrollView>
      </ArenaContainer>
    </KeyboardAvoidingView>
  );
}

// Structural placeholder — replaced by PartnerStore in sponsor phase
function SponsorPlaceholder() {
  return (
    <Text style={s.sponsorBanner}>
      This hour was brought to you by [Partner]
    </Text>
  );
}

const s = StyleSheet.create({
  content: { padding: 24, paddingTop: 20, paddingBottom: 48 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title:    { fontSize: 36, marginBottom: 2 },
  subtitle: { fontSize: 13 },

  beastToggleWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderWidth: 1, marginTop: 4 },
  beastLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  beastTimer: { fontSize: 18, fontWeight: '800', letterSpacing: 1 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },

  flowCard:      { padding: 22, borderWidth: 1.5, marginBottom: 24, backgroundColor: 'transparent' },
  flowHourRange: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 12 },
  flowSubNote:   { fontSize: 15 },
  flowQuestion:  { fontSize: 21, lineHeight: 29, marginBottom: 20 },
  flowWonFlag:   { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 10 },
  flowLostFlag:  { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 10 },

  flowBtnRow: { flexDirection: 'row', gap: 12 },

  timeLayerLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 2, color: 'rgba(255,255,255,0.18)', marginTop: 3 },

  ratingRow: { flexDirection: 'row', gap: 8 },
  ratingBtn: { flex: 1, paddingVertical: 18, alignItems: 'center', backgroundColor: 'transparent' },
  ratingNum: { fontSize: 22, fontWeight: '800' },

  planInput:     { borderWidth: 1, padding: 14, fontSize: 15, minHeight: 88, textAlignVertical: 'top', marginBottom: 14 },
  submitWrap:    {},
  submitBtn:     { paddingVertical: 16, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', letterSpacing: 1 },

  flowDoneHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  resultBadge:     { borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 5 },
  resultBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  checkImg:        { width: 44, height: 44, alignSelf: 'center', marginBottom: 10 },
  planPreview:     { padding: 12, marginBottom: 14 },
  planPreviewLabel:{ fontSize: 9, fontWeight: '700', letterSpacing: 1, marginBottom: 5 },
  planPreviewText: { fontSize: 14, lineHeight: 20 },
  relogBtn:        { alignItems: 'center', paddingVertical: 8, marginTop: 4 },
  relogBtnText:    { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },

  sponsorBanner: { fontSize: 10, marginTop: 12, letterSpacing: 0.3, color: 'rgba(255,255,255,0.2)' },

  hourRowWrap:  { marginBottom: 8 },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderWidth: 1 },
  hourLabel:     { fontSize: 15, fontWeight: '700', flex: 1 },
  hourBadge:     { borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 5 },
  hourBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },

});
