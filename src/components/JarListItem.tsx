import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { SavingsJar } from "../types";
import { useTheme } from "../context/ThemeContext";

interface JarListItemProps {
  jar: SavingsJar;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEditGoal: (jar: SavingsJar) => void;
  onDelete: (id: string) => void;
}

export const JarListItem: React.FC<JarListItemProps> = ({
  jar,
  isSelected,
  onSelect,
  onEditGoal,
  onDelete,
}) => {
  const { colors } = useTheme();

  const getProgress = (jar: SavingsJar) => {
    if (!jar.goalAmount) return 0;
    return (jar.totalSaved / jar.goalAmount) * 100;
  };

  return (
    <TouchableOpacity
      style={[
        styles.jarItem,
        {
          backgroundColor: colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}
      onPress={() => onSelect(jar.id)}
    >
      <View style={styles.jarActions}>
        <Text style={[styles.jarName, { color: colors.text }]}>
          {jar.name}
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.background }]}
            onPress={() => onEditGoal(jar)}
          >
            <FontAwesome6 name="bullseye" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.background }]}
            onPress={() => onDelete(jar.id)}
          >
            <FontAwesome6 name="trash" size={16} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.jarInfo}>
        <Text style={[styles.jarDescription, { color: colors.textSecondary }]}>
          {jar.description}
        </Text>
        <Text style={[styles.jarAmount, { color: colors.primary }]}>
          ${jar.totalSaved.toFixed(2)}
        </Text>
        {jar.goalAmount && (
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(getProgress(jar), 100)}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  jarItem: {
    width: 200,
    marginRight: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    position: "relative",
  },
  jarInfo: {
    marginTop: 8,
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
    fontSize: 20,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
});
