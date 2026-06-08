"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getTranslations } from "@/lib/supabase/data";
import { translations as fallbackTranslations } from "@/lib/world-cup-data";

type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState(fallbackTranslations);

  useEffect(() => {
    let isMounted = true;

    getTranslations()
      .then((supabaseTranslations) => {
        if (isMounted && Object.keys(supabaseTranslations).length > 0) {
          setTranslations(supabaseTranslations);
        }
      })
      .catch((error) => {
        console.error("Failed to load translations from Supabase:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export const languageNames: Record<Language, string> = {
  en: "English",
  bn: "বাংলা",
};
