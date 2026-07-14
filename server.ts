/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK
let genAIInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      throw new Error("GEMINI_API_KEY is not configured in Secrets. Falling back to Simulated Local Orchestrator.");
    }
    genAIInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAIInstance;
}

// Simulated Orchestrator Response (in case of missing API key or error)
function getMockOrchestration(prompt: string, price: number, budget: number, spent: number, goals: any[]) {
  const remaining = budget - spent;
  const targetGoal = goals[0] || { title: "MacBook Air Fund", targetAmount: 80000, savedAmount: 28500 };
  
  let score = 75;
  let decision: "BUY" | "WAIT FOR NOW" | "CHOOSE ALTERNATIVE" = "WAIT FOR NOW";
  let findings: string[] = [];
  let actions: string[] = [];
  let reasoning = "";

  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes("shoe") || promptLower.includes("sneaker") || price > 2000) {
    score = 42;
    decision = "WAIT FOR NOW";
    findings = [
      `Your Fashion spending is currently at ₹1,850, which is 92.5% of your sub-budget limit.`,
      `Making this purchase now of ₹${price} will consume ${Math.round((price / remaining) * 100)}% of your remaining monthly allowance (₹${remaining}).`,
      `This impulse decision may delay your "${targetGoal.title}" target by approximately 12 days.`,
      `Budget Guardian notes: You made 3 discretionary purchases in the last 10 days.`
    ];
    actions = [
      "Wait until next month when your fashion allowance resets.",
      "Explore alternative options in our Smart Shop under ₹1,800.",
      "Set a price drop alert for this item and let Coupon Hunter scan for discounts."
    ];
    reasoning = "We recommend waiting on this purchase. While you have the funds available, doing so directly conflicts with your active savings goals and puts stress on your remaining discretionary limits.";
  } else if (promptLower.includes("biryani") || promptLower.includes("food") || promptLower.includes("canteen")) {
    score = 68;
    decision = "CHOOSE ALTERNATIVE";
    findings = [
      "Your Food & Delivery budget is nearing its monthly limit of ₹3,500 (spent ₹3,200).",
      "This is your fifth meal purchase this week. Budget Guardian detects a repetitive fast food pattern.",
      "A healthy, cost-effective alternative is available nearby at the student canteen (₹120 vs ₹450 Swiggy)."
    ];
    actions = [
      "Choose a student canteen alternative or use coupon 'STUDENTMEAL' to save 20%.",
      "Cook a simple meal or eat in the campus mess today.",
      "Adjust your monthly food budget cap in settings if necessary."
    ];
    reasoning = "You are close to your food delivery cap. We suggest opting for a local budget option or using a valid coupon to cushion the impact.";
  } else {
    // General or low cost
    score = 88;
    decision = "BUY";
    findings = [
      "This purchase easily fits within your daily discretionary limit of ₹350.",
      "Your overall budget remains healthy with ₹2,800 remaining.",
      "Zero conflicts detected with active savings goals."
    ];
    actions = [
      "Go ahead with the purchase - it aligns with your budget parameters.",
      "Make sure to log this expense immediately so we can track category trends."
    ];
    reasoning = "The purchase is safe. You have managed your finances prudently this week, and this item does not interfere with your MacBook Air or other savings targets.";
  }

  return {
    success: true,
    simulated: true,
    data: {
      id: "run-" + Math.random().toString(36).substring(2, 9),
      request: prompt,
      price: price || 350,
      workflowType: "Purchase Decision",
      agentsUsed: ["Orchestrator", "Budget Guardian", "Goal Protector", "Impulse Detector", "Smart Shopper", "Financial Advisor"],
      status: "completed",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      outputs: [
        {
          agent: "Budget Guardian",
          status: "completed",
          riskLevel: decision === "BUY" ? "low" : (decision === "WAIT FOR NOW" ? "high" : "medium"),
          score: score,
          findings: [findings[0] || "Checking budget status."],
          recommendedActions: [actions[0] || "Confirming limit."]
        },
        {
          agent: "Goal Protector",
          status: "completed",
          riskLevel: decision === "WAIT FOR NOW" ? "high" : "low",
          score: score + 5 > 100 ? 100 : score + 5,
          findings: [findings[2] || "Evaluating goal milestones."],
          recommendedActions: [actions[1] || "Preserve goal funding."]
        },
        {
          agent: "Impulse Detector",
          status: "completed",
          riskLevel: decision === "BUY" ? "low" : "medium",
          score: score - 10 < 0 ? 0 : score - 10,
          findings: [findings[3] || "Analyzing purchase timing and mood."],
          recommendedActions: ["Practice the 48-hour rule for non-essential goods."]
        },
        {
          agent: "Financial Advisor",
          status: "completed",
          riskLevel: decision === "WAIT FOR NOW" ? "high" : "low",
          score: score,
          findings: findings,
          recommendedActions: actions
        }
      ],
      finalDecision: decision,
      confidence: 0.94,
      reasoning: reasoning
    }
  };
}

// API: Orchestrated Agent Workflow ("Should I Spend?")
app.post("/api/gemini/analyze", async (req, res) => {
  const { prompt, price = 0, budget = 10000, spent = 7200, goals = [] } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, error: "Prompt is required" });
  }

  try {
    const ai = getGeminiClient();

    const systemPrompt = `You are the core orchestrator of SmartSpend Pro, a multi-agent AI financial intelligence platform for young adults.
Your task is to analyze a proposed purchase decision and simulate a multi-agent reasoning flow.

You must return a structured JSON response matching this TypeScript schema:
{
  id: string (random);
  request: string;
  price: number;
  workflowType: string;
  agentsUsed: string[];
  status: "completed";
  startedAt: string;
  completedAt: string;
  outputs: Array<{
    agent: string;
    status: "completed";
    riskLevel: "low" | "medium" | "high";
    score: number; // out of 100
    findings: string[];
    recommendedActions: string[];
  }>;
  finalDecision: "BUY" | "WAIT FOR NOW" | "CHOOSE ALTERNATIVE";
  confidence: number; // 0 to 1
  reasoning: string;
}

The sub-agents you should simulate and report findings for are:
1. Budget Guardian (checks remaining budget vs monthly caps)
2. Goal Protector (analyzes impact on savings goals, e.g. MacBook Air target of ₹80,000, current ₹28,500)
3. Impulse Detector (looks at purchase urgency, mood, and past patterns)
4. Financial Advisor (collates all insights into simple, non-preachy actions)

User Input Prompt: "${prompt}"
Price: ₹${price}
Current Monthly Budget: ₹${budget}
Already Spent This Month: ₹${spent}
Active Goals: ${JSON.stringify(goals)}

Be highly realistic, non-preachy, and tailor the response to a young college student in India using Rupees (₹).
Write human-sounding, helpful findings. Keep your JSON pristine and well-formatted.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const textOutput = response.text || "";
    const parsedData = JSON.parse(textOutput.trim());
    return res.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.warn("Gemini Live Client failed or unconfigured:", error.message);
    // Graceful fallback to rich local orchestrator
    const simulatedResponse = getMockOrchestration(prompt, price, budget, spent, goals);
    return res.json(simulatedResponse);
  }
});

// API: AI Assistant Contextual Chat
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history = [], expenses = [], budget = 10000 } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: "Message is required" });
  }

  try {
    const ai = getGeminiClient();

    // Summarize expenses to feed to Gemini context compactly
    const compactExpenses = expenses.slice(0, 15).map((e: any) => ({
      amount: e.amount,
      merchant: e.merchant,
      category: e.category,
      needOrWant: e.needOrWant,
      date: e.date
    }));

    const systemInstruction = `You are SmartSpend Pro's conversational AI assistant.
You help college students make smart financial and lifestyle decisions in a friendly, conversational, and direct tone.
You have access to their current context:
- Monthly Budget: ₹${budget}
- Current Spend: ₹${expenses.reduce((acc: number, e: any) => acc + e.amount, 0)}
- Recent Expenses: ${JSON.stringify(compactExpenses)}

Answer their financial questions precisely. Suggest practical student-friendly tips. Avoid long essays. Keep responses scannable.`;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const response = await chat.sendMessage({ message });
    return res.json({ success: true, text: response.text });

  } catch (error: any) {
    console.warn("Gemini Chat failed or unconfigured:", error.message);
    
    // Friendly fallback answers grounded in the user's question
    let text = "I am currently running in offline demo mode. Based on your current logged history of ₹7,200 spent out of ₹10,000, your budget is on track but your Food Delivery purchases (₹3,200) constitute your largest leak. Try trimming down small deliveries to increase your MacBook Air goal progress!";
    const msgLower = message.toLowerCase();
    
    if (msgLower.includes("save") || msgLower.includes("laptop") || msgLower.includes("macbook")) {
      text = "To save for your MacBook Air (₹80,000 target, ₹28,500 saved), you need ₹8,583 monthly. Based on your current spending, cutting Swiggy orders by half would save ₹1,600/month, and cancelling that unused Netflix Premium Gym subscription will save ₹499/month, speeding up your target date by 18 days!";
    } else if (msgLower.includes("waste") || msgLower.includes("leak") || msgLower.includes("subscription")) {
      text = "My Spending Analyst agent identified that you spent ₹499 on 'Netflix Premium Gym' which was registered as unused this month! Cancelling this or changing to a cheaper student tier will immediately save you ₹5,988 annually.";
    } else if (msgLower.includes("afford") || msgLower.includes("buy") || msgLower.includes("shoes")) {
      text = "Buying ₹3,500 shoes right now would reduce your remaining balance to just ₹750 for the month, putting significant pressure on your transport or grocery needs. I recommend waiting for the monthly budget reset on the 1st.";
    }

    return res.json({ success: true, text, simulated: true });
  }
});

// Server boot and Vite middleware setup
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartSpend Pro Server running on http://localhost:${PORT}`);
  });
}

startServer();
