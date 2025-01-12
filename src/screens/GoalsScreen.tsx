import React from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SavingsGoal } from "../components/SavingsGoal";
import { useSavings } from "../hooks/useSavings";

export const GoalsScreen = () => {
  const {
    goalAmount,
    setGoalAmount,
    savingsGoal,
    setGoal,
    totalSaved,
  } = useSavings();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
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
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  mainScrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
});
