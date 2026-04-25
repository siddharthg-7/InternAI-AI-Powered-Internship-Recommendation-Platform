import { onCall, HttpsError } from "firebase-functions/v2/https";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Cloud Function to proxy Gemini API requests.
 * This keeps the API key secure on the server and avoids CORS issues.
 */
export const chat = onCall({
  // Set appropriate memory and timeout if needed
  memory: "256MiB",
}, async (request) => {
  // 1. Verify Authentication (Optional but recommended)
  // if (!request.auth) {
  //   throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  // }

  const { history, message, systemInstruction } = request.data;

  // 2. Validate input
  if (!message) {
    throw new HttpsError("invalid-argument", "The function must be called with a 'message' argument.");
  }

  // 3. Get API Key from environment variables
  // In production, set this using: firebase functions:secrets:set GOOGLE_API_KEY=your_key
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error("GOOGLE_API_KEY is not set in environment variables.");
    throw new HttpsError("failed-precondition", "API Key not configured on server.");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction 
    });

    // 4. Start chat with history
    const chatSession = model.startChat({
      history: history || [],
    });

    // 5. Send message and get response
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return { text };
  } catch (error: any) {
    console.error("Gemini Backend Error:", error);
    throw new HttpsError("internal", error.message || "Failed to generate content from Gemini.");
  }
});
