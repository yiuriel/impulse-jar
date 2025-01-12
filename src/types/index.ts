export interface SavingItem {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface SavingsJar {
  id: string;
  name: string;
  description: string;
  goalAmount: number | null;
  savings: SavingItem[];
  totalSaved: number;
  createdAt: string;
}
