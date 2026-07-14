/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Expense, ExpenseCategory, SimulatedTransaction, SavingsGoal, 
  FinancialScoreBreakdown, AgentRun, Coupon, FashionPost, 
  FoodRestaurant, Achievement, NotificationItem, UserProfile, CartItem
} from '../types';
import { 
  INITIAL_PROFILE, INITIAL_EXPENSES, INITIAL_SAVINGS_GOALS, 
  INITIAL_ACHIEVEMENTS, INITIAL_NOTIFICATIONS, MOCK_COUPONS 
} from '../data';

interface FinancialContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Expense;
  deleteExpense: (id: string) => void;
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'savedAmount' | 'status'>) => void;
  addMoneyToGoal: (goalId: string, amount: number) => void;
  transactions: SimulatedTransaction[];
  addSimulatedTransaction: (tx: Omit<SimulatedTransaction, 'id' | 'createdAt' | 'status'>) => SimulatedTransaction;
  scoreBreakdown: FinancialScoreBreakdown;
  agentRuns: AgentRun[];
  addAgentRun: (run: AgentRun) => void;
  coupons: Coupon[];
  notifications: NotificationItem[];
  addNotification: (title: string, body: string, type: NotificationItem['type']) => void;
  markNotificationsAsRead: () => void;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  streakDays: number;
  incrementStreak: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateCartQuantity: (id: string, qty: number) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) throw new Error("useFinancial must be used within a FinancialProvider");
  return context;
};

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ss_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('ss_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('ss_goals');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  const [transactions, setTransactions] = useState<SimulatedTransaction[]>(() => {
    const saved = localStorage.getItem('ss_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [agentRuns, setAgentRuns] = useState<AgentRun[]>(() => {
    const saved = localStorage.getItem('ss_agent_runs');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ss_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('ss_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [streakDays, setStreakDays] = useState<number>(3); // Demo starts with 3-day streak

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ss_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ss_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    localStorage.setItem('ss_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    addNotification(
      "Added to Cart! 🛒",
      `"${item.name}" has been added to your shopping cart list.`,
      "community"
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateCartQuantity = (id: string, qty: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  };

  useEffect(() => {
    localStorage.setItem('ss_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('ss_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('ss_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('ss_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('ss_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ss_agent_runs', JSON.stringify(agentRuns));
  }, [agentRuns]);

  useEffect(() => {
    localStorage.setItem('ss_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ss_achievements', JSON.stringify(achievements));
  }, [achievements]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addNotification = (title: string, body: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: "n-" + Math.random().toString(36).substring(2, 9),
      title,
      body,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(ach => {
      if (ach.id === id && !ach.isUnlocked) {
        // Trigger a banner
        addNotification(`Achievement Unlocked! ${ach.icon}`, `You have earned the "${ach.title}" badge!`, 'goal');
        return { ...ach, isUnlocked: true, unlockedAt: new Date().toISOString() };
      }
      return ach;
    }));
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: "exp-" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };

    setExpenses(prev => [newExpense, ...prev]);

    // Check if food delivery overspending occurs (e.g., if total Food & Delivery in past 7 days exceeds ₹1500)
    if (newExpense.category === ExpenseCategory.FOOD) {
      const foodInLastWeek = expenses
        .filter(e => e.category === ExpenseCategory.FOOD && new Date(e.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000)
        .reduce((sum, e) => sum + e.amount, 0) + newExpense.amount;
        
      if (foodInLastWeek > 2500) {
        addNotification(
          "Swiggy/Zomato Surge! 🍔",
          "Your Food Delivery spend in the last 7 days reached ₹" + foodInLastWeek + ". Budget Guardian suggests cooking or visiting the canteen to save.",
          "agent"
        );
      }
    }

    return newExpense;
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addSavingsGoal = (goalData: Omit<SavingsGoal, 'id' | 'savedAmount' | 'status'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: "goal-" + Math.random().toString(36).substring(2, 9),
      savedAmount: 0,
      status: 'active'
    };
    setSavingsGoals(prev => [...prev, newGoal]);
    addNotification("Goal Initiated 🎯", `You started saving for "${newGoal.title}". Let's protect this target!`, "goal");
    unlockAchievement("ach-4");
  };

  const addMoneyToGoal = (goalId: string, amount: number) => {
    setSavingsGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newSaved = Math.min(goal.targetAmount, goal.savedAmount + amount);
        const isNowCompleted = newSaved >= goal.targetAmount;
        
        if (isNowCompleted && goal.status !== 'completed') {
          addNotification("Savings Goal Complete! 🏆", `Awesome! You have successfully saved ₹${goal.targetAmount} for your ${goal.title}!`, "goal");
          return { ...goal, savedAmount: newSaved, status: 'completed' };
        } else {
          addNotification("Goal Progress 💰", `Added ₹${amount} to your ${goal.title} fund! Pace is excellent.`, "goal");
          return { ...goal, savedAmount: newSaved };
        }
      }
      return goal;
    }));
  };

  const addSimulatedTransaction = (txData: Omit<SimulatedTransaction, 'id' | 'createdAt' | 'status'>) => {
    const newTx: SimulatedTransaction = {
      ...txData,
      id: "tx-" + Math.random().toString(36).substring(2, 9),
      status: 'success',
      createdAt: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);

    // Automatically create a corresponding expense
    addExpense({
      amount: newTx.amount,
      merchant: newTx.recipientName,
      category: newTx.category,
      subcategory: newTx.recipientType === 'merchant' ? 'Simulated Merchant' : 'Contact Payment',
      description: newTx.note || "Simulated UPI Payment",
      paymentMethod: newTx.paymentMode,
      needOrWant: newTx.amount > 1000 ? 'want' : 'need',
      purchaseMood: "Simulated Quick Pay",
      isRecurring: false,
      date: newTx.createdAt,
      aiCategory: newTx.category,
      aiWasteProbability: newTx.amount > 500 ? 0.45 : 0.1
    });

    return newTx;
  };

  const addAgentRun = (run: AgentRun) => {
    setAgentRuns(prev => [run, ...prev]);
    if (run.finalDecision === "WAIT FOR NOW") {
      unlockAchievement("ach-3");
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const incrementStreak = () => {
    setStreakDays(prev => prev + 1);
  };

  // Dynamically calculate score breakdown
  const scoreBreakdown: FinancialScoreBreakdown = useMemo(() => {
    const currentMonthExpenses = expenses.filter(e => {
      const eDate = new Date(e.date);
      const now = new Date();
      return eDate.getMonth() === now.getMonth() && eDate.getFullYear() === now.getFullYear();
    });
    
    const totalSpentThisMonth = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    // 1. Budget Discipline (Max 30)
    // Decreases as user spends more than budget. Excellent if <= 70% of budget spent.
    const budgetUsage = totalSpentThisMonth / profile.monthlyBudget;
    let budgetDiscipline = 30;
    if (budgetUsage > 1) budgetDiscipline = 5;
    else if (budgetUsage > 0.9) budgetDiscipline = 12;
    else if (budgetUsage > 0.7) budgetDiscipline = 22;
    else budgetDiscipline = 30;

    // 2. Savings Consistency (Max 25)
    // Award points based on saved amounts in goals
    const totalSaved = savingsGoals.reduce((sum, g) => sum + g.savedAmount, 0);
    const savingsConsistency = totalSaved > 50000 ? 25 : (totalSaved > 20000 ? 20 : (totalSaved > 5000 ? 15 : 10));

    // 3. Spending Stability (Max 20)
    // Reduce if there are many "want" purchases that are impulsive
    const wantExpenses = currentMonthExpenses.filter(e => e.needOrWant === 'want');
    const spendingStability = Math.max(5, 20 - wantExpenses.length * 2);

    // 4. Goal Progress (Max 15)
    // Point matches how close the average active goal is to completion
    const activeGoals = savingsGoals.filter(g => g.status === 'active');
    const averageProgress = activeGoals.length > 0 
      ? activeGoals.reduce((acc, g) => acc + (g.savedAmount / g.targetAmount), 0) / activeGoals.length 
      : 1;
    const goalProgress = Math.round(averageProgress * 15);

    // 5. Expense Logging (Max 10)
    // Determined by how many items logged
    const expenseLogging = Math.min(10, Math.round(expenses.length / 4));

    const totalScore = budgetDiscipline + savingsConsistency + spendingStability + goalProgress + expenseLogging;

    return {
      budgetDiscipline,
      savingsConsistency,
      spendingStability,
      goalProgress,
      expenseLogging,
      score: Math.min(100, Math.max(10, totalScore))
    };
  }, [expenses, savingsGoals, profile.monthlyBudget]);

  return (
    <FinancialContext.Provider value={{
      profile,
      updateProfile,
      expenses,
      addExpense,
      deleteExpense,
      savingsGoals,
      addSavingsGoal,
      addMoneyToGoal,
      transactions,
      addSimulatedTransaction,
      scoreBreakdown,
      agentRuns,
      addAgentRun,
      coupons: MOCK_COUPONS,
      notifications,
      addNotification,
      markNotificationsAsRead,
      achievements,
      unlockAchievement,
      streakDays,
      incrementStreak,
      theme,
      toggleTheme,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      updateCartQuantity
    }}>
      {children}
    </FinancialContext.Provider>
  );
};
