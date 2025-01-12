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
import { JarListItem } from "./JarListItem";

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

  const renderJarItem = ({ item }: { item: SavingsJar }) => (
    <JarListItem
      jar={item}
      isSelected={item.id === selectedJarId}
      onSelect={selectJar}
      onEditGoal={handleEditGoal}
      onDelete={handleDeleteJar}
    />
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
              keyboardType="numeric"
              inputMode="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => setIsModalVisible(false)}
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
              Edit Goal Amount
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
