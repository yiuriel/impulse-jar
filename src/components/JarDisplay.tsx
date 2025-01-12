import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
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
  return (
    <View style={styles.jarContainer}>
      <View style={styles.jarIconContainer}>
        {goalAmount && goalAmount > 0 && (
          <View
            style={[
              styles.jarFill,
              {
                height: `${Math.floor(progress)}%`,
                backgroundColor: "#E8F5E9",
              },
            ]}
          />
        )}
        <FontAwesome6
          style={styles.jarIcon}
          name="jar"
          size={80}
          color="#2E7D32"
        />
      </View>
      <View style={styles.savingsContainer}>
        <Text style={styles.totalAmount}>${totalSaved.toFixed(2)}</Text>
        <Text style={styles.savedText}>Total Savings</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  jarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  jarIconContainer: {
    ...sharedStyles.card,
    width: 120,
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  jarFill: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 1,
  },
  jarIcon: {
    zIndex: 2,
  },
  savingsContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  totalAmount: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  savedText: {
    fontSize: 18,
    color: "#616161",
    fontWeight: "500",
  },
});
