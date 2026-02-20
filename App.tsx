import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import TabNavigator from './src/navigation/TabNavigator';
import SignInScreen from './src/screens/auth/SignInScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';

function RootNavigator() {
  const { session, loading } = useAuth();
  const { colors, isDark } = useTheme();
  const [authView, setAuthView] = useState<'signIn' | 'signUp'>('signIn');

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.charcoal, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.molten} size="large" />
      </View>
    );
  }

  if (!session) {
    return authView === 'signIn' ? (
      <SignInScreen onGoToSignUp={() => setAuthView('signUp')} />
    ) : (
      <SignUpScreen onGoToSignIn={() => setAuthView('signIn')} />
    );
  }

  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

function AppContent() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.charcoal} />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
