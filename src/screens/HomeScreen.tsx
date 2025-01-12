import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { JarDisplay } from "../components/JarDisplay";
import { SavingForm } from "../components/SavingForm";
import { SavingsList } from "../components/SavingsList";
import { useSavings } from "../context/SavingsContext";
import { useTheme } from "../context/ThemeContext";

export const HomeScreen = () => {
  const {
    description,
    setDescription,
    amount,
    setAmount,
    savings,
    totalSaved,
    addSaving,
    savingsGoal,
    progress,
  } = useSavings();

  const { colors } = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <JarDisplay
          totalSaved={totalSaved}
          goalAmount={savingsGoal?.amount}
          progress={progress}
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
