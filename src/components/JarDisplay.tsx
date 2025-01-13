import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  DimensionValue,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useSavings } from "../context/SavingsContext";
import { styles as sharedStyles } from "../styles/shared";
import { ConfettiCelebration } from "./ConfettiCelebration";

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
  const [isExploding, setIsExploding] = useState(false);
  const [editName, setEditName] = useState(selectedJar?.name || "");
  const [editDescription, setEditDescription] = useState(
    selectedJar?.description || ""
  );
  const [editGoalAmount, setEditGoalAmount] = useState(
    goalAmount ? goalAmount.toString() : ""
  );

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

  const handleCheers = () => {
    setIsExploding(true);
  };

  useEffect(() => {
    if (goalAmount && totalSaved >= goalAmount && !isExploding) {
      handleCheers();
    }
  }, [totalSaved, goalAmount]);

  const getJarFillHeight = (): DimensionValue => {
    if (!goalAmount) return "30%";
    const percentage = Math.min((totalSaved / goalAmount) * 100, 100);
    return `${Math.max(percentage, 5)}%`;
  };

  if (!selectedJar) return null;

  return (
    <>
      <View
        style={[
          styles.container,
          sharedStyles.card,
          { backgroundColor: colors.card },
        ]}
      >
        <ConfettiCelebration
          isExploding={isExploding}
          onCheers={() => setIsExploding(false)}
        />
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

        <View style={styles.jarContainer}>
          <View style={[styles.jar, { borderColor: colors.primary }]}>
            <View
              style={[
                styles.jarFill,
                {
                  height: getJarFillHeight(),
                  backgroundColor: colors.primary,
                  opacity: Math.min(
                    Math.max(0.25 + (totalSaved / goalAmount) * 0.7, 0.25),
                    0.7
                  ),
                },
              ]}
            />
          </View>
          <View style={styles.iconContainer}>
            <FontAwesome6 name="jar" size={100} color={colors.primary} />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text style={[styles.amount, { color: colors.primary }]}>
              ${totalSaved.toFixed(2)}
            </Text>
            {goalAmount > 0 && (
              <Text
                style={[styles.goalAmount, { color: colors.textSecondary }]}
              >
                / ${goalAmount.toFixed(2)}
              </Text>
            )}
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {goalAmount > 0
              ? `${Math.floor(progress)}% of goal`
              : "No goal set"}
          </Text>
        </View>

        <Modal
          visible={isEditing}
          transparent
          animationType="slide"
          onRequestClose={() => setIsEditing(false)}
        >
          <View style={styles.modalContainer}>
            <View
              style={[styles.modalContent, { backgroundColor: colors.card }]}
            >
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
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.border },
                  ]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={{ color: colors.text }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSave}
                >
                  <Text style={{ color: "white" }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
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
  jarContainer: {
    width: 120,
    height: 120,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  jar: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderWidth: 3,
    borderRadius: 60,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  jarFill: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  iconContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  infoContainer: {
    alignItems: "center",
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
  },
  goalAmount: {
    fontSize: 30,
  },
  progressText: {
    fontSize: 14,
    marginTop: 4,
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
