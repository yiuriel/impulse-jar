import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useSavings } from "../context/SavingsContext";
import { styles as sharedStyles } from "../styles/shared";

interface JarDisplayProps {
  totalSaved: number;
  goalAmount: number;
  progress: number;
}

export const JarDisplay: React.FC<JarDisplayProps> = ({
  totalSaved,
  goalAmount,
  progress,
}) => {
  const { colors } = useTheme();
  const { selectedJar, updateJar } = useSavings();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(selectedJar?.name || "");
  const [editDescription, setEditDescription] = useState(selectedJar?.description || "");
  const [editGoalAmount, setEditGoalAmount] = useState(goalAmount ? goalAmount.toString() : "");

  const handleEditPress = () => {
    setEditName(selectedJar?.name || "");
    setEditDescription(selectedJar?.description || "");
    setEditGoalAmount(goalAmount ? goalAmount.toString() : "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedJar) return;

    if (!editName.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    const updates: any = {
      name: editName.trim(),
      description: editDescription.trim(),
    };

    if (editGoalAmount) {
      const parsedGoal = parseFloat(editGoalAmount);
      if (isNaN(parsedGoal) || parsedGoal <= 0) {
        Alert.alert("Error", "Please enter a valid goal amount");
        return;
      }
      updates.goalAmount = parsedGoal;
    }

    await updateJar(selectedJar.id, updates);
    setIsEditing(false);
  };

  if (!selectedJar) return null;

  return (
    <View
      style={[
        styles.container,
        sharedStyles.card,
        { backgroundColor: colors.card },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            {selectedJar.name}
          </Text>
          {selectedJar.description && (
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
            >
              {selectedJar.description}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
          <FontAwesome6 name="pencil" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: colors.primary }]}>
          ${totalSaved.toFixed(2)}
        </Text>
        {goalAmount > 0 && (
          <Text style={[styles.goalAmount, { color: colors.textSecondary }]}>
            / ${goalAmount.toFixed(2)}
          </Text>
        )}
      </View>

      {goalAmount > 0 && (
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBar, { backgroundColor: colors.border }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <Text
            style={[styles.progressText, { color: colors.textSecondary }]}
          >
            {Math.floor(progress)}% of goal
          </Text>
        </View>
      )}

      <Modal
        visible={isEditing}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Jar Details
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text },
              ]}
              placeholder="Name"
              placeholderTextColor={colors.textSecondary}
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text },
              ]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.textSecondary}
              value={editDescription}
              onChangeText={setEditDescription}
              multiline
            />
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text },
              ]}
              placeholder="Goal Amount (optional)"
              placeholderTextColor={colors.textSecondary}
              value={editGoalAmount}
              onChangeText={setEditGoalAmount}
              keyboardType="decimal-pad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Text style={{ color: "white" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
  },
  goalAmount: {
    fontSize: 20,
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
