import React, { useState } from 'react';
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

type Profile = {
  displayName: string;
  username: string;
  goal: string;
  timezone: string;
  focusArea: string;
};

const DEFAULT_PROFILE: Profile = {
  displayName: '',
  username: '',
  goal: '',
  timezone: 'EST',
  focusArea: '',
};

const FOCUS_AREAS = ['Career', 'Fitness', 'Business', 'Academics', 'Creative', 'Personal'];
const TIMEZONES = ['EST', 'CST', 'MST', 'PST', 'GMT', 'CET'];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(DEFAULT_PROFILE);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [silentMode, setSilentMode] = useState(false);
  const [saved, setSaved] = useState(false);

  function startEdit() {
    setDraft({ ...profile });
    setEditing(true);
  }

  function saveProfile() {
    setProfile({ ...draft });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft({ ...profile });
  }

  const hasProfile = profile.displayName.trim().length > 0;

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
                {hasProfile ? getInitials(profile.displayName) : '?'}
              </Text>
            </View>
          </LinearGradient>

          {hasProfile ? (
            <>
              <Text style={styles.displayName}>{profile.displayName}</Text>
              {profile.username ? (
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
              <Text style={styles.tierBadgeText}>FRESHMAN</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Day Streak', value: '7', color: Colors.molten },
            { label: 'Hours Won', value: '3', color: Colors.white },
            { label: 'Total XP', value: '1,420', color: Colors.gold },
          ].map((s) => (
            <View key={s.label} style={styles.statPill}>
              <Text style={[styles.statPillValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statPillLabel}>{s.label}</Text>
            </View>
          ))}
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

          <Field
            label="DISPLAY NAME"
            value={editing ? draft.displayName : profile.displayName}
            placeholder="Your name"
            editable={editing}
            onChangeText={(t) => setDraft((p) => ({ ...p, displayName: t }))}
          />
          <Field
            label="USERNAME"
            value={editing ? draft.username : profile.username}
            placeholder="@handle"
            editable={editing}
            onChangeText={(t) => setDraft((p) => ({ ...p, username: t.replace('@', '') }))}
            prefix="@"
          />
          <Field
            label="GOAL STATEMENT"
            value={editing ? draft.goal : profile.goal}
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
              const active = editing
                ? draft.focusArea === area
                : profile.focusArea === area;
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
              const active = editing ? draft.timezone === tz : profile.timezone === tz;
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
              value={notificationsOn}
              onValueChange={setNotificationsOn}
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
              value={silentMode}
              onValueChange={setSilentMode}
              trackColor={{ false: Colors.steel, true: Colors.gold }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

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

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  statPill: {
    flex: 1,
    backgroundColor: Colors.slate,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.5)',
  },
  statPillValue: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  statPillLabel: { fontSize: 10, fontWeight: '600', color: Colors.muted, letterSpacing: 0.5 },

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

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
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
