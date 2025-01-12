import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavingItem, SavingsGoal } from "../types";
import { Alert } from "react-native";

export const useSavings = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [savings, setSavings] = useState<SavingItem[]>([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const [goalAmount, setGoalAmount] = useState("");
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);

  useEffect(() => {
    loadSavings();
    loadSavingsGoal();
  }, []);

  const loadSavings = async () => {
    try {
      const savedData = await AsyncStorage.getItem("savings");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setSavings(parsedData);
        calculateTotal(parsedData);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load savings");
    }
  };

  const loadSavingsGoal = async () => {
    try {
      const goalData = await AsyncStorage.getItem("savingsGoal");
      if (goalData) {
        const parsedGoal = JSON.parse(goalData);
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

  const addSaving = async () => {
    console.log(description, amount);

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
      await AsyncStorage.setItem("savings", JSON.stringify(updatedSavings));
      setSavings(updatedSavings);
      calculateTotal(updatedSavings);
      setDescription("");
      setAmount("");
    } catch (error) {
      Alert.alert("Error", "Failed to save item");
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
      await AsyncStorage.setItem("savingsGoal", JSON.stringify(goal));
      setSavingsGoal(goal);
    } catch (error) {
      Alert.alert("Error", "Failed to save goal");
    }
  };

  return {
    description,
    setDescription,
    amount,
    setAmount,
    savings,
    totalSaved,
    addSaving,
    goalAmount,
    setGoalAmount,
    savingsGoal,
    setGoal,
  };
};
