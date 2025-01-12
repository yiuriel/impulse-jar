import React from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
} from "react-native";
import { JarDisplay } from "../components/JarDisplay";
import { SavingForm } from "../components/SavingForm";
import { SavingsList } from "../components/SavingsList";
import { JarList } from "../components/JarList";
import { useSavings } from "../context/SavingsContext";
import { useTheme } from "../context/ThemeContext";

export const HomeScreen = () => {
  const {
    description,
    setDescription,
    amount,
    setAmount,
    addSaving,
    selectedJar,
  } = useSavings();

  const { colors } = useTheme();

  const getProgress = () => {
    if (!selectedJar?.goalAmount) return 0;
    return (selectedJar.totalSaved / selectedJar.goalAmount) * 100;
  };

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
        <JarList />

        {selectedJar ? (
          <>
            <JarDisplay
              totalSaved={selectedJar.totalSaved}
              goalAmount={selectedJar.goalAmount || 0}
              progress={getProgress()}
            />

            <SavingForm
              description={description}
              amount={amount}
              onDescriptionChange={setDescription}
              onAmountChange={setAmount}
              onSubmit={addSaving}
            />

            <SavingsList savings={selectedJar.savings} />
          </>
        ) : (
          <View style={styles.noJarContainer}>
            <Text style={[styles.noJarText, { color: colors.textSecondary }]}>
              Create a jar to start saving!
            </Text>
          </View>
        )}
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
  noJarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  noJarText: {
    fontSize: 16,
  },
});
