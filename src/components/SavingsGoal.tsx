import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { styles as sharedStyles } from "../styles/shared";
import { FontAwesome6 } from "@expo/vector-icons";

interface SavingsGoalProps {
  goalAmount: string;
  onGoalAmountChange: (text: string) => void;
  onSetGoal: () => void;
  currentAmount: number;
  hasGoal: boolean;
  progress: number;
}

export const SavingsGoal: React.FC<SavingsGoalProps> = ({
  goalAmount,
  onGoalAmountChange,
  onSetGoal,
  currentAmount,
  hasGoal,
  progress,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = () => {
    setIsEditing(false);
    onSetGoal();
  };

  return (
    <View style={[styles.container, sharedStyles.card]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Savings Goal</Text>
        {hasGoal && !isEditing && (
          <TouchableOpacity
            onPress={handleEditPress}
            style={styles.editButton}
          >
            <FontAwesome6 name="pencil" size={16} color="#2E7D32" />
          </TouchableOpacity>
        )}
      </View>

      {(isEditing || !hasGoal) ? (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter your savings goal"
            placeholderTextColor="#9E9E9E"
            value={goalAmount}
            onChangeText={onGoalAmountChange}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleSavePress}
          >
            <Text style={styles.buttonText}>
              {hasGoal ? "Update Goal" : "Set Goal"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.floor(progress)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            ${currentAmount.toFixed(2)} of ${parseFloat(goalAmount).toFixed(2)}
          </Text>
          <Text style={styles.progressPercentage}>
            {progress.toFixed(1)}% Complete
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212121",
  },
  editButton: {
    padding: 8,
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
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  progressContainer: {
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 12,
    backgroundColor: "#E8F5E9",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2E7D32",
  },
  progressText: {
    fontSize: 16,
    color: "#212121",
    marginBottom: 4,
  },
  progressPercentage: {
    fontSize: 14,
    color: "#616161",
  },
});
