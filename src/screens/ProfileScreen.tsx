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
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useTheme, SKINS, type Skin } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadUnavailableHours,
  saveUnavailableHours,
} from '../lib/checkins';

type DraftProfile = {
  displayName: string;
  username: string;
  goal: string;
  timezone: string;
  focusArea: string;
  notificationsOn: boolean;
  silentMode: boolean;
};

const FOCUS_AREAS = ['Career', 'Fitness', 'Business', 'Academics', 'Creative', 'Personal'];
const TIMEZONES = ['EST', 'CST', 'MST', 'PST', 'GMT', 'CET'];

function getInitials(name: string) {
  return (
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??'
  );
}

function profileToDraft(profile: ReturnType<typeof useAuth>['profile']): DraftProfile {
  return {
    displayName: profile?.display_name ?? '',
    username: profile?.username ?? '',
    goal: profile?.goal ?? '',
    timezone: profile?.timezone ?? 'EST',
    focusArea: profile?.focus_area ?? 'Career',
    notificationsOn: profile?.notifications_on ?? true,
    silentMode: profile?.silent_mode ?? false,
  };
}

function formatHourShort(h: number) {
  if (h === 0) return '12A';
  if (h === 12) return '12P';
  return h < 12 ? `${h}A` : `${h - 12}P`;
}

export default function ProfileScreen() {
  const { profile, updateProfile, signOut } = useAuth();
  const {
    colors, skinFonts, isDark, toggleDarkMode,
    skin, setSkin, aiName, setAiName,
    locationEnabled, toggleLocation,
  } = useTheme();
  const r = (n: number) => Math.round(n * skinFonts.borderRadiusScale);

  const [editing, setEditing]     = useState(false);
  const [aiNameDraft, setAiNameDraft] = useState(aiName);
  const [aliasDraft,  setAliasDraft]  = useState('');
  const [draft, setDraft] = useState<DraftProfile>(() => profileToDraft(profile));
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [unavailableHours, setUnavailableHours] = useState<number[]>([]);

  // Seed draft when profile first loads from context
  useEffect(() => {
    if (profile && !editing) {
      setDraft(profileToDraft(profile));
    }
  }, [profile]);

  useEffect(() => {
    AsyncStorage.getItem('@wth_display_alias').then((val) => {
      if (val) setAliasDraft(val);
    });
  }, []);

  async function saveAlias() {
    const clean = aliasDraft.trim().toUpperCase().slice(0, 10);
    await AsyncStorage.setItem('@wth_display_alias', clean);
    setAliasDraft(clean);
  }

  const loadUnav = useCallback(async () => {
    const hours = await loadUnavailableHours();
    setUnavailableHours(hours);
  }, []);

  useEffect(() => { loadUnav(); }, [loadUnav]);

  async function toggleUnavailableHour(hour: number) {
    const updated = unavailableHours.includes(hour)
      ? unavailableHours.filter((h) => h !== hour)
      : [...unavailableHours, hour].sort((a, b) => a - b);
    setUnavailableHours(updated);
    await saveUnavailableHours(updated);
  }

  function startEdit() {
    setDraft(profileToDraft(profile));
    setEditing(true);
  }

  async function saveProfile() {
    setSaveError(null);
    const err = await updateProfile({
      display_name: draft.displayName,
      username: draft.username || null,
      goal: draft.goal || null,
      timezone: draft.timezone,
      focus_area: draft.focusArea,
      notifications_on: draft.notificationsOn,
      silent_mode: draft.silentMode,
    });
    if (err) {
      setSaveError(err);
      return;
    }
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(profileToDraft(profile));
  }

  const displayName = editing ? draft.displayName : (profile?.display_name ?? '');
  const hasProfile = displayName.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={[Colors.molten, Colors.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              <Text style={styles.avatarInitials}>
                {hasProfile ? getInitials(displayName) : '?'}
              </Text>
            </View>
          </LinearGradient>

          {hasProfile ? (
            <>
              <Text style={styles.displayName}>{displayName}</Text>
              {profile?.username ? (
                <Text style={styles.username}>@{profile.username}</Text>
              ) : null}
            </>
          ) : (
            <>
              <Text style={styles.displayName}>New Member</Text>
              <Text style={styles.username}>Complete your profile below</Text>
            </>
          )}

          <View style={styles.tierRow}>
            <LinearGradient
              colors={['rgba(255,94,26,0.2)', 'rgba(255,179,0,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tierBadge}
            >
              <Text style={styles.tierBadgeText}>{(profile?.tier ?? 'FRESHMAN').toUpperCase()}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Profile Form */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile</Text>
            {!editing ? (
              <TouchableOpacity style={styles.editBtn} onPress={startEdit} activeOpacity={0.8}>
                <Text style={styles.editBtnText}>{hasProfile ? 'EDIT' : 'CREATE'}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity onPress={cancelEdit} style={styles.cancelBtn} activeOpacity={0.8}>
                  <Text style={styles.cancelBtnText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveProfile} style={styles.saveBtn} activeOpacity={0.8}>
                  <Text style={styles.saveBtnText}>SAVE</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {saved && (
            <View style={styles.savedBanner}>
              <Text style={styles.savedText}>Profile saved ✓</Text>
            </View>
          )}
          {saveError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{saveError}</Text>
            </View>
          )}

          <Field
            label="DISPLAY NAME"
            value={editing ? draft.displayName : (profile?.display_name ?? '')}
            placeholder="Your name"
            editable={editing}
            onChangeText={(t) => setDraft((p) => ({ ...p, displayName: t }))}
          />
          <Field
            label="USERNAME"
            value={editing ? draft.username : (profile?.username ?? '')}
            placeholder="@handle"
            editable={editing}
            onChangeText={(t) => setDraft((p) => ({ ...p, username: t.replace('@', '') }))}
            prefix="@"
          />
          <Field
            label="GOAL STATEMENT"
            value={editing ? draft.goal : (profile?.goal ?? '')}
            placeholder="What are you building toward?"
            editable={editing}
            onChangeText={(t) => setDraft((p) => ({ ...p, goal: t }))}
            multiline
          />
        </View>

        {/* Focus Area */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Focus Area</Text>
          <View style={styles.chipGrid}>
            {FOCUS_AREAS.map((area) => {
              const active = editing ? draft.focusArea === area : profile?.focus_area === area;
              return (
                <TouchableOpacity
                  key={area}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => editing && setDraft((p) => ({ ...p, focusArea: area }))}
                  activeOpacity={editing ? 0.75 : 1}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{area}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Timezone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Timezone</Text>
          <View style={styles.chipGrid}>
            {TIMEZONES.map((tz) => {
              const active = editing ? draft.timezone === tz : profile?.timezone === tz;
              return (
                <TouchableOpacity
                  key={tz}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => editing && setDraft((p) => ({ ...p, timezone: tz }))}
                  activeOpacity={editing ? 0.75 : 1}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{tz}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Preferences</Text>
          <View style={styles.prefRow}>
            <View>
              <Text style={styles.prefLabel}>Notifications</Text>
              <Text style={styles.prefSub}>HH:55 reset reminders</Text>
            </View>
            <Switch
              value={editing ? draft.notificationsOn : (profile?.notifications_on ?? true)}
              onValueChange={(v) => editing && setDraft((p) => ({ ...p, notificationsOn: v }))}
              trackColor={{ false: Colors.steel, true: Colors.molten }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={[styles.prefRow, { borderBottomWidth: 0 }]}>
            <View>
              <Text style={styles.prefLabel}>Silent Mode</Text>
              <Text style={styles.prefSub}>Pause all interruptions</Text>
            </View>
            <Switch
              value={editing ? draft.silentMode : (profile?.silent_mode ?? false)}
              onValueChange={(v) => editing && setDraft((p) => ({ ...p, silentMode: v }))}
              trackColor={{ false: Colors.steel, true: Colors.gold }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* ── Appearance ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Appearance</Text>

          {/* Light Mode */}
          <View style={[styles.prefRow, { borderBottomColor: 'rgba(255,255,255,0.06)' }]}>
            <View>
              <Text style={styles.prefLabel}>Light Mode</Text>
              <Text style={styles.prefSub}>Switch between dark and light theme</Text>
            </View>
            <Switch
              value={!isDark}
              onValueChange={toggleDarkMode}
              trackColor={{ false: Colors.steel, true: Colors.gold }}
              thumbColor={Colors.white}
            />
          </View>

          {/* App Skin */}
          <Text style={[styles.prefLabel, { marginTop: 14, marginBottom: 10 }]}>App Skin</Text>
          <View style={styles.chipGrid}>
            {(['default', 'student', 'athletic', 'professional'] as Skin[]).map((s) => {
              const isActive = skin === s;
              const sf = SKINS[s];
              return (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.skinCard,
                    isActive && styles.skinCardActive,
                    { borderRadius: r(14), borderColor: isActive ? Colors.molten : 'rgba(60,79,101,0.5)' },
                  ]}
                  onPress={() => setSkin(s)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.skinCardTitle,
                      { fontFamily: sf.titleFontFamily, fontWeight: sf.titleFontWeight, letterSpacing: sf.titleLetterSpacing * 0.5 },
                      isActive && { color: Colors.molten },
                    ]}
                  >
                    {sf.skinLabel}
                  </Text>
                  <Text style={[styles.skinCardSub, isActive && { color: 'rgba(255,94,26,0.7)' }]}>
                    {s === 'default' ? 'System font' : s === 'student' ? 'Serif · Rounded' : s === 'athletic' ? 'Condensed · Bold' : 'Helvetica · Clean'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Display Alias */}
          <Text style={[styles.prefLabel, { marginTop: 18, marginBottom: 4 }]}>DISPLAY ALIAS</Text>
          <Text style={[styles.prefSub, { marginBottom: 10 }]}>
            Your chosen identity in bottom nav. Max 10 chars. Paid plans only.
          </Text>
          <View style={[styles.aiNameRow, { borderColor: 'rgba(60,79,101,0.5)', borderRadius: r(12) }]}>
            <TextInput
              style={[styles.aiNameInput, { fontWeight: '700', letterSpacing: 1 }]}
              value={aliasDraft}
              onChangeText={(t) => setAliasDraft(t.toUpperCase().replace(/\s/g, '').slice(0, 10))}
              placeholder="ATEMNOO, DREAM…"
              placeholderTextColor="rgba(255,255,255,0.25)"
              autoCapitalize="characters"
              maxLength={10}
            />
            <TouchableOpacity
              style={[styles.aiNameSaveBtn, { borderRadius: r(8) }]}
              onPress={saveAlias}
              activeOpacity={0.8}
            >
              <Text style={styles.aiNameSaveBtnText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── A.I. Assistant (Premium) ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>A.I. Assistant</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </View>
          </View>
          <Text style={[styles.prefSub, { marginBottom: 12 }]}>
            Name your personal AI coach. Available on Varsity and above.
          </Text>
          <View style={[styles.aiNameRow, { borderColor: 'rgba(60,79,101,0.5)', borderRadius: r(12) }]}>
            <TextInput
              style={styles.aiNameInput}
              value={aiNameDraft}
              onChangeText={setAiNameDraft}
              placeholder="e.g. Atlas, Sage, Cipher…"
              placeholderTextColor="rgba(255,255,255,0.25)"
              editable={profile?.tier !== 'Freshman'}
            />
            <TouchableOpacity
              style={[styles.aiNameSaveBtn, { opacity: profile?.tier === 'Freshman' ? 0.4 : 1, borderRadius: r(8) }]}
              onPress={() => setAiName(aiNameDraft)}
              disabled={profile?.tier === 'Freshman'}
              activeOpacity={0.8}
            >
              <Text style={styles.aiNameSaveBtnText}>SAVE</Text>
            </TouchableOpacity>
          </View>
          {profile?.tier === 'Freshman' && (
            <Text style={styles.premiumNote}>Upgrade to Varsity to unlock AI naming.</Text>
          )}
        </View>

        {/* ── Location ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Location</Text>
          <View style={[styles.prefRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text style={styles.prefLabel}>Location-Based Planning</Text>
              <Text style={styles.prefSub}>
                Some users prefer location-based planning of their day. When near certain critical locations
                (Business District, Student Union, Convenience Store, etc.), reminders and alerts can be sent.
                On our upgraded plan, your A.I. can also suggest where and when to get things done.
              </Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={toggleLocation}
              trackColor={{ false: Colors.steel, true: Colors.molten }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* Unavailable Hours */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 6 }]}>Unavailable Hours</Text>
          <Text style={styles.unavailableSubtitle}>
            Tap hours you're asleep, commuting, or otherwise off-limits.
            WTH! will mark these as unavailable instead of prompting you.
          </Text>
          <View style={styles.hourGrid}>
            {Array.from({ length: 24 }, (_, h) => {
              const active = unavailableHours.includes(h);
              return (
                <TouchableOpacity
                  key={h}
                  style={[styles.hourChip, active && styles.hourChipActive]}
                  onPress={() => toggleUnavailableHour(h)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.hourChipText, active && styles.hourChipTextActive]}>
                    {formatHourShort(h)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {unavailableHours.length > 0 && (
            <TouchableOpacity
              style={styles.clearHoursBtn}
              onPress={async () => {
                setUnavailableHours([]);
                await saveUnavailableHours([]);
              }}
              activeOpacity={0.75}
            >
              <Text style={styles.clearHoursBtnText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut} activeOpacity={0.75}>
          <Text style={styles.signOutBtnText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Danger Zone */}
        <TouchableOpacity style={styles.resetBtn} activeOpacity={0.75}>
          <Text style={styles.resetBtnText}>Reset All Data</Text>
        </TouchableOpacity>

        <Text style={styles.legal}>
          Win The Hour!™ · © Chude Muonelo{'\n'}Toravian Dynasty Trust · MCM Enterprises
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label, value, placeholder, editable, onChangeText, multiline, prefix,
}: {
  label: string;
  value: string;
  placeholder: string;
  editable: boolean;
  onChangeText: (t: string) => void;
  multiline?: boolean;
  prefix?: string;
}) {
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={[fieldStyles.inputRow, editable && fieldStyles.inputRowActive]}>
        {prefix && <Text style={fieldStyles.prefix}>{prefix}</Text>}
        <TextInput
          style={[fieldStyles.input, multiline && { minHeight: 72 }]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.25)"
          editable={editable}
          onChangeText={onChangeText}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputRowActive: {
    borderColor: Colors.molten,
    backgroundColor: 'rgba(255,94,26,0.05)',
  },
  prefix: { color: Colors.muted, fontSize: 15, marginRight: 4 },
  input: { flex: 1, color: Colors.white, fontSize: 15 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.charcoal },
  content: { padding: 24, paddingTop: 60, paddingBottom: 48 },

  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    backgroundColor: Colors.slate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { fontSize: 32, fontWeight: '800', color: Colors.white },
  displayName: { fontSize: 24, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  username: { fontSize: 14, color: Colors.muted, marginBottom: 12 },
  tierRow: { marginTop: 4 },
  tierBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.molten,
  },
  tierBadgeText: { color: Colors.molten, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },

  section: {
    backgroundColor: Colors.slate,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.4)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.white },
  editBtn: {
    borderWidth: 1.5,
    borderColor: Colors.molten,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  editBtnText: { color: Colors.molten, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  editActions: { flexDirection: 'row', gap: 8 },
  cancelBtn: {
    borderWidth: 1.5,
    borderColor: Colors.steel,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelBtnText: { color: Colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  saveBtn: {
    backgroundColor: Colors.molten,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  saveBtnText: { color: Colors.white, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  savedBanner: {
    backgroundColor: 'rgba(0,200,80,0.15)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,200,80,0.4)',
    alignItems: 'center',
  },
  savedText: { color: '#00C850', fontSize: 13, fontWeight: '600' },
  errorBanner: {
    backgroundColor: 'rgba(255,60,60,0.12)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,60,60,0.35)',
    alignItems: 'center',
  },
  errorText: { color: '#FF6060', fontSize: 13, fontWeight: '500' },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.6)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipActive: { backgroundColor: 'rgba(255,94,26,0.15)', borderColor: Colors.molten },
  chipText: { fontSize: 13, color: Colors.muted, fontWeight: '600' },
  chipTextActive: { color: Colors.molten },

  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  prefLabel: { fontSize: 15, fontWeight: '600', color: Colors.white, marginBottom: 3 },
  prefSub: { fontSize: 12, color: Colors.muted },

  // Skin selector
  skinCard: {
    width: '47%',
    padding: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: 8,
  },
  skinCardActive: {
    backgroundColor: 'rgba(255,94,26,0.1)',
  },
  skinCardTitle: { fontSize: 15, color: Colors.white, marginBottom: 4 },
  skinCardSub:   { fontSize: 11, color: 'rgba(255,255,255,0.35)' },

  // Premium badge
  premiumBadge: {
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  premiumBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.gold, letterSpacing: 0.8 },
  premiumNote:      { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 8 },

  // AI Name
  aiNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  aiNameInput:       { flex: 1, color: Colors.white, fontSize: 15 },
  aiNameSaveBtn:     { backgroundColor: Colors.molten, paddingHorizontal: 14, paddingVertical: 8 },
  aiNameSaveBtnText: { color: Colors.white, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },

  unavailableSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 18,
    marginBottom: 16,
  },
  hourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hourChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.6)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    minWidth: 46,
    alignItems: 'center',
  },
  hourChipActive: {
    backgroundColor: 'rgba(255,94,26,0.12)',
    borderColor: Colors.molten,
  },
  hourChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
  },
  hourChipTextActive: {
    color: Colors.molten,
  },
  clearHoursBtn: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  clearHoursBtnText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '600',
  },

  signOutBtn: {
    borderWidth: 1.5,
    borderColor: Colors.molten,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  signOutBtnText: { color: Colors.molten, fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },

  resetBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,60,60,0.3)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 28,
  },
  resetBtnText: { color: 'rgba(255,100,100,0.7)', fontSize: 14, fontWeight: '600' },

  legal: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
    lineHeight: 18,
  },
});
