import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { styles as sharedStyles } from "../styles/shared";

interface SavingFormProps {
  description: string;
  amount: string;
  onDescriptionChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onSubmit: () => void;
}

export const SavingForm: React.FC<SavingFormProps> = ({
  description,
  amount,
  onDescriptionChange,
  onAmountChange,
  onSubmit,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        sharedStyles.card,
        { backgroundColor: colors.card },
      ]}
    >
      <Text style={styles.cardTitle}>Add New Saving</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
        placeholder="What did you resist buying?"
        placeholderTextColor={colors.textSecondary}
        value={description}
        onChangeText={onDescriptionChange}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
        placeholder="How much did it cost?"
        placeholderTextColor={colors.textSecondary}
        value={amount}
        onChangeText={onAmountChange}
        keyboardType="numeric"
        inputMode="numeric"
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        activeOpacity={0.8}
        onPress={onSubmit}
      >
        <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
          Save to Jar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#cccccc",
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
