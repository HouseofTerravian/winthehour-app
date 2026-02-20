import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import TabNavigator from './src/navigation/TabNavigator';
import SignInScreen from './src/screens/auth/SignInScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import { Colors } from './src/theme';

function RootNavigator() {
  const { session, loading } = useAuth();
  const [authView, setAuthView] = useState<'signIn' | 'signUp'>('signIn');

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.charcoal, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.molten} size="large" />
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

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor={Colors.charcoal} />
      <RootNavigator />
    </AuthProvider>
  );
}
