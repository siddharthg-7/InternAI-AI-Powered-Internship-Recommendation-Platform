import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import enMessages from "@/locales/en.json";
import hiMessages from "@/locales/hi.json";
import teMessages from "@/locales/te.json";

export type Language = "en" | "hi" | "te";

const translations: Record<Language, Record<string, string>> = {
  en: enMessages,
  hi: hiMessages,
  te: teMessages,
};

export const languageNames: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  te: "తెలుగు",
};

/** ISO lang codes for html[lang] attribute */
const langCodes: Record<Language, string> = {
  en: "en",
  hi: "hi",
  te: "te",
};

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languageNames: Record<Language, string>;
}

const LanguageContext = createContext<LanguageState>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  languageNames,
});

/**
 * Detects language from URL prefix: /hi/... or /te/...
 * Falls back to localStorage, then browser language, then "en".
 */
function detectLanguage(): Language {
  // Check URL prefix
  const path = window.location.pathname;
  const match = path.match(/^\/(hi|te)(\/|$)/);
  if (match && (match[1] === "hi" || match[1] === "te")) {
    return match[1] as Language;
  }

  // Check localStorage
  const saved = localStorage.getItem("app-language");
  if (saved === "hi" || saved === "te" || saved === "en") return saved;

  // Check browser language
  const browserLang = navigator.language?.substring(0, 2);
  if (browserLang === "hi") return "hi";
  if (browserLang === "te") return "te";

  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  // Sync html[lang] attribute and hreflang meta tags
  useEffect(() => {
    document.documentElement.lang = langCodes[language];
    document.documentElement.dir = "ltr"; // All supported languages are LTR

    // Update/add hreflang link tags for SEO
    const baseUrl = window.location.origin;
    const currentPath = window.location.pathname.replace(/^\/(en|hi|te)(\/|$)/, "/");

    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

    // Add hreflang for each language
    const languages: Language[] = ["en", "hi", "te"];
    languages.forEach((lang) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = langCodes[lang];
      link.href = lang === "en" ? `${baseUrl}${currentPath}` : `${baseUrl}/${lang}${currentPath}`;
      document.head.appendChild(link);
    });

    // Add x-default
    const defaultLink = document.createElement("link");
    defaultLink.rel = "alternate";
    defaultLink.setAttribute("hreflang", "x-default");
    defaultLink.href = `${baseUrl}${currentPath}`;
    document.head.appendChild(defaultLink);

    // Update page title based on language
    const titles: Record<Language, string> = {
      en: "InternAI — Find the Right Internship in Seconds",
      hi: "InternAI — सेकंडों में सही इंटर्नशिप खोजें",
      te: "InternAI — సెకన్లలో సరైన ఇంటర్న్‌షిప్ కనుగొనండి",
    };
    document.title = titles[language];

    // Update meta description
    const descriptions: Record<Language, string> = {
      en: "AI-powered internship matching for students. Get personalized recommendations based on your skills and interests.",
      hi: "छात्रों के लिए AI-संचालित इंटर्नशिप मैचिंग। अपने कौशल और रुचियों के आधार पर व्यक्तिगत सिफारिशें पाएं।",
      te: "విద్యార్థుల కోసం AI-ఆధారిత ఇంటర్న్‌షిప్ మ్యాచింగ్. మీ నైపుణ్యాలు మరియు ఆసక్తుల ఆధారంగా వ్యక్తిగత సిఫార్సులు పొందండి.",
    };
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", descriptions[language]);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);

    // Update URL prefix for SEO-friendly language URLs
    const currentPath = window.location.pathname.replace(/^\/(en|hi|te)(\/|$)/, "/");
    const newPath = lang === "en" ? currentPath : `/${lang}${currentPath}`;
    window.history.replaceState(null, "", newPath);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageNames }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
