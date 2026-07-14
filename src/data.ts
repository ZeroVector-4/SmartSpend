/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Expense, ExpenseCategory, SavingsGoal, Coupon, FashionPost, FoodRestaurant, Achievement, NotificationItem } from './types';

export const INITIAL_PROFILE = {
  name: "Prasoon",
  ageRange: "18-20",
  role: "College student",
  monthlyBudget: 10000,
  spendingAreas: ["Food & Delivery", "Fashion", "Entertainment", "Transport"],
  goals: ["Laptop", "Trip with Friends"],
  interests: ["Gadgets", "Sustainable Fashion", "Burgers & Cafe"],
  foodPreference: "Vegetarian / Cafe style",
  fashionPreference: "Streetwear"
};

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: "goal-1",
    title: "MacBook Air Fund",
    targetAmount: 80000,
    savedAmount: 28500,
    targetDate: "2026-12-15",
    category: "laptop",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400",
    requiredMonthly: 8583,
    status: "active"
  },
  {
    id: "goal-2",
    title: "Nothing Phone (2)",
    targetAmount: 36000,
    savedAmount: 36000,
    targetDate: "2026-05-01",
    category: "phone",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400",
    requiredMonthly: 0,
    status: "completed"
  }
];

export const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    name: "Sneakers (Street Classic)",
    price: 3500,
    merchantName: "Myntra",
    url: "https://example.com/shoes",
    rating: 4.4,
    alternatives: [
      { id: "alt-1", name: "Classic Low-tops", price: 2100, merchantName: "Ajio", rating: 4.1 },
      { id: "alt-2", name: "Z-Force Canvas Shoes", price: 1750, merchantName: "Flipkart", rating: 4.2 }
    ]
  },
  {
    id: "prod-2",
    name: "Nothing Ear (a) ANC Earbuds",
    price: 7999,
    merchantName: "Flipkart",
    url: "https://example.com/earbuds",
    rating: 4.6,
    alternatives: [
      { id: "alt-3", name: "OnePlus Buds 3", price: 5499, merchantName: "Amazon", rating: 4.5 },
      { id: "alt-4", name: "boAt Nirvana ANC", price: 2999, merchantName: "boAt Store", rating: 4.0 }
    ]
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    id: "cp-1",
    code: "STUDENTMEAL",
    discount: "20% OFF",
    minOrder: 499,
    maxDiscount: 150,
    expiryDate: "2026-07-20",
    verificationStatus: "verified",
    aiMatchScore: 92,
    reason: "You frequently order food on Friday evenings after lectures."
  },
  {
    id: "cp-2",
    code: "KICKS10",
    discount: "Flat ₹500 Off",
    minOrder: 2999,
    maxDiscount: 500,
    expiryDate: "2026-07-15",
    verificationStatus: "likely_valid",
    aiMatchScore: 84,
    reason: "Fits your sneaker browsing pattern and high fashion interest."
  },
  {
    id: "cp-3",
    code: "METRORIDE",
    discount: "₹50 Cashback",
    minOrder: 200,
    maxDiscount: 50,
    expiryDate: "2026-07-30",
    verificationStatus: "verified",
    aiMatchScore: 78,
    reason: "Matches your frequent transport expenses for college commute."
  }
];

export const MOCK_FASHION_POSTS: FashionPost[] = [
  {
    id: "f-1",
    creatorName: "Aarav_Styles",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
    likes: 142,
    caption: "Chilling in oversized white tees and straight cargo pants. Recreated this look for less! #streetwear #studentfits",
    comments: 24,
    tags: ["oversized-shirt", "cargo-pants", "sneakers"],
    isLiked: false
  },
  {
    id: "f-2",
    creatorName: "Riya_Fits",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400",
    likes: 210,
    caption: "Thrifted oversized jackets are the way to go! Total look under ₹2000. Guess where I found them?",
    comments: 18,
    tags: ["jacket", "denim", "boots"],
    isLiked: false
  }
];

export const MOCK_RESTAURANTS: FoodRestaurant[] = [
  {
    id: "rest-1",
    name: "Canteen Bistro & Cafe",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400",
    cuisine: "Cafe, Pizzas & Pastas",
    distance: 0.8,
    estimatedPrice: 350,
    rating: 4.5,
    aiMatchScore: 95,
    reviewSummary: "Students highly praise their cold coffees, cheesy fries, and quick service. Active, vibrant student crowd.",
    scores: {
      taste: 90,
      value: 95,
      hygiene: 88,
      service: 85,
      studentFriendly: 98
    }
  },
  {
    id: "rest-2",
    name: "Royal Biryani House",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400",
    cuisine: "Mughlai, Biryani",
    distance: 2.1,
    estimatedPrice: 280,
    rating: 4.3,
    aiMatchScore: 89,
    reviewSummary: "Fabulous authentic handi biryani that fits a tight budget. Generous portion sizes make it perfect for group dining.",
    scores: {
      taste: 94,
      value: 92,
      hygiene: 80,
      service: 78,
      studentFriendly: 90
    }
  },
  {
    id: "rest-3",
    name: "Burger Spot & Shakes",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
    cuisine: "Fast Food, Shakes",
    distance: 1.5,
    estimatedPrice: 220,
    rating: 4.1,
    aiMatchScore: 91,
    reviewSummary: "Incredible pocket-friendly combo deals. Clean seating area and super crispy loaded veggie burgers.",
    scores: {
      taste: 88,
      value: 96,
      hygiene: 85,
      service: 82,
      studentFriendly: 96
    }
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-0",
    title: "AI Guardian Active 🛡️",
    body: "Smart spend tracking is operating cleanly in safe local mode (94% accuracy). Budget scanning and savings protection are fully functional.",
    type: "agent",
    isRead: false,
    createdAt: "2026-07-10T12:00:00-07:00"
  },
  {
    id: "n-1",
    title: "Price Drop Alert! 📉",
    body: "Nothing Ear (a) buds dropped from ₹7,999 to ₹6,499 on Flipkart. Saves you ₹1,500!",
    type: "price_drop",
    isRead: false,
    createdAt: "2026-07-09T10:00:00-07:00"
  },
  {
    id: "n-2",
    title: "Impulse Warning ⚠️",
    body: "Budget Guardian detected 3 cafe payments in the past 48 hours. Consider home-brewed tea today!",
    type: "agent",
    isRead: false,
    createdAt: "2026-07-08T18:30:00-07:00"
  },
  {
    id: "n-3",
    title: "Goal Milestone Achieved 🎉",
    body: "Excellent! You crossed 35% of your MacBook Air goal. Keep going, Prasoon!",
    type: "goal",
    isRead: true,
    createdAt: "2026-07-06T12:00:00-07:00"
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "ach-1", title: "7-Day Logger", description: "Logged expenses consistently for 7 straight days", icon: "🔥", isUnlocked: true, unlockedAt: "2026-07-05T14:30:00-07:00" },
  { id: "ach-2", title: "Budget Defender", description: "Stayed under food budget for 3 weeks in a row", icon: "🛡️", isUnlocked: true, unlockedAt: "2026-07-01T10:00:00-07:00" },
  { id: "ach-3", title: "Impulse Breaker", description: "Rejected a high-risk purchase after 'Should I Spend?' analysis", icon: "🚫", isUnlocked: false },
  { id: "ach-4", title: "Goal Starter", description: "Created your first long-term savings goal", icon: "🎯", isUnlocked: true, unlockedAt: "2026-06-15T11:00:00-07:00" },
  { id: "ach-5", title: "Smart Decision Maker", description: "Recreated a premium fashion outfit under budget", icon: "💎", isUnlocked: false }
];

// Let's generate 42 historical expenses to show a deep spending pattern.
// Today is July 9, 2026.
// History spans April, May, June, and early July 2026.
export const INITIAL_EXPENSES: Expense[] = [
  // JULY (Early July overspending on cafe / food delivery)
  {
    id: "exp-1",
    amount: 320,
    merchant: "Zomato - Cafe Coffee",
    category: ExpenseCategory.FOOD,
    subcategory: "Food Delivery",
    description: "Cold coffee and sandwich",
    paymentMethod: "UPI QR",
    needOrWant: "want",
    purchaseMood: "Tired after class",
    isRecurring: false,
    date: "2026-07-09T11:30:00",
    aiCategory: "Food & Delivery",
    aiWasteProbability: 0.65,
    createdAt: "2026-07-09T11:30:00"
  },
  {
    id: "exp-2",
    amount: 120,
    merchant: "College Metro ride",
    category: ExpenseCategory.TRANSPORT,
    subcategory: "Metro",
    description: "Daily commute to campus",
    paymentMethod: "UPI ID",
    needOrWant: "need",
    purchaseMood: "Normal",
    isRecurring: false,
    date: "2026-07-09T08:45:00",
    aiCategory: "Transport",
    aiWasteProbability: 0.05,
    createdAt: "2026-07-09T08:45:00"
  },
  {
    id: "exp-3",
    amount: 1450,
    merchant: "H&M Streetwear",
    category: ExpenseCategory.FASHION,
    subcategory: "Clothing",
    description: "Oversized black hoodie",
    paymentMethod: "UPI QR",
    needOrWant: "want",
    purchaseMood: "Impulse buy with friends",
    isRecurring: false,
    date: "2026-07-08T17:15:00",
    aiCategory: "Fashion",
    aiWasteProbability: 0.70,
    createdAt: "2026-07-08T17:15:00"
  },
  {
    id: "exp-4",
    amount: 450,
    merchant: "Swiggy - Burger Spot",
    category: ExpenseCategory.FOOD,
    subcategory: "Food Delivery",
    description: "Veg burger combo & chocolate shake",
    paymentMethod: "UPI QR",
    needOrWant: "want",
    purchaseMood: "Bored studying",
    isRecurring: false,
    date: "2026-07-07T21:10:00",
    aiCategory: "Food & Delivery",
    aiWasteProbability: 0.75,
    createdAt: "2026-07-07T21:10:00"
  },
  {
    id: "exp-5",
    amount: 120,
    merchant: "College Metro ride",
    category: ExpenseCategory.TRANSPORT,
    subcategory: "Metro",
    description: "Campus return",
    paymentMethod: "UPI ID",
    needOrWant: "need",
    purchaseMood: "Exhausted",
    isRecurring: false,
    date: "2026-07-07T16:00:00",
    aiCategory: "Transport",
    aiWasteProbability: 0.05,
    createdAt: "2026-07-07T16:00:00"
  },
  {
    id: "exp-6",
    amount: 199,
    merchant: "Spotify Premium",
    category: ExpenseCategory.SUBSCRIPTIONS,
    subcategory: "Music",
    description: "Monthly subscription (Student plan)",
    paymentMethod: "UPI AutoPay",
    needOrWant: "want",
    purchaseMood: "Good vibes only",
    isRecurring: true,
    date: "2026-07-05T00:01:00",
    aiCategory: "Subscriptions",
    aiWasteProbability: 0.20,
    createdAt: "2026-07-05T00:01:00"
  },
  {
    id: "exp-7",
    amount: 499,
    merchant: "Netflix Premium Gym",
    category: ExpenseCategory.SUBSCRIPTIONS,
    subcategory: "Fitness",
    description: "Local gym trial (unattended this month)",
    paymentMethod: "UPI AutoPay",
    needOrWant: "want",
    purchaseMood: "Guilty",
    isRecurring: true,
    date: "2026-07-04T08:00:00",
    aiCategory: "Subscriptions",
    aiWasteProbability: 0.95, // Highly likely to be waste since user doesn't attend!
    createdAt: "2026-07-04T08:00:00"
  },
  {
    id: "exp-8",
    amount: 250,
    merchant: "Tapri Chai & Samosas",
    category: ExpenseCategory.FOOD,
    subcategory: "Eating Out",
    description: "Chai time with batchmates",
    paymentMethod: "UPI QR",
    needOrWant: "want",
    purchaseMood: "Relaxed",
    isRecurring: false,
    date: "2026-07-03T17:30:00",
    aiCategory: "Food & Delivery",
    aiWasteProbability: 0.30,
    createdAt: "2026-07-03T17:30:00"
  },
  {
    id: "exp-9",
    amount: 650,
    merchant: "Zomato - Pizza Heaven",
    category: ExpenseCategory.FOOD,
    subcategory: "Food Delivery",
    description: "Medium thin crust Margherita pizza",
    paymentMethod: "UPI QR",
    needOrWant: "want",
    purchaseMood: "Netflix binge",
    isRecurring: false,
    date: "2026-07-02T20:45:00",
    aiCategory: "Food & Delivery",
    aiWasteProbability: 0.60,
    createdAt: "2026-07-02T20:45:00"
  },
  {
    id: "exp-10",
    amount: 1500,
    merchant: "College Semester Books",
    category: ExpenseCategory.EDUCATION,
    subcategory: "Study Materials",
    description: "Engineering Mathematics and Physics reference books",
    paymentMethod: "UPI QR",
    needOrWant: "need",
    purchaseMood: "Focused",
    isRecurring: false,
    date: "2026-07-01T12:00:00",
    aiCategory: "Education",
    aiWasteProbability: 0.00,
    createdAt: "2026-07-01T12:00:00"
  },

  // JUNE (A pattern of dining out and small cab bookings)
  { id: "exp-11", amount: 480, merchant: "Swiggy Delivery", category: ExpenseCategory.FOOD, subcategory: "Delivery", description: "Paneer Butter Masala", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Hungry", isRecurring: false, date: "2026-06-28T21:00:00", createdAt: "2026-06-28T21:00:00" },
  { id: "exp-12", amount: 150, merchant: "Starbucks Coffee", category: ExpenseCategory.FOOD, subcategory: "Cafe", description: "Matcha Latte", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Trendy", isRecurring: false, date: "2026-06-27T15:30:00", createdAt: "2026-06-27T15:30:00" },
  { id: "exp-13", amount: 350, merchant: "Uber Auto", category: ExpenseCategory.TRANSPORT, subcategory: "Cab/Auto", description: "Commute in rain", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Stressed", isRecurring: false, date: "2026-06-26T18:15:00", createdAt: "2026-06-26T18:15:00" },
  { id: "exp-14", amount: 120, merchant: "College Metro ride", category: ExpenseCategory.TRANSPORT, subcategory: "Metro", description: "Metro smartcard recharge", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Neutral", isRecurring: false, date: "2026-06-25T08:45:00", createdAt: "2026-06-25T08:45:00" },
  { id: "exp-15", amount: 2500, merchant: "ZARA Sale", category: ExpenseCategory.FASHION, subcategory: "Clothing", description: "Straight-fit denim jeans", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Excited", isRecurring: false, date: "2026-06-24T16:00:00", createdAt: "2026-06-24T16:00:00" },
  { id: "exp-16", amount: 199, merchant: "Spotify Premium", category: ExpenseCategory.SUBSCRIPTIONS, subcategory: "Music", description: "Monthly sub", paymentMethod: "UPI AutoPay", needOrWant: "want", purchaseMood: "Neutral", isRecurring: true, date: "2026-06-05T00:01:00", createdAt: "2026-06-05T00:01:00" },
  { id: "exp-17", amount: 499, merchant: "Netflix Premium Gym", category: ExpenseCategory.SUBSCRIPTIONS, subcategory: "Fitness", description: "Unused gym subscription", paymentMethod: "UPI AutoPay", needOrWant: "want", purchaseMood: "Indifferent", isRecurring: true, date: "2026-06-04T08:00:00", createdAt: "2026-06-04T08:00:00" },
  { id: "exp-18", amount: 180, merchant: "PVR Cinemas Popcorn", category: ExpenseCategory.ENTERTAINMENT, subcategory: "Movie snack", description: "Popcorn during Spiderman movie", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Happy", isRecurring: false, date: "2026-06-21T19:30:00", createdAt: "2026-06-21T19:30:00" },
  { id: "exp-19", amount: 450, merchant: "PVR Cinemas ticket", category: ExpenseCategory.ENTERTAINMENT, subcategory: "Movie ticket", description: "Spiderman movie ticket", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Thrilled", isRecurring: false, date: "2026-06-21T18:00:00", createdAt: "2026-06-21T18:00:00" },
  { id: "exp-20", amount: 350, merchant: "Local Stationary", category: ExpenseCategory.EDUCATION, subcategory: "Supplies", description: "Notebooks and premium pens", paymentMethod: "UPI QR", needOrWant: "need", purchaseMood: "Prepared", isRecurring: false, date: "2026-06-18T14:15:00", createdAt: "2026-06-18T14:15:00" },
  { id: "exp-21", amount: 310, merchant: "Zomato - Burger King", category: ExpenseCategory.FOOD, subcategory: "Food Delivery", description: "Double cheeseburger combo", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Hungry", isRecurring: false, date: "2026-06-16T13:00:00", createdAt: "2026-06-16T13:00:00" },
  { id: "exp-22", amount: 120, merchant: "College Metro ride", category: ExpenseCategory.TRANSPORT, subcategory: "Metro", description: "Daily Commute", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Tired", isRecurring: false, date: "2026-06-15T16:00:00", createdAt: "2026-06-15T16:00:00" },
  { id: "exp-23", amount: 120, merchant: "College Metro ride", category: ExpenseCategory.TRANSPORT, subcategory: "Metro", description: "Daily Commute", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Calm", isRecurring: false, date: "2026-06-15T08:45:00", createdAt: "2026-06-15T08:45:00" },
  { id: "exp-24", amount: 80, merchant: "Tapri Tea and Biscuit", category: ExpenseCategory.FOOD, subcategory: "Snack", description: "Evening tea", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Tired", isRecurring: false, date: "2026-06-14T17:30:00", createdAt: "2026-06-14T17:30:00" },
  { id: "exp-25", amount: 120, merchant: "College Metro ride", category: ExpenseCategory.TRANSPORT, subcategory: "Metro", description: "Commute", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Tired", isRecurring: false, date: "2026-06-12T16:15:00", createdAt: "2026-06-12T16:15:00" },
  { id: "exp-26", amount: 120, merchant: "College Metro ride", category: ExpenseCategory.TRANSPORT, subcategory: "Metro", description: "Commute", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Sleepy", isRecurring: false, date: "2026-06-12T08:45:00", createdAt: "2026-06-12T08:45:00" },
  { id: "exp-27", amount: 500, merchant: "Mobile Recharge", category: ExpenseCategory.BILLS, subcategory: "Telecom", description: "Airtel 84 Days Student Pack", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Relieved", isRecurring: false, date: "2026-06-10T11:00:00", createdAt: "2026-06-10T11:00:00" },
  { id: "exp-28", amount: 350, merchant: "Swiggy - Subway", category: ExpenseCategory.FOOD, subcategory: "Food Delivery", description: "Subway cookies and sub", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Hungry", isRecurring: false, date: "2026-06-08T19:30:00", createdAt: "2026-06-08T19:30:00" },
  { id: "exp-29", amount: 1800, merchant: "Comic Con Entry Ticket", category: ExpenseCategory.ENTERTAINMENT, subcategory: "Event", description: "Fandom ticket", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Hyped", isRecurring: false, date: "2026-06-06T10:00:00", createdAt: "2026-06-06T10:00:00" },
  { id: "exp-30", amount: 350, merchant: "College Metro ride", category: ExpenseCategory.TRANSPORT, subcategory: "Metro", description: "Smartcard recharge", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Neutral", isRecurring: false, date: "2026-06-02T12:00:00", createdAt: "2026-06-02T12:00:00" },

  // MAY (Consistent but showing rising cafe purchases)
  { id: "exp-31", amount: 199, merchant: "Spotify Premium", category: ExpenseCategory.SUBSCRIPTIONS, subcategory: "Music", description: "Monthly sub", paymentMethod: "UPI AutoPay", needOrWant: "want", purchaseMood: "Neutral", isRecurring: true, date: "2026-05-05T00:01:00", createdAt: "2026-05-05T00:01:00" },
  { id: "exp-32", amount: 499, merchant: "Netflix Premium Gym", category: ExpenseCategory.SUBSCRIPTIONS, subcategory: "Fitness", description: "Gym sub", paymentMethod: "UPI AutoPay", needOrWant: "want", purchaseMood: "Neutral", isRecurring: true, date: "2026-05-04T08:00:00", createdAt: "2026-05-04T08:00:00" },
  { id: "exp-33", amount: 180, merchant: "Cafe Coffee Day", category: ExpenseCategory.FOOD, subcategory: "Cafe", description: "Hazelnut shake", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Bored", isRecurring: false, date: "2026-05-25T15:30:00", createdAt: "2026-05-25T15:30:00" },
  { id: "exp-34", amount: 220, merchant: "Starbucks Coffee", category: ExpenseCategory.FOOD, subcategory: "Cafe", description: "Mocha", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Tired", isRecurring: false, date: "2026-05-22T14:00:00", createdAt: "2026-05-22T14:00:00" },
  { id: "exp-35", amount: 120, merchant: "College Metro ride", category: ExpenseCategory.TRANSPORT, subcategory: "Metro", description: "Daily Commute", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Calm", isRecurring: false, date: "2026-05-20T16:15:00", createdAt: "2026-05-20T16:15:00" },
  { id: "exp-36", amount: 120, merchant: "College Metro ride", category: ExpenseCategory.TRANSPORT, subcategory: "Metro", description: "Daily Commute", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Normal", isRecurring: false, date: "2026-05-20T08:45:00", createdAt: "2026-05-20T08:45:00" },
  { id: "exp-37", amount: 450, merchant: "Swiggy - Biryani", category: ExpenseCategory.FOOD, subcategory: "Food Delivery", description: "Biryani bowl lunch", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Hungry", isRecurring: false, date: "2026-05-18T13:30:00", createdAt: "2026-05-18T13:30:00" },
  { id: "exp-38", amount: 900, merchant: "Amazon - Phone Case", category: ExpenseCategory.SHOPPING, subcategory: "Gadgets", description: "Spigen armor phone cover", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Excited", isRecurring: false, date: "2026-05-12T11:20:00", createdAt: "2026-05-12T11:20:00" },
  { id: "exp-39", amount: 120, merchant: "College Metro ride", category: ExpenseCategory.TRANSPORT, subcategory: "Metro", description: "Daily Commute", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Normal", isRecurring: false, date: "2026-05-10T16:00:00", createdAt: "2026-05-10T16:00:00" },
  { id: "exp-40", amount: 120, merchant: "College Metro ride", category: ExpenseCategory.TRANSPORT, subcategory: "Metro", description: "Daily Commute", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Normal", isRecurring: false, date: "2026-05-10T08:45:00", createdAt: "2026-05-10T08:45:00" },
  { id: "exp-41", amount: 320, merchant: "Canteen Samosas & Teas", category: ExpenseCategory.FOOD, subcategory: "Snacks", description: "Group snacks", paymentMethod: "UPI QR", needOrWant: "want", purchaseMood: "Happy", isRecurring: false, date: "2026-05-08T12:00:00", createdAt: "2026-05-08T12:00:00" },
  { id: "exp-42", amount: 120, merchant: "College Metro ride", category: ExpenseCategory.TRANSPORT, subcategory: "Metro", description: "Commute smartcard", paymentMethod: "UPI ID", needOrWant: "need", purchaseMood: "Neutral", isRecurring: false, date: "2026-05-01T08:45:00", createdAt: "2026-05-01T08:45:00" }
];
