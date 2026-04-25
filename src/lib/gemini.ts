import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

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
const rmpBucket = new TokenBucket(2, 10);

// Exponential Backoff Config 
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 2000;

/**
 * Attempts to call the Gemini Cloud Function with our TokenBucket constraint,
 * as well as Exponential Backoff with Jitter in case of 429s or other transient errors.
 */
async function fetchWithRetry(
  history: ChatMessage[],
  message: string,
  retries = 0
): Promise<string> {
  try {
    // 1. Wait for client-side token bucket 
    await rmpBucket.acquireToken();

    // 2. Reference the cloud function
    const chatFn = httpsCallable<{
      history: ChatMessage[],
      message: string,
      systemInstruction: string
    }, { text: string }>(functions, 'chat');

    // 3. Call the function
    const result = await chatFn({
      history,
      message,
      systemInstruction: SYSTEM_INSTRUCTION
    });

    return result.data.text;

  } catch (error: any) {
    const errorMessage = error.message || String(error);
    const isRetryable = errorMessage.includes("429") 
      || errorMessage.includes("quota")
      || errorMessage.includes("Rate limit")
      || errorMessage.includes("internal")
      || errorMessage.includes("deadline-exceeded");

    // 4. Handle Exponential Backoff
    if (isRetryable && retries < MAX_RETRIES) {
      const jitter = Math.random() * 1000;
      const delayMs = Math.pow(2, retries) * BASE_DELAY_MS + jitter;

      console.warn({
        message: "[Retryable Error] Retrying...",
        retryAttempt: retries + 1,
        delay: delayMs,
        reason: errorMessage
      });

      await new Promise(resolve => setTimeout(resolve, delayMs));
      return fetchWithRetry(history, message, retries + 1);
    }

    console.error("Gemini Proxy Error:", error);
    throw error;
  }
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

    // Send only the last 6 messages to reduce token usage
    const recentHistory = history.slice(-6);

    return await fetchWithRetry(recentHistory, prompt);
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    const isRateLimit = errorMessage.includes("429") 
      || errorMessage.includes("quota")
      || errorMessage.includes("Rate limit");

    if (isRateLimit) {
      return "⚠️ The AI is currently busy. Please wait a few seconds and try again.";
    }
    console.error("UNKNOWN_API_ERROR_CAUGHT:", error);
    return `Sorry, I couldn't process that request. Please try again later. (Error details: ${errorMessage})`;
  }
}
