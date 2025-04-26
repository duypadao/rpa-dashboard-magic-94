import { createContext, useContext, useState, ReactNode } from "react";
import { formatUnicorn } from "@/common";
import { translations  } from "./translation/translations";
import { processTranslations } from "./translation/processTranslation"

export type Language = "en" | "cn" | "vi";

export type Translations = {
  [group: string]: {
    [key: string]: {
      [key in Language]: string;
    };
  };
};

// Add all translatable texts here



type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, unicorn?: object) => string;
  tp: (key: string, unicorn?: object) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLang] = useState<Language>(localStorage.getItem("i18nextLng") as Language ?? "en");
  const setLanguage = (lang: Language)=>{
    localStorage.setItem("i18nextLng",lang);
    setLang(lang);
  }
  const t = (key: string, unicorn: object = null): string => {
    let group = "common";
    let subKey = key;

    // Check if the key includes a group specifier
    if (key.includes(".")) {
      const parts = key.split(".");
      group = parts[0];
      subKey = parts[1];
    }

    // Check if the group and subKey exist in translations
    if (!translations[group] || !translations[group][subKey]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    let text = translations[group][subKey][language];

    if (unicorn) {
      return formatUnicorn(text, unicorn);
    }
    return text;
  };
  
  const tp = (key) => {
    if (processTranslations[key]) {
      return processTranslations[key][language] || key;
    }
  
    // Thử loại bỏ số ở cuối key (nếu có)
    const match = key.match(/^(.+?)(?::(\S+)|\s+(\d+))$/);
    
    if (match) {
        const match1 = match[1].trim(); 
        const match2 = match[2] || match[3] || ""; 
        
        if (processTranslations[match1]) {
            return (processTranslations[match1][language] || match1) + match2;
        }
    }
  
    console.warn(`Not found: ${key}`);
    return key;
};


  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tp }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
