import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { JarDisplay } from "./src/components/JarDisplay";
import { SavingForm } from "./src/components/SavingForm";
import { SavingsList } from "./src/components/SavingsList";
import { SavingsGoal } from "./src/components/SavingsGoal";
import { SavingsProvider } from "./src/context/SavingsContext";
import { HomeScreen } from "./src/screens/HomeScreen";
import { GoalsScreen } from "./src/screens/GoalsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SavingsProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#2E7D32",
            tabBarInactiveTintColor: "#9E9E9E",
            tabBarStyle: {
              backgroundColor: "#FFFFFF",
              borderTopWidth: 1,
              borderTopColor: "#F5F5F5",
              paddingBottom: 5,
              paddingTop: 5,
            },
            headerStyle: {
              backgroundColor: "#FFFFFF",
            },
            headerTitleStyle: {
              color: "#212121",
              fontSize: 18,
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome6 name="jar" size={size} color={color} />
              ),
              title: "Savings Jar",
            }}
          />
          <Tab.Screen
            name="Goals"
            component={GoalsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome6 name="bullseye" size={size} color={color} />
              ),
              title: "Savings Goals",
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SavingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  mainScrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
});
