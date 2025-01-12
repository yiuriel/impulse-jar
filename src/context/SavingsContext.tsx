import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import { SavingItem, SavingsJar } from "../types";

const JARS_KEY = "@savings_jars";

interface SavingsContextType {
  jars: SavingsJar[];
  selectedJarId: string | null;
  selectedJar: SavingsJar | null;
  description: string;
  setDescription: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  addSaving: () => Promise<void>;
  deleteSaving: (id: string) => Promise<void>;
  addJar: (name: string, description: string, goalAmount?: number) => Promise<void>;
  deleteJar: (id: string) => Promise<void>;
  selectJar: (id: string) => void;
  updateJarGoal: (jarId: string, goalAmount: number) => Promise<void>;
  updateJar: (jarId: string, updates: Partial<SavingsJar>) => Promise<void>;
}

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export const SavingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [jars, setJars] = useState<SavingsJar[]>([]);
  const [selectedJarId, setSelectedJarId] = useState<string | null>(null);

  useEffect(() => {
    loadJars();
  }, []);

  useEffect(() => {
    if (jars.length > 0 && !selectedJarId) {
      setSelectedJarId(jars[0].id);
    }
  }, [jars]);

  const loadJars = async () => {
    try {
      const savedJars = await AsyncStorage.getItem(JARS_KEY);
      if (savedJars) {
        const parsedJars = JSON.parse(savedJars);
        setJars(parsedJars);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load savings jars");
    }
  };

  const selectedJar = selectedJarId 
    ? jars.find(jar => jar.id === selectedJarId) || null 
    : null;

  const addJar = async (name: string, description: string, goalAmount?: number) => {
    if (!name) {
      Alert.alert("Error", "Please provide a name for the jar");
      return;
    }

    const newJar: SavingsJar = {
      id: Date.now().toString(),
      name,
      description,
      goalAmount: goalAmount || null,
      savings: [],
      totalSaved: 0,
      createdAt: new Date().toISOString(),
    };

    const updatedJars = [...jars, newJar];
    try {
      await AsyncStorage.setItem(JARS_KEY, JSON.stringify(updatedJars));
      setJars(updatedJars);
      if (!selectedJarId) {
        setSelectedJarId(newJar.id);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create new jar");
    }
  };

  const deleteJar = async (id: string) => {
    const updatedJars = jars.filter(jar => jar.id !== id);
    try {
      await AsyncStorage.setItem(JARS_KEY, JSON.stringify(updatedJars));
      setJars(updatedJars);
      if (selectedJarId === id) {
        setSelectedJarId(updatedJars[0]?.id || null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete jar");
    }
  };

  const updateJarGoal = async (jarId: string, goalAmount: number) => {
    const updatedJars = jars.map(jar => 
      jar.id === jarId 
        ? { ...jar, goalAmount } 
        : jar
    );

    try {
      await AsyncStorage.setItem(JARS_KEY, JSON.stringify(updatedJars));
      setJars(updatedJars);
    } catch (error) {
      Alert.alert("Error", "Failed to update jar goal");
    }
  };

  const updateJar = async (jarId: string, updates: Partial<SavingsJar>) => {
    const jarIndex = jars.findIndex(jar => jar.id === jarId);
    if (jarIndex === -1) {
      Alert.alert("Error", "Jar not found");
      return;
    }

    const updatedJar = {
      ...jars[jarIndex],
      ...updates,
    };

    const updatedJars = [...jars];
    updatedJars[jarIndex] = updatedJar;

    try {
      await AsyncStorage.setItem(JARS_KEY, JSON.stringify(updatedJars));
      setJars(updatedJars);
    } catch (error) {
      Alert.alert("Error", "Failed to update jar");
    }
  };

  const selectJar = (id: string) => {
    setSelectedJarId(id);
  };

  const addSaving = async () => {
    if (!selectedJar) {
      Alert.alert("Error", "Please select a jar first");
      return;
    }

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

    const updatedJar = {
      ...selectedJar,
      savings: [...selectedJar.savings, newItem],
      totalSaved: selectedJar.totalSaved + numAmount,
    };

    const updatedJars = jars.map(jar => 
      jar.id === selectedJar.id ? updatedJar : jar
    );

    try {
      await AsyncStorage.setItem(JARS_KEY, JSON.stringify(updatedJars));
      setJars(updatedJars);
      setDescription("");
      setAmount("");
    } catch (error) {
      Alert.alert("Error", "Failed to save item");
    }
  };

  const deleteSaving = async (savingId: string) => {
    if (!selectedJar) return;

    const savingToDelete = selectedJar.savings.find(s => s.id === savingId);
    if (!savingToDelete) return;

    const updatedJar = {
      ...selectedJar,
      savings: selectedJar.savings.filter(s => s.id !== savingId),
      totalSaved: selectedJar.totalSaved - savingToDelete.amount,
    };

    const updatedJars = jars.map(jar => 
      jar.id === selectedJar.id ? updatedJar : jar
    );

    try {
      await AsyncStorage.setItem(JARS_KEY, JSON.stringify(updatedJars));
      setJars(updatedJars);
    } catch (error) {
      Alert.alert("Error", "Failed to delete saving");
    }
  };

  return (
    <SavingsContext.Provider
      value={{
        jars,
        selectedJarId,
        selectedJar,
        description,
        setDescription,
        amount,
        setAmount,
        addSaving,
        deleteSaving,
        addJar,
        deleteJar,
        selectJar,
        updateJarGoal,
        updateJar,
      }}
    >
      {children}
    </SavingsContext.Provider>
  );
};

export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (context === undefined) {
    throw new Error("useSavings must be used within a SavingsProvider");
  }
  return context;
};
