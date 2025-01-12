import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavingItem, SavingsGoal } from "../types";
import { Alert } from "react-native";

const SAVINGS_KEY = "@savings";
const GOAL_KEY = "@savings_goal";

interface SavingsContextType {
  description: string;
  setDescription: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  savings: SavingItem[];
  totalSaved: number;
  addSaving: () => Promise<void>;
  deleteSaving: (id: string) => Promise<void>;
  goalAmount: string;
  setGoalAmount: (value: string) => void;
  savingsGoal: SavingsGoal | null;
  setGoal: () => Promise<void>;
  progress: number;
}

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export const SavingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [savings, setSavings] = useState<SavingItem[]>([]);
  const [goalAmount, setGoalAmount] = useState("");
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);
  const [totalSaved, setTotalSaved] = useState(0);

  useEffect(() => {
    loadSavings();
    loadGoal();
  }, []);

  const loadSavings = async () => {
    try {
      const savedSavings = await AsyncStorage.getItem(SAVINGS_KEY);
      if (savedSavings) {
        const parsedData = JSON.parse(savedSavings);
        setSavings(parsedData);
        calculateTotal(parsedData);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load savings");
    }
  };

  const loadGoal = async () => {
    try {
      const savedGoal = await AsyncStorage.getItem(GOAL_KEY);
      if (savedGoal) {
        const parsedGoal = JSON.parse(savedGoal);
        setSavingsGoal(parsedGoal);
        setGoalAmount(parsedGoal.amount.toString());
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load savings goal");
    }
  };

  const calculateTotal = (items: SavingItem[]) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalSaved(total);
  };

  const progress = savingsGoal ? (totalSaved / savingsGoal.amount) * 100 : 0;

  const addSaving = async () => {
    if (!description || !amount) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const newItem: SavingItem = {
      id: Date.now().toString(),
      description,
      amount: numAmount,
      date: new Date().toISOString(),
    };

    const updatedSavings = [...savings, newItem];
    try {
      await AsyncStorage.setItem(SAVINGS_KEY, JSON.stringify(updatedSavings));
      setSavings(updatedSavings);
      calculateTotal(updatedSavings);
      setDescription("");
      setAmount("");
    } catch (error) {
      Alert.alert("Error", "Failed to save item");
    }
  };

  const deleteSaving = async (id: string) => {
    try {
      const updatedSavings = savings.filter(item => item.id !== id);
      await AsyncStorage.setItem(SAVINGS_KEY, JSON.stringify(updatedSavings));
      setSavings(updatedSavings);
      calculateTotal(updatedSavings);
      Alert.alert("Success", "Item deleted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to delete item");
    }
  };

  const setGoal = async () => {
    if (!goalAmount) {
      Alert.alert("Error", "Please enter a goal amount");
      return;
    }

    const numGoal = parseFloat(goalAmount);
    if (isNaN(numGoal) || numGoal <= 0) {
      Alert.alert("Error", "Please enter a valid goal amount");
      return;
    }

    const goal: SavingsGoal = {
      amount: numGoal,
      date: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem(GOAL_KEY, JSON.stringify(goal));
      setSavingsGoal(goal);
    } catch (error) {
      Alert.alert("Error", "Failed to save goal");
    }
  };

  const value = {
    description,
    setDescription,
    amount,
    setAmount,
    savings,
    totalSaved,
    addSaving,
    deleteSaving,
    goalAmount,
    setGoalAmount,
    savingsGoal,
    setGoal,
    progress,
  };

  return <SavingsContext.Provider value={value}>{children}</SavingsContext.Provider>;
};

export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (context === undefined) {
    throw new Error("useSavings must be used within a SavingsProvider");
  }
  return context;
};
