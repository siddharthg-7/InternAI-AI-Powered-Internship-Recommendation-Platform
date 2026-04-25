"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
const https_1 = require("firebase-functions/v2/https");
const generative_ai_1 = require("@google/generative-ai");
/**
 * Cloud Function to proxy Gemini API requests.
 * This keeps the API key secure on the server and avoids CORS issues.
 */
exports.chat = (0, https_1.onCall)({
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
        throw new https_1.HttpsError("invalid-argument", "The function must be called with a 'message' argument.");
    }
    // 3. Get API Key from environment variables
    // In production, set this using: firebase functions:secrets:set GOOGLE_API_KEY=your_key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("GOOGLE_API_KEY is not set in environment variables.");
        throw new https_1.HttpsError("failed-precondition", "API Key not configured on server.");
    }
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
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
    }
    catch (error) {
        console.error("Gemini Backend Error:", error);
        throw new https_1.HttpsError("internal", error.message || "Failed to generate content from Gemini.");
    }
});
//# sourceMappingURL=index.js.map