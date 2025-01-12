import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { styles as sharedStyles } from "../styles/shared";
import { SavingItem } from "../types";
import { useTheme } from "../context/ThemeContext";
import { useSavings } from "../context/SavingsContext";
import { FontAwesome6 } from "@expo/vector-icons";

interface SavingsListProps {
  savings: SavingItem[];
}

export const SavingsList: React.FC<SavingsListProps> = ({ savings }) => {
  const { colors } = useTheme();
  const { deleteSaving } = useSavings();

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Saving",
      "Are you sure you want to delete this saving?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteSaving(id),
          style: "destructive",
        },
      ]
    );
  };

  const renderSavingItem = (item: SavingItem) => (
    <View
      key={item.id}
      style={[
        styles.item,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.itemContent}>
        <Text style={[styles.description, { color: colors.text }]}>
          {item.description}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.amount, { color: colors.primary }]}>
          ${item.amount.toFixed(2)}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <FontAwesome6 
            name="trash-can" 
            size={16} 
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Savings History
      </Text>
      <View style={styles.listContainer}>
        {savings.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No savings yet. Start saving today!
          </Text>
        ) : (
          savings.slice().reverse().map(renderSavingItem)
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  itemContent: {
    flex: 1,
    marginRight: 16,
  },
  rightContent: {
    alignItems: "flex-end",
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  deleteButton: {
    padding: 4,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 24,
  },
});
