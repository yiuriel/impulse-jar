import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { styles as sharedStyles } from "../styles/shared";

interface JarDisplayProps {
  totalSaved: number;
  goalAmount?: number;
  progress: number;
}

export const JarDisplay: React.FC<JarDisplayProps> = ({
  totalSaved,
  goalAmount,
  progress,
}) => {
  const { colors } = useTheme();

  const getJarFillHeight = (): DimensionValue => {
    if (!goalAmount) return "30%";
    const percentage = Math.min((totalSaved / goalAmount) * 100, 100);
    return `${Math.max(percentage, 5)}%`;
  };

  return (
    <View
      style={[
        styles.container,
        sharedStyles.card,
        { backgroundColor: colors.card },
      ]}
    >
      <View style={styles.jarContainer}>
        <View style={[styles.jar, { borderColor: colors.primary }]}>
          <View
            style={[
              styles.jarFill,
              {
                height: getJarFillHeight(),
                backgroundColor: colors.primary,
                opacity: 0.3,
              },
            ]}
          />
        </View>
        <View style={styles.iconContainer}>
          <FontAwesome6 name="jar" size={100} color={colors.primary} />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.amount, { color: colors.text }]}>
          ${totalSaved.toFixed(2)}
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Total Saved
        </Text>
        {goalAmount && (
          <Text style={[styles.goal, { color: colors.textSecondary }]}>
            Goal: ${goalAmount.toFixed(2)} ({progress.toFixed(1)}%)
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  jarContainer: {
    width: 120,
    height: 120,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "100%",
  },
  jar: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderWidth: 3,
    borderRadius: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  jarFill: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
    fontWeight: "bold",
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  goal: {
    fontSize: 14,
  },
});
