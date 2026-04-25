import OpenAI from "openai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  dangerouslyAllowBrowser: true,
  maxRetries: 0, // Disable internal retries to use our own logic
});

const SYSTEM_INSTRUCTION = `You are InternAI, a friendly and helpful AI career assistant for students. You help with:
- Internship recommendations and advice
- Career guidance and path planning
- Skill development suggestions
- Resume and interview tips
- Industry insights

Keep responses clear, concise, and encouraging. Use markdown formatting (bold, bullet points, headers) for readability. 
If the user shares their profile info, use it to personalize advice.
Always be supportive — many users are first-generation students from underserved communities.`;

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

/**
 * Client-Side Rate Limiter using a Token Bucket algorithm
 */
class TokenBucket {
  private capacity: number;
  private tokens: number;
  private fillRatePerMs: number;
  private lastFillTime: number;
  private queue: Array<{ resolve: () => void }>;

  constructor(capacity: number, refillRatePerMinute: number) {
    this.capacity = capacity;
    this.tokens = capacity; // Start with a full bucket
    this.fillRatePerMs = refillRatePerMinute / 60000;
    this.lastFillTime = Date.now();
    this.queue = [];
  }

  private refill() {
    const now = Date.now();
    const elapsed = now - this.lastFillTime;
    const addedTokens = elapsed * this.fillRatePerMs;

    if (addedTokens > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + addedTokens);
      this.lastFillTime = now;
    }
  }

  private processQueue() {
    this.refill();
    while (this.queue.length > 0 && this.tokens >= 1) {
      this.tokens -= 1;
      const req = this.queue.shift();
      if (req) req.resolve();
    }

    if (this.queue.length > 0) {
      const timeToNextToken = Math.ceil((1 - this.tokens) / this.fillRatePerMs);
      setTimeout(() => this.processQueue(), timeToNextToken);
    }
  }

  public async acquireToken(): Promise<void> {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const wasEmpty = this.queue.length === 0;
      this.queue.push({ resolve });

      if (wasEmpty) {
        const timeToNextToken = Math.ceil((1 - this.tokens) / this.fillRatePerMs);
        setTimeout(() => this.processQueue(), timeToNextToken);
      }
    });
  }
}

// Gemini free-tier starts at 15 Requests Per Minute.
// We use a small capacity (burst) to avoid hitting the 15 RPM limit too quickly.
const rmpBucket = new TokenBucket(2, 10);

// Exponential Backoff Config 
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 2000;

/**
 * Attempts to call the Gemini API endpoint using OpenAI SDK with our TokenBucket constraint,
 * as well as Exponential Backoff with Jitter in case of global 429s.
 */
async function fetchWithRetry(
  history: ChatMessage[],
  message: string,
  retries = 0
): Promise<string> {
  try {
    // 1. Wait for client-side token bucket 
    await rmpBucket.acquireToken();

    // 2. Map history to OpenAI format
    const messages: any[] = [
      { role: "system", content: SYSTEM_INSTRUCTION },
      ...history.map(msg => ({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.parts[0].text,
      })),
      { role: "user", content: message }
    ];

    // 3. Call the completion API
    const completion = await openai.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: messages,
    }, {
      timeout: 30000,
    });

    const text = completion.choices?.[0]?.message?.content || "";
    return text;

  } catch (error: any) {
    const isRateLimit = error.status === 429
      || error.message?.includes("quota")
      || error.message?.includes("429")
      || error.message?.includes("Rate limit")
      || error.message?.includes("code: 429");

    // 4. Handle Exponential Backoff on 429 Quota Exceeded
    if (isRateLimit && retries < MAX_RETRIES) {
      const jitter = Math.random() * 1000;
      const delayMs = Math.pow(2, retries) * BASE_DELAY_MS + jitter;

      console.warn({
        message: "[Rate Limit 429] Retrying...",
        retryAttempt: retries + 1,
        delay: delayMs,
        reason: error.message || String(error)
      });

      await new Promise(resolve => setTimeout(resolve, delayMs));
      return fetchWithRetry(history, message, retries + 1);
    }

    console.error("Gemini OpenAI API error:", error);
    throw error;
  }
}

// create an function for the jobs search using api

function jobsSearch() {
  // use the url and api key to get the jobs data
  // and link the chat bot with this function and get the real time jobs data
}






export async function sendChatMessage(
  history: ChatMessage[],
  message: string,
  profileContext?: string
): Promise<string> {
  try {
    const prompt = profileContext
      ? `[Student Profile Context: ${profileContext}]\n\n${message}`
      : message;

    // Send only the last 5 messages to reduce token usage
    const recentHistory = history.slice(-5);

    return await fetchWithRetry(recentHistory, prompt);
  } catch (error: any) {
    const isRateLimit = error.status === 429
      || error.message?.includes("quota")
      || error.message?.includes("429")
      || error.message?.includes("Rate limit")
      || error.message?.includes("code: 429")
      || String(error).includes("429");

    if (isRateLimit) {
      return "⚠️ The AI is currently busy. Please wait a few seconds and try again.";
    }
    console.error("UNKNOWN_API_ERROR_CAUGHT:", error, JSON.stringify(error, null, 2));
    return `Sorry, I couldn't process that request. Please try again later. (Error details: ${error.message || String(error)})`;
  }
}
