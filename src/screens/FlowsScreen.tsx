import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';

type FlowType = 'morning' | 'evening';
type Step = { id: string; prompt: string; placeholder: string };

const MORNING_STEPS: Step[] = [
  { id: 'm1', prompt: 'What is your North Star for today?', placeholder: 'The one thing that must happen...' },
  { id: 'm2', prompt: 'Top 3 priorities, in order', placeholder: '1. \n2. \n3. ' },
  { id: 'm3', prompt: 'Energy level check-in', placeholder: 'How are you showing up today? Be honest.' },
  { id: 'm4', prompt: 'What would make today a win?', placeholder: 'Define success in advance...' },
];

const EVENING_STEPS: Step[] = [
  { id: 'e1', prompt: 'Biggest win today', placeholder: "Don't be modest. What did you accomplish?" },
  { id: 'e2', prompt: 'What did you learn?', placeholder: 'Lesson, insight, or observation...' },
  { id: 'e3', prompt: 'What would you do differently?', placeholder: 'No judgment. Just honesty.' },
  { id: 'e4', prompt: 'Rate your day (1–10) and why', placeholder: 'x/10 because...' },
];

export default function FlowsScreen() {
  const [activeFlow, setActiveFlow] = useState<FlowType | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const steps = activeFlow === 'morning' ? MORNING_STEPS : EVENING_STEPS;
  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  function handleNext() {
    if (isLastStep) { setActiveFlow(null); setStep(0); setAnswers({}); }
    else setStep((s) => s + 1);
  }

  if (activeFlow) {
    const progress = ((step + 1) / steps.length) * 100;
    const isMorning = activeFlow === 'morning';
    return (
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.flowActive}>
          {/* Header */}
          <View style={styles.flowActiveHeader}>
            <TouchableOpacity onPress={() => { setActiveFlow(null); setStep(0); setAnswers({}); }}>
              <Text style={styles.exitBtn}>← EXIT</Text>
            </TouchableOpacity>
            <Text style={[styles.flowActiveLabel, { color: isMorning ? Colors.molten : Colors.gold }]}>
              {isMorning ? 'MORNING FLOW' : 'EVENING FLOW'}
            </Text>
            <Text style={styles.flowStepCount}>{step + 1} / {steps.length}</Text>
          </View>

          {/* Progress */}
          <View style={styles.flowProgressTrack}>
            <LinearGradient
              colors={isMorning ? [Colors.molten, Colors.gold] : [Colors.gold, Colors.molten]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.flowProgressFill, { width: `${progress}%` }]}
            />
          </View>

          <ScrollView style={styles.flowBody} contentContainerStyle={styles.flowBodyContent}>
            <Text style={styles.flowPrompt}>{currentStep?.prompt}</Text>
            <TextInput
              style={styles.flowInput}
              multiline
              placeholder={currentStep?.placeholder}
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={answers[currentStep?.id ?? ''] ?? ''}
              onChangeText={(t) =>
                setAnswers((prev) => ({ ...prev, [currentStep?.id ?? '']: t }))
              }
              textAlignVertical="top"
              autoFocus
            />
          </ScrollView>

          <TouchableOpacity onPress={handleNext} activeOpacity={0.88} style={styles.flowNextWrap}>
            <LinearGradient
              colors={isMorning ? [Colors.molten, '#FF8C4A'] : [Colors.gold, '#FFCA44']}
              style={styles.flowNextBtn}
            >
              <Text style={styles.flowNextText}>
                {isLastStep ? 'COMPLETE FLOW ✓' : 'NEXT →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Flows</Text>
        <Text style={styles.subtitle}>Bookend your day with intention and reflection.</Text>

        {/* Morning Flow */}
        <TouchableOpacity onPress={() => setActiveFlow('morning')} activeOpacity={0.88} style={{ marginBottom: 16 }}>
          <LinearGradient
            colors={['rgba(255,94,26,0.18)', 'rgba(255,94,26,0.04)', 'rgba(31,32,37,1)']}
            locations={[0, 0.5, 1]}
            style={[styles.flowCard, { borderColor: Colors.molten }]}
          >
            <View style={styles.flowCardTopRow}>
              <Image
                source={require('../../assets/clock-check.png')}
                style={styles.flowCardImage}
                resizeMode="contain"
              />
              <View style={styles.flowCardMetaRow}>
                {['4 STEPS', '+100 XP', '~5 MIN'].map((m) => (
                  <View key={m} style={styles.metaChip}><Text style={styles.metaChipText}>{m}</Text></View>
                ))}
              </View>
            </View>
            <Text style={[styles.flowCardEyebrow, { color: Colors.molten }]}>MORNING RITUAL</Text>
            <Text style={styles.flowCardTitle}>Morning Flow</Text>
            <Text style={styles.flowCardBody}>
              Start with intention. Set your North Star for the next 24 hours. Lock in your mission before 9 AM and activate streak multipliers.
            </Text>
            <LinearGradient colors={[Colors.molten, '#FF8C4A']} style={styles.flowCardBtn}>
              <Text style={styles.flowCardBtnText}>BEGIN MORNING FLOW →</Text>
            </LinearGradient>
          </LinearGradient>
        </TouchableOpacity>

        {/* Evening Flow */}
        <TouchableOpacity onPress={() => setActiveFlow('evening')} activeOpacity={0.88}>
          <View style={[styles.flowCard, { borderColor: 'rgba(255,179,0,0.35)' }]}>
            <View style={styles.flowCardTopRow}>
              <View style={styles.eveningIconWrap}>
                <Text style={styles.eveningIcon}>🌙</Text>
              </View>
              <View style={styles.flowCardMetaRow}>
                {['4 STEPS', '+100 XP', '~5 MIN'].map((m) => (
                  <View key={m} style={styles.metaChip}><Text style={styles.metaChipText}>{m}</Text></View>
                ))}
              </View>
            </View>
            <Text style={[styles.flowCardEyebrow, { color: Colors.gold }]}>EVENING RITUAL</Text>
            <Text style={styles.flowCardTitle}>Evening Flow</Text>
            <Text style={styles.flowCardBody}>
              Reflect without judgment. Archive wins. Process lessons. Close your loop before midnight to preserve streaks.
            </Text>
            <View style={[styles.flowCardBtn, { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.gold }]}>
              <Text style={[styles.flowCardBtnText, { color: Colors.gold }]}>BEGIN EVENING FLOW →</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.charcoal },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 36, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 },

  flowCard: {
    backgroundColor: Colors.slate,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
  },
  flowCardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  flowCardImage: { width: 56, height: 56, borderRadius: 16 },
  eveningIconWrap: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,179,0,0.1)', alignItems: 'center', justifyContent: 'center' },
  eveningIcon: { fontSize: 28 },
  flowCardMetaRow: { flexDirection: 'row', gap: 6 },
  metaChip: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  metaChipText: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.4)' },
  flowCardEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8 },
  flowCardTitle: { fontSize: 28, fontWeight: '800', color: Colors.white, marginBottom: 10 },
  flowCardBody: { fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 21, marginBottom: 22 },
  flowCardBtn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  flowCardBtnText: { fontSize: 13, fontWeight: '800', color: Colors.white, letterSpacing: 1 },

  // Active flow
  flowActive: { flex: 1, padding: 24, paddingTop: 60, paddingBottom: 32 },
  flowActiveHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  exitBtn: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 },
  flowActiveLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  flowStepCount: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  flowProgressTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 44, overflow: 'hidden' },
  flowProgressFill: { height: '100%', borderRadius: 3 },
  flowBody: { flex: 1 },
  flowBodyContent: { flexGrow: 1, justifyContent: 'center' },
  flowPrompt: { fontSize: 28, fontWeight: '800', color: Colors.white, lineHeight: 36, marginBottom: 24 },
  flowInput: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 24,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(60,79,101,0.5)',
    minHeight: 150,
  },
  flowNextWrap: { marginTop: 24 },
  flowNextBtn: { borderRadius: 18, paddingVertical: 18, alignItems: 'center' },
  flowNextText: { color: Colors.white, fontSize: 15, fontWeight: '800', letterSpacing: 1 },
});
