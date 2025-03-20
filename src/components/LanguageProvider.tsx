
import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "zh";

type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

// Add all translatable texts here
const translations: Translations = {
  dashboard: {
    en: "RPA Dashboard",
    zh: "RPA 仪表板",
  },
  overviewTab: {
    en: "Overview",
    zh: "概览",
  },
  aiInsightsTab: {
    en: "AI Insights",
    zh: "AI 洞察",
  },
  status: {
    en: "Status",
    zh: "状态",
  },
  lastRun: {
    en: "Last Run",
    zh: "上次运行",
  },
  duration: {
    en: "Duration",
    zh: "持续时间",
  },
  details: {
    en: "Details",
    zh: "详情",
  },
  processFlow: {
    en: "Process Flow",
    zh: "流程图",
  },
  defaultProcessFlow: {
    en: "Default Process Flow",
    zh: "默认流程图",
  },
  notifications: {
    en: "Notifications",
    zh: "通知",
  },
  myAccount: {
    en: "My Account",
    zh: "我的账户",
  },
  profile: {
    en: "Profile",
    zh: "个人资料",
  },
  settings: {
    en: "Settings",
    zh: "设置",
  },
  logout: {
    en: "Log out",
    zh: "退出登录",
  },
  robotError: {
    en: "RPA Robot Error",
    zh: "RPA 机器人错误",
  },
  invoiceRobotError: {
    en: "Invoice Processing Robot #1 has encountered an error",
    zh: "发票处理机器人 #1 遇到错误",
  },
  timeAgo: {
    en: "min ago",
    zh: "分钟前",
  },
  language: {
    en: "Language",
    zh: "语言",
  },
  result: {
    en: "Result",
    zh: "结果",
  },
  success: {
    en: "Success",
    zh: "成功",
  },
  warning: {
    en: "Warning",
    zh: "警告",
  },
  failure: {
    en: "Failure",
    zh: "失败",
  },
  backToDashboard: {
    en: "Back to Dashboard",
    zh: "返回仪表板",
  },
  inform: {
    en: "Inform",
    zh: "通知",
  },
  notificationSent: {
    en: "Notification sent",
    zh: "通知已发送",
  },
  notificationSentDesc: {
    en: "A notification about",
    zh: "关于",
  },
  notificationSentDescEnd: {
    en: "has been sent to the team",
    zh: "的通知已发送给团队",
  },
  history: {
    en: "Run History",
    zh: "运行历史",
  },
  analytics: {
    en: "AI Analytics",
    zh: "AI 分析",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
