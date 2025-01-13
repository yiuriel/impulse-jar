import React, { useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface ConfettiCelebrationProps {
  isExploding: boolean;
  onCheers: () => void;
}

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  isExploding,
  onCheers,
}) => {
  const confettiRef = useRef<ConfettiCannon>(null);
  const { width, height } = Dimensions.get("window");

  React.useEffect(() => {
    if (isExploding && confettiRef.current) {
      confettiRef.current.start();
    }
  }, [isExploding]);

  return (
    <View style={styles.container}>
      <ConfettiCannon
        ref={confettiRef}
        count={150}
        origin={{ x: width / 2, y: height * 0.7 }}
        autoStart={false}
        fadeOut={true}
        explosionSpeed={350}
        fallSpeed={5000}
        onAnimationEnd={onCheers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "box-none",
    zIndex: 1000,
  },
});
