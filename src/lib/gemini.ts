import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "AIzaSyAW083EQNwzdthLjmf8gNrHtG5rxr35C9E",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  dangerouslyAllowBrowser: true,
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

  /**
   * @param capacity max number of tokens/requests allowed at once
   * @param refillRatePerMinute how many tokens regain per minute
   */
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

    // If we have a token, consume it immediately
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return Promise.resolve();
    }

    // Otherwise, we wait in the queue
    return new Promise<void>((resolve) => {
      const wasEmpty = this.queue.length === 0;
      this.queue.push({ resolve });

      // Calculate exactly how long until the NEXT token is fully available
      if (wasEmpty) {
        const timeToNextToken = Math.ceil((1 - this.tokens) / this.fillRatePerMs);
        setTimeout(() => this.processQueue(), timeToNextToken);
      }
    });
  }
}

// Gemini free-tier starts at 15 Requests Per Minute.
// We use 10 to provide a safety margin for the leaky bucket.
const rmpBucket = new TokenBucket(10, 10);

// Exponential Backoff Config 
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 2000;

/**
 * Attempts to call the OpenAI completion endpoint with our TokenBucket constraint,
 * as well as Exponential Backoff with Jitter in case of global 429s (like other users).
 */
async function fetchWithRetry(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  retries = 0
): Promise<string> {
  try {
    // 1. Wait for client-side token bucket 
    await rmpBucket.acquireToken();

    // 2. Call the API
    const completion = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: messages,
    }, { timeout: 30000 });

    return completion?.choices?.[0]?.message?.content ?? "";

  } catch (error: any) {
    const isRateLimit = error.status === 429
      || error.message?.includes("quota")
      || error.message?.includes("429")
      || error.message?.includes("Rate limit")
      || error.message?.includes("code: 429");

    // 3. Handle Exponential Backoff on 429 Quota Exceeded
    if (isRateLimit && retries < MAX_RETRIES) {
      // Calculate delay with exponential factor + jitter
      const jitter = Math.random() * 1000; // 0 to 1000ms jitter
      const delayMs = Math.pow(2, retries) * BASE_DELAY_MS + jitter;

      console.warn({
        message: "[Rate Limit 429] Retrying...",
        retryAttempt: retries + 1,
        delay: delayMs,
        reason: error.message || String(error)
      });

      await new Promise(resolve => setTimeout(resolve, delayMs));
      return fetchWithRetry(messages, retries + 1); // Retry recursively
    }

    // Unrecoverable error / max retries reached
    console.error("Gemini OpenAI API error:", error);
    throw error;
  }
}

export async function sendChatMessage(
  history: ChatMessage[],
  message: string,
  profileContext?: string
): Promise<string> {
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_INSTRUCTION }
    ];

    // Send only the last 5 messages to reduce token usage
    for (const msg of history.slice(-5)) {
      messages.push({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.parts.map(p => p.text).join(" "),
      });
    }

    const prompt = profileContext
      ? `[Student Profile Context: ${profileContext}]\n\n${message}`
      : message;

    messages.push({ role: "user", content: prompt });

    return await fetchWithRetry(messages);
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
