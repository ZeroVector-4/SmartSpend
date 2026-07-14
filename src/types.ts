/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  ageRange: string;
  role: string;
  monthlyBudget: number;
  spendingAreas: string[];
  goals: string[];
  interests: string[];
  foodPreference: string;
  fashionPreference: string;
}

export interface Expense {
  id: string;
  amount: number;
  merchant: string;
  category: ExpenseCategory;
  subcategory: string;
  description: string;
  paymentMethod: string;
  needOrWant: 'need' | 'want';
  purchaseMood: string;
  isRecurring: boolean;
  date: string;
  aiCategory?: string;
  aiWasteProbability?: number; // 0 to 1
  createdAt: string;
}

export enum ExpenseCategory {
  FOOD = "Food & Delivery",
  GROCERIES = "Groceries",
  FASHION = "Fashion",
  SHOPPING = "Shopping",
  ENTERTAINMENT = "Entertainment",
  SUBSCRIPTIONS = "Subscriptions",
  TRANSPORT = "Transport",
  EDUCATION = "Education",
  HEALTH = "Health",
  BILLS = "Bills",
  TRAVEL = "Travel",
  OTHER = "Other"
}

export interface SimulatedTransaction {
  id: string;
  recipientName: string;
  recipientType: 'merchant' | 'contact';
  demoUpiId: string;
  amount: number;
  note: string;
  category: ExpenseCategory;
  status: 'pending' | 'processing' | 'success' | 'failed';
  paymentMode: 'UPI QR' | 'UPI ID' | 'Mobile' | 'Contact';
  riskScore: number; // 0 to 100
  agentsTriggered: string[];
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  category: 'laptop' | 'phone' | 'education' | 'trip' | 'emergency' | 'vehicle' | 'custom';
  imageUrl: string;
  requiredMonthly: number;
  status: 'active' | 'completed';
}

export interface FinancialScoreBreakdown {
  budgetDiscipline: number; // Max 30
  savingsConsistency: number; // Max 25
  spendingStability: number; // Max 20
  goalProgress: number; // Max 15
  expenseLogging: number; // Max 10
  score: number; // Total out of 100
}

export interface AgentFindings {
  agent: string;
  status: 'completed' | 'queued' | 'thinking' | 'failed';
  riskLevel: 'low' | 'medium' | 'high';
  score: number; // 0 to 100
  findings: string[];
  recommendedActions: string[];
}

export interface AgentRun {
  id: string;
  request: string;
  price: number;
  workflowType: string;
  agentsUsed: string[];
  status: 'pending' | 'completed' | 'failed';
  startedAt: string;
  completedAt: string;
  outputs: AgentFindings[];
  finalDecision: 'BUY' | 'WAIT FOR NOW' | 'CHOOSE ALTERNATIVE';
  confidence: number; // 0 to 1
  reasoning: string;
}

export interface ProductComparison {
  id: string;
  name: string;
  price: number;
  merchantName: string;
  url: string;
  rating: number;
}

export interface ProductAlert {
  id: string;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  merchant: string;
  isTriggered: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discount: string;
  minOrder: number;
  maxDiscount: number;
  expiryDate: string;
  verificationStatus: 'verified' | 'likely_valid' | 'expired';
  aiMatchScore: number;
  reason: string;
}

export interface FashionPost {
  id: string;
  creatorName: string;
  avatar: string;
  imageUrl: string;
  likes: number;
  caption: string;
  comments: number;
  tags: string[];
  isLiked?: boolean;
}

export interface FoodRestaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  distance: number; // in km
  estimatedPrice: number; // for two
  rating: number;
  aiMatchScore: number;
  reviewSummary: string;
  scores: {
    taste: number;
    value: number;
    hygiene: number;
    service: number;
    studentFriendly: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'alert' | 'price_drop' | 'coupon' | 'goal' | 'agent' | 'community';
  isRead: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  dealPrice: number;
  img: string;
  brand: string;
  quantity: number;
  source?: string;
  fromSection: string; // e.g. 'Smart Shop', 'Fashion Feed', 'Creator Style Scan'
}

