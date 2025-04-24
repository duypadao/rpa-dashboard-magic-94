
import {
  Mail,
  Database,
  FileArchive,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  FileCheck,
  Calendar,
  CircleDollarSign,
  BarChart,
  Share2,
  FileSearch,
} from "lucide-react";
import { ReactNode } from "react";

export interface TemplateParameter {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "number";
  placeholder: string;
  description?: string;
  required: boolean;
  options?: { label: string; value: string }[];
}

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  timeSaved: string;
  steps: string[];
  parameters: TemplateParameter[];
}

export const templates: Template[] = [
  {
    id: "email-collection",
    title: "邮件数据收集",
    description: "自动检查收件箱，提取关键数据并汇总到电子表格中",
    icon: <Mail className="h-6 w-6" />,
    timeSaved: "每天省1.5小时",
    steps: [
      "连接到您的邮箱账户",
      "根据主题、发件人和关键词筛选邮件",
      "提取数据并汇总到指定的电子表格"
    ],
    parameters: [
      {
        id: "emailAccount",
        label: "邮箱账户",
        type: "text",
        placeholder: "example@company.com",
        description: "需要具有读取权限的邮箱账户",
        required: true
      },
      {
        id: "searchCriteria",
        label: "搜索条件",
        type: "text",
        placeholder: "主题包含「报表」或发件人来自「finance@company.com」",
        description: "可使用AND、OR组合多个条件",
        required: true
      },
      {
        id: "dataFields",
        label: "需要提取的数据字段",
        type: "textarea",
        placeholder: "日期、金额、客户名称、订单号",
        description: "每行一个字段，机器人会尝试自动识别",
        required: true
      }
    ]
  },
  {
    id: "data-archiving",
    title: "数据归档",
    description: "自动将老旧文件归档到指定位置并释放空间",
    icon: <FileArchive className="h-6 w-6" />,
    timeSaved: "每月省3小时",
    steps: [
      "扫描指定文件夹中的文件",
      "根据日期或其他条件筛选需要归档的文件",
      "将文件压缩并移动到归档位置"
    ],
    parameters: [
      {
        id: "sourcePath",
        label: "源文件夹路径",
        type: "text",
        placeholder: "C:\\工作文件\\报表",
        description: "需要被归档的文件所在路径",
        required: true
      },
      {
        id: "archivePath",
        label: "归档目标路径",
        type: "text",
        placeholder: "D:\\归档\\2023",
        description: "文件将被归档到此位置",
        required: true
      },
      {
        id: "filePattern",
        label: "文件筛选规则",
        type: "text",
        placeholder: "*.xlsx,*.pdf,最后修改时间>90天",
        description: "可使用通配符和条件组合",
        required: true
      }
    ]
  },
  {
    id: "report-generation",
    title: "报表自动生成",
    description: "定期从系统中提取数据并生成标准化报表",
    icon: <FileSpreadsheet className="h-6 w-6" />,
    timeSaved: "每周省4小时",
    steps: [
      "连接数据源（数据库或API）",
      "执行查询并提取数据",
      "生成格式化的Excel或PDF报表"
    ],
    parameters: [
      {
        id: "dataSource",
        label: "数据源",
        type: "select",
        placeholder: "选择数据源类型",
        required: true,
        options: [
          { label: "SQL数据库", value: "sql" },
          { label: "REST API", value: "api" },
          { label: "现有Excel文件", value: "excel" }
        ]
      },
      {
        id: "connectionString",
        label: "连接字符串",
        type: "text",
        placeholder: "数据库连接字符串或API URL",
        description: "用于连接到数据源的详细信息",
        required: true
      },
      {
        id: "query",
        label: "查询语句",
        type: "textarea",
        placeholder: "SELECT * FROM sales WHERE date > '2023-01-01'",
        description: "SQL查询、API参数或Excel范围",
        required: true
      }
    ]
  },
  {
    id: "data-entry",
    title: "数据录入自动化",
    description: "将数据从一个系统自动录入到另一个系统",
    icon: <Database className="h-6 w-6" />,
    timeSaved: "每天省2小时",
    steps: [
      "从源系统提取数据（文件、数据库或网页）",
      "转换数据格式以匹配目标系统",
      "自动填写表单或执行批量导入"
    ],
    parameters: [
      {
        id: "sourceSystem",
        label: "源系统",
        type: "text",
        placeholder: "Excel文件、网页URL或系统名称",
        description: "数据来源位置",
        required: true
      },
      {
        id: "targetSystem",
        label: "目标系统",
        type: "text",
        placeholder: "ERP系统、CRM或网页URL",
        description: "数据需要录入的系统",
        required: true
      },
      {
        id: "mappingRules",
        label: "字段映射规则",
        type: "textarea",
        placeholder: "源字段名称 -> 目标字段名称",
        description: "每行一条映射规则，说明如何转换字段",
        required: true
      }
    ]
  },
  {
    id: "error-monitoring",
    title: "系统错误监控",
    description: "监控系统日志，发现错误时自动通知并生成报告",
    icon: <AlertCircle className="h-6 w-6" />,
    timeSaved: "每周省5小时",
    steps: [
      "定期检查系统日志或错误报告",
      "匹配预定义的错误模式",
      "生成摘要报告并通过电子邮件或消息发送通知"
    ],
    parameters: [
      {
        id: "logPath",
        label: "日志路径",
        type: "text",
        placeholder: "/var/log/application/ 或 C:\\Logs\\",
        description: "需要监控的日志文件位置",
        required: true
      },
      {
        id: "errorPatterns",
        label: "错误模式",
        type: "textarea",
        placeholder: "ERROR:, Exception:, failed with code",
        description: "每行一个错误模式，可使用正则表达式",
        required: true
      },
      {
        id: "notificationEmail",
        label: "通知邮箱",
        type: "text",
        placeholder: "admin@company.com,support@company.com",
        description: "发现错误时接收通知的邮箱(多个用逗号分隔)",
        required: true
      }
    ]
  },
  {
    id: "document-processing",
    title: "文档处理自动化",
    description: "从文档中提取数据，执行验证并生成报告",
    icon: <FileText className="h-6 w-6" />,
    timeSaved: "每天省2.5小时",
    steps: [
      "读取指定文件夹中的文档(PDF、Word等)",
      "使用文本识别提取关键信息",
      "验证数据并转换为结构化格式"
    ],
    parameters: [
      {
        id: "documentFolder",
        label: "文档文件夹",
        type: "text",
        placeholder: "D:\\合同\\新建\\ 或特定网络共享位置",
        description: "包含需要处理文档的文件夹",
        required: true
      },
      {
        id: "documentType",
        label: "文档类型",
        type: "select",
        placeholder: "选择文档类型",
        required: true,
        options: [
          { label: "发票", value: "invoice" },
          { label: "合同", value: "contract" },
          { label: "简历", value: "resume" },
          { label: "其他", value: "other" }
        ]
      },
      {
        id: "dataFields",
        label: "需要提取的字段",
        type: "textarea",
        placeholder: "日期、金额、供应商、参考号",
        description: "每行一个字段，指定需要从文档中提取的内容",
        required: true
      }
    ]
  },
  {
    id: "approval-workflow",
    title: "审批流程自动化",
    description: "监控审批队列，自动执行标准审批并提醒例外情况",
    icon: <FileCheck className="h-6 w-6" />,
    timeSaved: "每周省6小时",
    steps: [
      "监控审批队列或收件箱",
      "根据预定规则自动批准标准请求",
      "将例外情况升级给相关人员处理"
    ],
    parameters: [
      {
        id: "approvalSource",
        label: "审批来源",
        type: "select",
        placeholder: "选择审批来源",
        required: true,
        options: [
          { label: "电子邮件", value: "email" },
          { label: "SharePoint", value: "sharepoint" },
          { label: "内部系统", value: "system" }
        ]
      },
      {
        id: "autoApprovalRules",
        label: "自动审批规则",
        type: "textarea",
        placeholder: "金额<1000元: 自动批准; 来自部门A的请求: 自动批准",
        description: "每行一条规则，定义何种情况下可自动批准",
        required: true
      },
      {
        id: "escalationContact",
        label: "升级联系人",
        type: "text",
        placeholder: "manager@company.com或特定用户ID",
        description: "处理不符合自动审批条件的请求的负责人",
        required: true
      }
    ]
  },
  {
    id: "calendar-sync",
    title: "日历同步与预约管理",
    description: "在多个日历系统之间同步事件并自动化预约流程",
    icon: <Calendar className="h-6 w-6" />,
    timeSaved: "每周省3小时",
    steps: [
      "连接多个日历系统(如Outlook、Google Calendar)",
      "同步事件并解决冲突",
      "根据规则自动接受或拒绝会议邀请"
    ],
    parameters: [
      {
        id: "primaryCalendar",
        label: "主日历账户",
        type: "text",
        placeholder: "your.name@company.com",
        description: "作为主要日历的账户",
        required: true
      },
      {
        id: "secondaryCalendars",
        label: "次要日历账户",
        type: "text",
        placeholder: "personal@gmail.com,team@company.com",
        description: "需要同步的其他日历账户(多个用逗号分隔)",
        required: true
      },
      {
        id: "syncRules",
        label: "同步规则",
        type: "textarea",
        placeholder: "仅工作时间的会议;标记为重要的事件;包含'项目'的事件",
        description: "定义哪些事件需要同步和如何处理冲突",
        required: true
      }
    ]
  },
  {
    id: "invoice-processing",
    title: "发票处理与付款",
    description: "自动处理收到的发票，验证信息并准备付款",
    icon: <CircleDollarSign className="h-6 w-6" />,
    timeSaved: "每月省8小时",
    steps: [
      "从邮件或指定文件夹收集发票",
      "提取关键信息并与采购订单匹配",
      "验证金额和付款条件后准备付款批次"
    ],
    parameters: [
      {
        id: "invoiceSource",
        label: "发票来源",
        type: "select",
        placeholder: "选择发票来源",
        required: true,
        options: [
          { label: "电子邮件", value: "email" },
          { label: "扫描文件夹", value: "folder" },
          { label: "供应商门户", value: "portal" }
        ]
      },
      {
        id: "poDatabase",
        label: "采购订单数据库",
        type: "text",
        placeholder: "数据库连接字符串或Excel文件路径",
        description: "用于验证发票的采购订单信息来源",
        required: true
      },
      {
        id: "approvalThreshold",
        label: "自动审批阈值",
        type: "text",
        placeholder: "5000",
        description: "金额低于此值且匹配PO的发票将自动批准",
        required: true
      }
    ]
  },
  {
    id: "report-distribution",
    title: "报表分发自动化",
    description: "定期生成业务报表并分发给相关人员",
    icon: <BarChart className="h-6 w-6" />,
    timeSaved: "每周省2小时",
    steps: [
      "按计划连接到数据源并生成报表",
      "根据内容应用格式化和条件突出显示",
      "通过邮件或共享文件夹分发给指定接收者"
    ],
    parameters: [
      {
        id: "reportTemplate",
        label: "报表模板",
        type: "text",
        placeholder: "Excel模板文件路径或报表ID",
        description: "用作报表基础的模板文件",
        required: true
      },
      {
        id: "schedule",
        label: "生成计划",
        type: "select",
        placeholder: "选择生成频率",
        required: true,
        options: [
          { label: "每日", value: "daily" },
          { label: "每周", value: "weekly" },
          { label: "每月", value: "monthly" }
        ]
      },
      {
        id: "recipients",
        label: "接收者列表",
        type: "textarea",
        placeholder: "name@company.com,role:manager,department:finance",
        description: "邮箱地址、角色或部门(每行一个)",
        required: true
      }
    ]
  },
  {
    id: "data-sync",
    title: "系统数据同步",
    description: "在不同系统之间自动同步核心业务数据",
    icon: <Share2 className="h-6 w-6" />,
    timeSaved: "每天省1小时",
    steps: [
      "从源系统提取更新的数据",
      "转换格式以匹配目标系统",
      "将数据导入目标系统并验证同步"
    ],
    parameters: [
      {
        id: "sourceSystem",
        label: "源系统",
        type: "text",
        placeholder: "CRM系统URL或数据库连接",
        description: "数据来源系统",
        required: true
      },
      {
        id: "targetSystem",
        label: "目标系统",
        type: "text",
        placeholder: "ERP系统URL或数据库连接",
        description: "数据目标系统",
        required: true
      },
      {
        id: "dataEntities",
        label: "需同步的数据实体",
        type: "textarea",
        placeholder: "客户,产品,订单,价格",
        description: "需要在系统间同步的数据实体(每行一个)",
        required: true
      }
    ]
  },
  {
    id: "contract-analysis",
    title: "合同分析与跟踪",
    description: "自动提取合同关键条款并监控到期日期",
    icon: <FileSearch className="h-6 w-6" />,
    timeSaved: "每月省5小时",
    steps: [
      "分析合同文档并提取关键信息",
      "识别关键日期、义务和条件",
      "建立跟踪系统并设置到期提醒"
    ],
    parameters: [
      {
        id: "contractFolder",
        label: "合同文件夹",
        type: "text",
        placeholder: "D:\\法务\\合同\\ 或网络共享位置",
        description: "存放合同文件的位置",
        required: true
      },
      {
        id: "keyTerms",
        label: "关键条款",
        type: "textarea",
        placeholder: "到期日期,续约条件,付款条款,违约条款",
        description: "需要从合同中提取的关键信息(每行一项)",
        required: true
      },
      {
        id: "notificationPeriod",
        label: "提前通知天数",
        type: "text",
        placeholder: "30",
        description: "合同到期前多少天发送提醒",
        required: true
      }
    ]
  }
];
