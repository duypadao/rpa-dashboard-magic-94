import { createContext, useContext, useState, ReactNode } from "react";
import { formatUnicorn } from "@/common";

type Language = "en" | "zh" | "vi";

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
    vi: "RPA Trung tâm"
  },
  overviewTab: {
    en: "Overview",
    zh: "概览",
    vi: "Tổng quan"
  },
  aiInsightsTab: {
    en: "AI Insights",
    zh: "AI 洞察",
    vi: "AI Insights"
  },
  status: {
    en: "Status",
    zh: "状态",
    vi: "Trạng thái",
  },
  lastRun: {
    en: "Last Run",
    zh: "上次运行",
    vi: "Gần nhất"
  },
  duration: {
    en: "Duration",
    zh: "持续时间",
    vi: "Thời gian"
  },
  details: {
    en: "Details",
    zh: "详情",
    vi: "Chi tiết"
  },
  processFlow: {
    en: "Process Flow",
    zh: "流程图",
    vi: "Quy trình"
  },
  defaultProcessFlow: {
    en: "Default Process Flow",
    zh: "默认流程图",
    vi: "Quy trình mặc định"
  },
  notifications: {
    en: "Notifications",
    zh: "通知",
    vi: "Thông báo"
  },
  myAccount: {
    en: "My Account",
    zh: "我的账户",
    vi: "Tài khoản của tôi"
  },
  profile: {
    en: "Profile",
    zh: "个人资料",
    vi: "Cá nhân"
  },
  settings: {
    en: "Settings",
    zh: "设置",
    vi: "Cài đặt",
  },
  logout: {
    en: "Log out",
    zh: "退出登录",
    vi: "Đăng xuất",
  },
  robotError: {
    en: "RPA Robot Error",
    zh: "RPA 机器人错误",
    vi: "Robot Lỗi"
  },
  invoiceRobotError: {
    en: "Invoice Processing Robot #1 has encountered an error",
    zh: "发票处理机器人 #1 遇到错误",
    vi: "invoiceRobotError"
  },
  timeAgo: {
    en: "min ago",
    zh: "分钟前",
    vi: "phút trước"
  },
  language: {
    en: "Language",
    zh: "语言",
    vi: "Ngôn ngữ"
  },
  result: {
    en: "Result",
    zh: "结果",
    vi: "Kết quả"
  },
  success: {
    en: "Success",
    zh: "成功",
    vi: "Thành công"
  },
  warning: {
    en: "Warning",
    zh: "警告",
    vi: "Cảnh báo"
  },
  failure: {
    en: "Failure",
    zh: "失败",
    vi: "Thất bại"
  },
  backToDashboard: {
    en: "Back to Dashboard",
    zh: "返回仪表板",
    vi: "Quay lại"
  },
  inform: {
    en: "Inform",
    zh: "通知",
    vi: "Nhắc nhở"
  },
  notificationSent: {
    en: "Notification sent",
    zh: "通知已发送",
    vi: "Đã gửi thông báo"
  },
  notificationSentDesc: {
    en: "A notification about",
    zh: "关于",
    vi: "Thông báo"
  },
  notificationSentDescEnd: {
    en: "has been sent to the team",
    zh: "的通知已发送给团队",
    vi: "đã gửi cho nhóm"
  },
  history: {
    en: "Run History",
    zh: "运行历史",
    vi: "Lịch sử"
  },
  analytics: {
    en: "AI Analytics",
    zh: "AI 分析",
    vi: "AI Phân tích"
  },
  robotStatusOverview: {
    en: "Robot Status Overview",
    zh: "机器人状态概览",
    vi: "Trạng thái Robot"
  },
  monitorAllRobots: {
    en: "Monitor and manage all automation robots from a single dashboard",
    zh: "从单个仪表板监控和管理所有自动化机器人",
    vi: "Quản lý toàn bộ robot"
  },
  searchRobots: {
    en: "Search robots...",
    zh: "搜索机器人...",
    vi: "Tìm kiếm robot..."
  },
  filterByStatus: {
    en: "Filter by status",
    zh: "按状态筛选",
    vi: "Lọc theo trạng thái"
  },
  allRobots: {
    en: "All Robots",
    zh: "所有机器人",
    vi: "Tất cả"
  },
  running: {
    en: "Running",
    zh: "运行中",
    vi: "Đang chạy"
  },
  stopped: {
    en: "Stopped",
    zh: "已停止",
    vi: "Tạm dừng"
  },
  error: {
    en: "Error",
    zh: "错误",
    vi: "Lỗi"
  },
  aiInsights: {
    en: "AI Insights",
    zh: "AI 洞察",
    vi: "AI Insights"
  },
  noInsightsAvailable: {
    en: "No insights available at this time",
    zh: "目前没有可用的洞察",
    vi: "Không có gì"
  },
  robot: {
    en: "Robot",
    zh: "机器人",
    vi: "Robot"
  },
  couldNotLoadRobots: {
    en: "Could not load robots",
    zh: "无法加载机器人",
    vi: "Không thể tải thông tin"
  },
  tryAgainLater: {
    en: "Please try again later",
    zh: "请稍后再试",
    vi: "Vui lòng thử lại"
  },
  robotsOverview: {
    en: "Robots Overview",
    zh: "机器人概览",
    vi: "Tổng quan Robot"
  },
  availableInsights: {
    en: "Available Insights",
    zh: "可用洞察",
    vi: "Phân tích chuyên sâu"
  },
  currentTask: {
    en: "Current Task",
    zh: "currentTask",
    vi: "Công việc"
  },
  runningRobot:{
    en:"Running Robot",
    zh:"runningRobot",
    vi:"Robot đang làm việc"
  },
  limsNo:{
    en:"LIMS No",
    zh:"LIMS",
    vi:"Mã đơn LIMS"
  },
  automationType:{
    en:"Automation Type",
    zh:"automationType",
    vi:"Loại hình"
  },
  activeRobots:{
    en:"Active Robots",
    zh:"activeRobots",
    vi:"Robot trực tuyến"
  },
  successTasks:{
    en:"Success Tasks",
    zh:"successTasks",
    vi:"Số công việc thành công"
  },
  totalTasks:{
    en:"Total tasks",
    zh:"totalTasks",
    vi:"Tổng số công việc"
  },
  errorRate:{
    en:"Error Rate",
    zh:"errorRate",
    vi:"Tỉ lệ lỗi"
  },
  savingTime:{
    en:"Saving Time",
    zh:"savingTime",
    vi:"Tiết kiệm thời gian"
  },
  robotRunningTime:{
    en:"Robot Running Time",
    zh:"robotRunningTime",
    vi:"Thời gian robot chạy"
  },
  "robotWork {{rate}} % thanManualWork":{
    en:"Robot work {{rate}} % faster than manual work ",
    zh:"robotWork {{rate}} % thanManualWork",
    vi:"Robot làm việc nhanh hơn {{rate}}%  "
  },
  labRobotForUploadingReport:{
    en:"Upload report automatically",
    zh:"labRobotForUploadingReport",
    vi:"Tải báo cáo tự động"
  },
  LABRobots:{
    en: "Labratory Robot",
    zh: "LABRobots",
    vi: "Robot Phòng Thí Nghiệm"
  },
  "{{seconds}}s":{
    en: "{{seconds}}s",
    zh: "{{seconds}}s",
    vi: "{{seconds}} giây"
  },
  "{{minutes}}m{{seconds}}s":{
    en: "{{minutes}}m{{seconds}}s",
    zh: "{{minutes}}m{{seconds}}s",
    vi: "{{minutes}}phút {{seconds}} giây"
  },
  "just now":{
    en: "just now",
    zh: "just now",
    vi: "Vừa xong"
  },
  "totalRobot":{
    en: "Total Robot",
    zh: "totalRobot",
    vi: "Tổng số Robot"
  },
  "{{diffSecs}} seconds ago":{
    en: "{{diffSecs}} seconds ago",
    zh: "{{diffSecs}} seconds ago",
    vi: "{{diffSecs}} giây trước"
  },
  "{{diffMins}} minutes ago":{
    en: "{{diffMins}} minutes ago",
    zh: "{{diffMins}} minutes ago",
    vi: "{{diffMins}} phút trước"
  },
  "{{diffMins}} minute ago":{
    en: "{{diffMins}} minute ago",
    zh: "{{diffMins}} minute ago",
    vi: "{{diffMins}} phút trước"
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, unicorn?: object) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLang] = useState<Language>(localStorage.getItem("i18nextLng") as Language ?? "en");
  const setLanguage = (lang: Language)=>{
    localStorage.setItem("i18nextLng",lang);
    setLang(lang);
  }
  const t = (key: string, unicorn: object = null): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
    }
    else {
      key = translations[key][language];
    }
    if (unicorn) {
      return formatUnicorn(key,unicorn);
    }
    return key;
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
