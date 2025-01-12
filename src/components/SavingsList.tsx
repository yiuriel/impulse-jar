import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SavingItem } from "../types";
import { styles as sharedStyles } from "../styles/shared";

interface SavingsListProps {
  savings: SavingItem[];
}

export const SavingsList: React.FC<SavingsListProps> = ({ savings }) => {
  return (
    <View style={[styles.historyContainer, sharedStyles.card]}>
      <Text style={styles.historyTitle}>Savings History</Text>
      {savings
        .slice()
        .reverse()
        .map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <View style={styles.historyContent}>
              <Text style={styles.historyDescription}>{item.description}</Text>
              <Text style={styles.historyDate}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.historyAmount}>${item.amount.toFixed(2)}</Text>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    padding: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  historyContent: {
    flex: 1,
    marginRight: 12,
  },
  historyDescription: {
    fontSize: 16,
    color: "#212121",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: "#9E9E9E",
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
});
