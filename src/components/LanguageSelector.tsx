import { useLanguage, Language } from "@/context/LanguageContext";
import { FaGlobe } from "react-icons/fa";

export function LanguageSelector() {
  const { language, setLanguage, languageNames } = useLanguage();

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <FaGlobe className="w-3.5 h-3.5 text-muted-foreground" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent text-xs font-medium text-foreground border border-border rounded-lg px-2 py-1.5 pr-6 focus:outline-none focus:border-primary/40 cursor-pointer appearance-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}
      >
        {(Object.keys(languageNames) as Language[]).map((lang) => (
          <option key={lang} value={lang}>{languageNames[lang]}</option>
        ))}
      </select>
    </div>
  );
}
