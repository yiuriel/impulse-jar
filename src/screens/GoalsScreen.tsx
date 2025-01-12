import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSavings } from "../context/SavingsContext";
import { useTheme } from "../context/ThemeContext";
import { SavingsJar } from "../types";

export const GoalsScreen = () => {
  const { colors } = useTheme();
  const { jars, updateJarGoal } = useSavings();
  const [editingJar, setEditingJar] = useState<SavingsJar | null>(null);
  const [goalAmount, setGoalAmount] = useState("");

  const handleEditGoal = (jar: SavingsJar) => {
    setEditingJar(jar);
    setGoalAmount(jar.goalAmount?.toString() || "");
  };

  const handleSaveGoal = async () => {
    if (!editingJar) return;

    const amount = parseFloat(goalAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    await updateJarGoal(editingJar.id, amount);
    setEditingJar(null);
    setGoalAmount("");
  };

  const getProgress = (jar: SavingsJar) => {
    if (!jar.goalAmount) return 0;
    return (jar.totalSaved / jar.goalAmount) * 100;
  };

  const renderJarItem = ({ item }: { item: SavingsJar }) => {
    const progress = getProgress(item);
    const hasGoal = item.goalAmount !== null;

    return (
      <View
        style={[
          styles.jarItem,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.jarHeader}>
          <View>
            <Text style={[styles.jarName, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.jarDescription, { color: colors.textSecondary }]}>
              {item.description}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditGoal(item)}
          >
            <FontAwesome6
              name={hasGoal ? "pencil" : "plus"}
              size={16}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.goalInfo}>
          <Text style={[styles.savedAmount, { color: colors.primary }]}>
            ${item.totalSaved.toFixed(2)}
          </Text>
          {hasGoal && (
            <Text style={[styles.goalAmount, { color: colors.textSecondary }]}>
              of ${item.goalAmount?.toFixed(2)}
            </Text>
          )}
        </View>

        {hasGoal && (
          <>
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
              {progress.toFixed(1)}% Complete
            </Text>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={jars}
        renderItem={renderJarItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        visible={!!editingJar}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingJar(null)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Set Goal for {editingJar?.name}
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text },
              ]}
              placeholder="Goal Amount"
              placeholderTextColor={colors.textSecondary}
              value={goalAmount}
              onChangeText={setGoalAmount}
              keyboardType="numeric"
              inputMode="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => setEditingJar(null)}
              >
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveGoal}
              >
                <Text style={{ color: "white" }}>Save Goal</Text>
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
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  jarItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  jarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  jarName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  jarDescription: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  goalInfo: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  savedAmount: {
    fontSize: 24,
    fontWeight: "700",
    marginRight: 8,
  },
  goalAmount: {
    fontSize: 16,
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
  },
  modalButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
});
