import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SavingsGoal } from "../components/SavingsGoal";
import { useSavings } from "../context/SavingsContext";
import { useTheme } from "../context/ThemeContext";

export const GoalsScreen = () => {
  const {
    goalAmount,
    setGoalAmount,
    savingsGoal,
    setGoal,
    totalSaved,
    progress,
  } = useSavings();

  const { colors } = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <SavingsGoal
          goalAmount={goalAmount}
          onGoalAmountChange={setGoalAmount}
          onSetGoal={setGoal}
          currentAmount={totalSaved}
          hasGoal={!!savingsGoal}
          progress={progress}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainScrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: Platform.OS === "ios" ? 16 : 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
});
