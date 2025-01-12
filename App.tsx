import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { JarDisplay } from "./src/components/JarDisplay";
import { SavingForm } from "./src/components/SavingForm";
import { SavingsList } from "./src/components/SavingsList";
import { SavingsGoal } from "./src/components/SavingsGoal";
import { useSavings } from "./src/hooks/useSavings";

export default function App() {
  const {
    description,
    setDescription,
    amount,
    setAmount,
    savings,
    totalSaved,
    addSaving,
    goalAmount,
    setGoalAmount,
    savingsGoal,
    setGoal,
  } = useSavings();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style="dark" />

        <JarDisplay totalSaved={totalSaved} goalAmount={savingsGoal?.amount} />

        <SavingsGoal
          goalAmount={goalAmount}
          onGoalAmountChange={setGoalAmount}
          onSetGoal={setGoal}
          currentAmount={totalSaved}
          hasGoal={!!savingsGoal}
        />

        <SavingForm
          description={description}
          amount={amount}
          onDescriptionChange={setDescription}
          onAmountChange={setAmount}
          onSubmit={addSaving}
        />

        <SavingsList savings={savings} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
