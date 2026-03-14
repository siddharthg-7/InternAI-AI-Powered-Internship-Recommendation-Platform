import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "AIzaSyCYfX-pEaSH69lwiCWi_tAP7Wp3E-BZ9No",
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

export async function sendChatMessage(
  history: ChatMessage[],
  message: string,
  profileContext?: string
): Promise<string> {
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_INSTRUCTION }
    ];

    for (const msg of history) {
      messages.push({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.parts.map(p => p.text).join(" "),
      });
    }

    const prompt = profileContext
      ? `[Student Profile Context: ${profileContext}]\n\n${message}`
      : message;

    messages.push({ role: "user", content: prompt });

    const completion = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: messages,
    });

    return completion.choices[0].message.content || "";
  } catch (error: any) {
    console.error("Gemini OpenAI API error:", error);
    if (error.message?.includes("quota") || error.message?.includes("429") || error.message?.includes("Rate limit")) {
      return "⚠️ API rate limit reached. Please try again in a moment.";
    }
    return "Sorry, I couldn't process that request. Please try again.";
  }
}
