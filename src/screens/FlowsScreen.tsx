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
} from 'react-native';
import { Colors, Typography } from '../theme';

type FlowType = 'morning' | 'evening';
type Step = { id: string; prompt: string; placeholder: string };

const MORNING_STEPS: Step[] = [
  { id: 'm1', prompt: 'What is your North Star for today?', placeholder: 'The one thing that must happen...' },
  { id: 'm2', prompt: 'Top 3 priorities (in order)', placeholder: '1. \n2. \n3. ' },
  { id: 'm3', prompt: 'Energy level check-in', placeholder: 'How are you showing up today? Be honest.' },
  { id: 'm4', prompt: 'What would make today a win?', placeholder: 'Define success in advance...' },
];

const EVENING_STEPS: Step[] = [
  { id: 'e1', prompt: 'Biggest win today', placeholder: 'Don\'t be modest. What did you actually accomplish?' },
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

  function handleAnswer(text: string) {
    if (!currentStep) return;
    setAnswers((prev) => ({ ...prev, [currentStep.id]: text }));
  }

  function handleNext() {
    if (isLastStep) {
      setActiveFlow(null);
      setStep(0);
      setAnswers({});
    } else {
      setStep((s) => s + 1);
    }
  }

  if (activeFlow) {
    const progress = ((step + 1) / steps.length) * 100;
    return (
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.flowContainer}>
          {/* Flow Header */}
          <View style={styles.flowHeader}>
            <TouchableOpacity onPress={() => { setActiveFlow(null); setStep(0); setAnswers({}); }}>
              <Text style={[Typography.label, { color: Colors.muted }]}>← EXIT</Text>
            </TouchableOpacity>
            <Text style={[Typography.label, { color: activeFlow === 'morning' ? Colors.molten : Colors.steel }]}>
              {activeFlow === 'morning' ? 'MORNING FLOW' : 'EVENING FLOW'}
            </Text>
            <Text style={Typography.label}>{step + 1}/{steps.length}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.flowProgressBar}>
            <View style={[styles.flowProgressFill, { width: `${progress}%`, backgroundColor: activeFlow === 'morning' ? Colors.molten : Colors.gold }]} />
          </View>

          <ScrollView style={styles.flowBody} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <Text style={[Typography.display, { marginBottom: 20, lineHeight: 42 }]}>
              {currentStep?.prompt}
            </Text>
            <TextInput
              style={styles.flowInput}
              multiline
              placeholder={currentStep?.placeholder}
              placeholderTextColor={Colors.muted}
              value={answers[currentStep?.id ?? ''] ?? ''}
              onChangeText={handleAnswer}
              textAlignVertical="top"
              autoFocus
            />
          </ScrollView>

          {/* Action */}
          <TouchableOpacity
            style={[styles.flowButton, { backgroundColor: activeFlow === 'morning' ? Colors.molten : Colors.gold }]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.flowButtonText}>
              {isLastStep ? 'COMPLETE FLOW' : 'NEXT →'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[Typography.display, { marginBottom: 6 }]}>Flows</Text>
        <Text style={[Typography.bodyMuted, { marginBottom: 36 }]}>
          Bookend your day with intention and reflection.
        </Text>

        {/* Morning Flow */}
        <TouchableOpacity
          style={styles.flowCard}
          onPress={() => setActiveFlow('morning')}
          activeOpacity={0.85}
        >
          <View style={styles.flowIcon}>
            <Text style={styles.flowIconText}>☀️</Text>
          </View>
          <Text style={[Typography.label, { color: Colors.molten, marginBottom: 8 }]}>MORNING RITUAL</Text>
          <Text style={Typography.heading1}>Morning Flow</Text>
          <Text style={[Typography.bodyMuted, { marginTop: 10, marginBottom: 20 }]}>
            Start with intention. Set your North Star for the next 24 hours. Lock in your mission before 9 AM and activate streak multipliers.
          </Text>
          <View style={styles.flowMeta}>
            <View style={styles.flowMetaItem}>
              <Text style={[Typography.label, { color: Colors.muted }]}>4 STEPS</Text>
            </View>
            <View style={styles.flowMetaItem}>
              <Text style={[Typography.label, { color: Colors.muted }]}>+100 XP</Text>
            </View>
            <View style={styles.flowMetaItem}>
              <Text style={[Typography.label, { color: Colors.muted }]}>~5 MIN</Text>
            </View>
          </View>
          <View style={styles.startButton}>
            <Text style={styles.startButtonText}>BEGIN MORNING FLOW →</Text>
          </View>
        </TouchableOpacity>

        {/* Evening Flow */}
        <TouchableOpacity
          style={[styles.flowCard, { borderColor: Colors.steel }]}
          onPress={() => setActiveFlow('evening')}
          activeOpacity={0.85}
        >
          <View style={[styles.flowIcon, { backgroundColor: Colors.faint }]}>
            <Text style={styles.flowIconText}>🌙</Text>
          </View>
          <Text style={[Typography.label, { color: Colors.gold, marginBottom: 8 }]}>EVENING RITUAL</Text>
          <Text style={Typography.heading1}>Evening Flow</Text>
          <Text style={[Typography.bodyMuted, { marginTop: 10, marginBottom: 20 }]}>
            Reflect without judgment. Archive wins. Process lessons. Close your loop before midnight to preserve streaks and earn reflection rewards.
          </Text>
          <View style={styles.flowMeta}>
            <View style={styles.flowMetaItem}>
              <Text style={[Typography.label, { color: Colors.muted }]}>4 STEPS</Text>
            </View>
            <View style={styles.flowMetaItem}>
              <Text style={[Typography.label, { color: Colors.muted }]}>+100 XP</Text>
            </View>
            <View style={styles.flowMetaItem}>
              <Text style={[Typography.label, { color: Colors.muted }]}>~5 MIN</Text>
            </View>
          </View>
          <View style={[styles.startButton, { borderColor: Colors.gold }]}>
            <Text style={[styles.startButtonText, { color: Colors.gold }]}>BEGIN EVENING FLOW →</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.charcoal },
  content: { padding: 24, paddingTop: 64, paddingBottom: 40 },

  // Flow active state
  flowContainer: { flex: 1, padding: 24, paddingTop: 60, paddingBottom: 32, backgroundColor: Colors.charcoal },
  flowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  flowProgressBar: {
    height: 3,
    backgroundColor: Colors.faint,
    borderRadius: 3,
    marginBottom: 40,
    overflow: 'hidden',
  },
  flowProgressFill: { height: '100%', borderRadius: 3 },
  flowBody: { flex: 1 },
  flowInput: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 24,
    backgroundColor: Colors.slate,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 140,
  },
  flowButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  flowButtonText: { color: Colors.white, fontSize: 15, fontWeight: '800', letterSpacing: 1 },

  // Flow cards
  flowCard: {
    backgroundColor: Colors.slate,
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: Colors.molten,
  },
  flowIcon: {
    width: 56,
    height: 56,
    backgroundColor: `${Colors.molten}20`,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  flowIconText: { fontSize: 28 },
  flowMeta: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  flowMetaItem: {
    backgroundColor: Colors.faint,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  startButton: {
    borderWidth: 1.5,
    borderColor: Colors.molten,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startButtonText: { color: Colors.molten, fontSize: 13, fontWeight: '800', letterSpacing: 1 },
});
