import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
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
  return (
    <View style={[styles.card, sharedStyles.card]}>
      <Text style={styles.cardTitle}>Add New Saving</Text>
      <TextInput
        style={styles.input}
        placeholder="What did you resist buying?"
        placeholderTextColor="#9E9E9E"
        value={description}
        onChangeText={onDescriptionChange}
      />
      <TextInput
        style={styles.input}
        placeholder="How much did it cost?"
        placeholderTextColor="#9E9E9E"
        value={amount}
        onChangeText={onAmountChange}
        keyboardType="decimal-pad"
      />
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={onSubmit}
      >
        <Text style={styles.buttonText}>Save to Jar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
    color: "#212121",
  },
  button: {
    ...sharedStyles.card,
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
