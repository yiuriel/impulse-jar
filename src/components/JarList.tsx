import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSavings } from "../context/SavingsContext";
import { useTheme } from "../context/ThemeContext";
import { SavingsJar } from "../types";

export const JarList = () => {
  const { colors } = useTheme();
  const { jars, selectedJarId, selectJar, addJar, deleteJar, updateJarGoal } =
    useSavings();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newJarName, setNewJarName] = useState("");
  const [newJarDescription, setNewJarDescription] = useState("");
  const [newJarGoal, setNewJarGoal] = useState("");
  const [editingJar, setEditingJar] = useState<SavingsJar | null>(null);
  const [goalAmount, setGoalAmount] = useState("");

  const handleAddJar = async () => {
    if (!newJarName.trim()) {
      Alert.alert("Error", "Please enter a jar name");
      return;
    }

    const goalAmount = newJarGoal ? parseFloat(newJarGoal) : undefined;
    if (newJarGoal && (isNaN(goalAmount!) || goalAmount! <= 0)) {
      Alert.alert("Error", "Please enter a valid goal amount");
      return;
    }

    await addJar(newJarName.trim(), newJarDescription.trim(), goalAmount);
    setNewJarName("");
    setNewJarDescription("");
    setNewJarGoal("");
    setIsModalVisible(false);
  };

  const handleDeleteJar = (id: string) => {
    Alert.alert(
      "Delete Jar",
      "Are you sure you want to delete this jar? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteJar(id),
        },
      ]
    );
  };

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

  const renderJarItem = ({ item }: { item: SavingsJar }) => (
    <TouchableOpacity
      style={[
        styles.jarItem,
        {
          backgroundColor: colors.card,
          borderColor:
            item.id === selectedJarId ? colors.primary : colors.border,
        },
      ]}
      onPress={() => selectJar(item.id)}
    >
      <View style={styles.jarItemContent}>
        <View style={styles.jarInfo}>
          <Text style={[styles.jarName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text
            style={[styles.jarDescription, { color: colors.textSecondary }]}
          >
            {item.description}
          </Text>
          <Text style={[styles.jarAmount, { color: colors.primary }]}>
            ${item.totalSaved.toFixed(2)}
          </Text>
          {item.goalAmount && (
            <View
              style={[styles.progressBar, { backgroundColor: colors.border }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(getProgress(item), 100)}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          )}
        </View>
        <View style={styles.jarActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditGoal(item)}
          >
            <FontAwesome6 name="bullseye" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteJar(item.id)}
          >
            <FontAwesome6 name="trash" size={16} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          My Savings Jars
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setIsModalVisible(true)}
        >
          <FontAwesome6 name="plus" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={jars}
        renderItem={renderJarItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.jarList}
      />

      {/* Add Jar Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create New Jar
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text },
              ]}
              placeholder="Jar Name"
              placeholderTextColor={colors.textSecondary}
              value={newJarName}
              onChangeText={setNewJarName}
            />
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text },
              ]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.textSecondary}
              value={newJarDescription}
              onChangeText={setNewJarDescription}
            />
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text },
              ]}
              placeholder="Goal Amount (optional)"
              placeholderTextColor={colors.textSecondary}
              value={newJarGoal}
              onChangeText={setNewJarGoal}
              keyboardType="decimal-pad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => {
                  setIsModalVisible(false);
                  setNewJarName("");
                  setNewJarDescription("");
                  setNewJarGoal("");
                }}
              >
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleAddJar}
              >
                <Text style={{ color: "white" }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Goal Modal */}
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
              keyboardType="decimal-pad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => setEditingJar(null)}
              >
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.primary },
                ]}
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
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  jarList: {
    paddingRight: 16,
  },
  jarItem: {
    width: 200,
    marginRight: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
  },
  jarItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  jarInfo: {
    flex: 1,
  },
  jarName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  jarDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  jarAmount: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  jarActions: {
    justifyContent: "space-between",
  },
  actionButton: {
    padding: 8,
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
