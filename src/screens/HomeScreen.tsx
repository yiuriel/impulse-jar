import React from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { JarDisplay } from "../components/JarDisplay";
import { SavingForm } from "../components/SavingForm";
import { SavingsList } from "../components/SavingsList";
import { useSavings } from "../hooks/useSavings";

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
        <JarDisplay totalSaved={totalSaved} goalAmount={savingsGoal?.amount} />

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
