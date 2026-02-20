import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../theme';

type Props = { onGoToSignIn: () => void };

export default function SignUpScreen({ onGoToSignIn }: Props) {
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSignUp() {
    if (!displayName.trim()) {
      setError('Please enter your display name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setLoading(true);
    const err = await signUp(email.trim(), password, displayName.trim());
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      // If email confirmation is enabled, show check-email state
      // If disabled, onAuthStateChange fires and App.tsx auto-navigates
      setCheckEmail(true);
    }
  }

  if (checkEmail) {
    return (
      <View style={styles.root}>
        <View style={styles.checkEmailContent}>
          <Image
            source={require('../../../assets/logo-wth.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headline}>Check your email.</Text>
          <Text style={styles.sub}>
            We sent a confirmation link to{'\n'}
            <Text style={{ color: Colors.molten }}>{email}</Text>
          </Text>
          <TouchableOpacity style={styles.switchLink} onPress={onGoToSignIn} activeOpacity={0.75}>
            <Text style={styles.switchLinkText}>
              Back to{' '}
              <Text style={styles.switchLinkAccent}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Image
          source={require('../../../assets/logo-wth.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.headline}>Create your account.</Text>
        <Text style={styles.sub}>Win every hour. Build your legacy.</Text>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>DISPLAY NAME</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            placeholderTextColor="rgba(255,255,255,0.25)"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="rgba(255,255,255,0.25)"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Minimum 8 characters"
            placeholderTextColor="rgba(255,255,255,0.25)"
            secureTextEntry
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>CONFIRM PASSWORD</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.25)"
            secureTextEntry
          />
        </View>

        <TouchableOpacity activeOpacity={0.85} onPress={handleSignUp} disabled={loading}>
          <LinearGradient
            colors={[Colors.molten, '#FF8C4A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryBtn}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.primaryBtnText}>CREATE ACCOUNT</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchLink} onPress={onGoToSignIn} activeOpacity={0.75}>
          <Text style={styles.switchLinkText}>
            Already a member?{' '}
            <Text style={styles.switchLinkAccent}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.charcoal },
  content: {
    flexGrow: 1,
    padding: 28,
    paddingTop: 80,
    paddingBottom: 48,
  },
  checkEmailContent: {
    flex: 1,
    padding: 28,
    paddingTop: 120,
    alignItems: 'center',
  },
  logo: { width: 200, height: 52, marginBottom: 40, alignSelf: 'center' },
  headline: { fontSize: 28, fontWeight: '800', color: Colors.white, marginBottom: 6 },
  sub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 32,
    lineHeight: 22,
  },

  errorBanner: {
    backgroundColor: 'rgba(255,60,60,0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,60,60,0.35)',
    padding: 14,
    marginBottom: 20,
  },
  errorText: { color: '#FF6060', fontSize: 13, fontWeight: '500' },

  field: { marginBottom: 18 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.slate,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.white,
    fontSize: 15,
  },

  primaryBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  primaryBtnText: { color: Colors.white, fontSize: 14, fontWeight: '800', letterSpacing: 1 },

  switchLink: { alignItems: 'center' },
  switchLinkText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  switchLinkAccent: { color: Colors.molten, fontWeight: '700' },
});
