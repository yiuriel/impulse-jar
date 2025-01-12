import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { styles as sharedStyles } from "../styles/shared";

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
  const { colors } = useTheme();

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = () => {
    setIsEditing(false);
    onSetGoal();
  };

  return (
    <View
      style={[
        styles.container,
        sharedStyles.card,
        { backgroundColor: colors.card },
      ]}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Savings Goal</Text>
        {hasGoal && !isEditing && (
          <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
            <FontAwesome6 name="pencil" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {isEditing || !hasGoal ? (
        <View>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            placeholder="Enter your savings goal"
            placeholderTextColor={colors.textSecondary}
            value={goalAmount}
            onChangeText={onGoalAmountChange}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
            onPress={handleSavePress}
          >
            <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
              {hasGoal ? "Update Goal" : "Set Goal"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBar, { backgroundColor: colors.border }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.floor(progress)}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.text }]}>
            ${currentAmount.toFixed(2)} of ${parseFloat(goalAmount).toFixed(2)}
          </Text>
          <Text
            style={[styles.progressPercentage, { color: colors.textSecondary }]}
          >
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
    fontSize: 18,
    fontWeight: "600",
  },
  editButton: {
    padding: 8,
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
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  progressPercentage: {
    fontSize: 14,
  },
});
