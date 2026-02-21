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

type Props = { onGoToSignUp: () => void };

export default function SignInScreen({ onGoToSignUp }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    const err = await signIn(email.trim(), password);
    setLoading(false);
    if (err) setError(err);
    // On success, AuthContext session change auto-renders TabNavigator
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

        <Text style={styles.headline}>Welcome back.</Text>
        <Text style={styles.sub}>Sign in to your account.</Text>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

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
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.25)"
            secureTextEntry
          />
        </View>

        <TouchableOpacity activeOpacity={0.85} onPress={handleSignIn} disabled={loading}>
          <LinearGradient
            colors={[Colors.molten, '#FF8C4A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryBtn}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.primaryBtnText}>SIGN IN</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchLink} onPress={onGoToSignUp} activeOpacity={0.75}>
          <Text style={styles.switchLinkText}>
            New here?{' '}
            <Text style={styles.switchLinkAccent}>Create an account</Text>
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
    justifyContent: 'center',
  },
  logo: { width: 260, height: 68, marginBottom: 40, alignSelf: 'center' },
  headline: { fontSize: 28, fontWeight: '800', color: Colors.white, marginBottom: 6 },
  sub: { fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 32 },

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
