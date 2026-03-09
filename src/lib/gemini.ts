import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBN2REnQImR7Saj3ajt9ccbwvf5CT7PHxw");

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `You are InternAI, a friendly and helpful AI career assistant for students. You help with:
- Internship recommendations and advice
- Career guidance and path planning
- Skill development suggestions
- Resume and interview tips
- Industry insights

Keep responses clear, concise, and encouraging. Use markdown formatting (bold, bullet points, headers) for readability. 
If the user shares their profile info, use it to personalize advice.
Always be supportive — many users are first-generation students from underserved communities.`,
});

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function sendChatMessage(
  history: ChatMessage[],
  message: string,
  profileContext?: string
): Promise<string> {
  try {
    const chat = model.startChat({ history });

    const prompt = profileContext
      ? `[Student Profile Context: ${profileContext}]\n\n${message}`
      : message;

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API error:", error);
    if (error.message?.includes("quota")) {
      return "⚠️ API rate limit reached. Please try again in a moment.";
    }
    return "Sorry, I couldn't process that request. Please try again.";
  }
}
