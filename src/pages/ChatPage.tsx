import { useState, useRef, useEffect } from "react";
import { useAppState } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { sendChatMessage, ChatMessage } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";

interface UIMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const { profile } = useAppState();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<UIMessage[]>([
    { role: "assistant", content: t("chat.greeting") },
  ]);
  const [geminiHistory, setGeminiHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const profileContext = profile
    ? `Education: ${profile.education}, Field: ${profile.fieldOfStudy}, Skills: ${profile.skills.join(", ")}, Interest: ${profile.interest}, Location: ${profile.location}, Experience: ${profile.experience}`
    : undefined;

  const QUICK_QUESTIONS = [t("chat.q1"), t("chat.q2"), t("chat.q3"), t("chat.q4")];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userText = text.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(geminiHistory, userText, profileContext);
      setGeminiHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ text: userText }] },
        { role: "model", parts: [{ text: response }] },
      ]);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat.error") },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display font-semibold text-sm text-foreground">{t("chat.title")}</h1>
          <p className="text-[10px] text-success font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-success rounded-full" /> {t("chat.powered")}
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary" : "gradient-primary"}`}>
                {msg.role === "user" ? <User className="w-3 h-3 text-primary-foreground" /> : <Bot className="w-3 h-3 text-primary-foreground" />}
              </div>
              <div className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card border border-border text-foreground rounded-tl-sm"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:my-2">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Bot className="w-3 h-3 text-primary-foreground" />
            </div>
            <div className="bg-card border border-border rounded-xl rounded-tl-sm px-4 py-3 flex gap-1">
              {[0, 150, 300].map((d) => (
                <span key={d} className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {messages.length <= 2 && (
        <div className="px-6 pb-2">
          <p className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {t("chat.tryAsking")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-[11px] bg-primary/8 text-primary font-medium px-3 py-1.5 rounded-lg hover:bg-primary/15 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-6 py-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder={t("chat.placeholder")}
            className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-xs transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="p-2.5 gradient-primary rounded-xl text-primary-foreground shadow-glow disabled:opacity-40 transition-all hover:opacity-90"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
