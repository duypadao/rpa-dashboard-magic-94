
import {
  FolderArchive,
  FolderGit,
  FolderKanban,
  FolderOpenDot,
  FolderOutput,
  ListOrdered,
  NotebookPen,
  NotebookTabs,
  PackageSearch,
  SquareScissors,
  TableProperties,
  UserCheck,
  UserMinus,

} from "lucide-react";

import ppReportEN1 from "../assets/pp-daily-report/1.png";
import ppReportEN2 from "../assets/pp-daily-report/2.png";
import ppReportEN3 from "../assets/pp-daily-report/3.png";
import ppReportVN1 from "../assets/pp-daily-report/1v.png";
import ppReportVN2 from "../assets/pp-daily-report/2v.png";
import ppReportVN3 from "../assets/pp-daily-report/3v.png";
import ppReportCN1 from "../assets/pp-daily-report/1c.png";
import ppReportCN2 from "../assets/pp-daily-report/2c.png";
import ppReportCN3 from "../assets/pp-daily-report/3c.png";

import { ReactNode } from "react";
import { ScheduleOptions, transformEveryDayAt } from "./scheduleOptions";

export interface TemplateParameter {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "number";
  placeholder: string;
  description?: string;
  required: boolean;
  options?: { label: string; value: string }[];
}
export interface Automation {
  id: number;
  automationName: string;
  description: string;
  executionType: string;
  jSONParam: string;
  owner: string;
  manualOperationTimeInSeconds: number;
  isActive: boolean;
  lastUpdatedTime: string;
}

export interface AutomationCreationModel {
  automation: Automation;
  schedules: ScheduleOptions[];
}

type Department = "all-department" | "post-process" | "pre-process" | "warehouse" | "packing";

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  department: Department[];
  type: "general" | "custom";
  category: "automatic report generation" | "data integration automation" | "real time monitor"; // automatic report generation
  status: "ready" | "developing";
  robot: string;
  timeSaved: string;
  steps: string[];
  parameters: TemplateParameter[];
  parameterValidation?: (params: object) => Promise<{ isValid: boolean, messages: Record<string, string> }>;
  preview?: Record<string, ReactNode>;
  recommendSettings?: ScheduleOptions[];
  generateDescription?: (param: Record<string, string>, t: (key: string, unicorn?: object) => string) => string;
  createAutomation?: (schedules: ScheduleOptions[], param: Record<string, string>, description: string, t: (key: string, unicorn: object) => string) => AutomationCreationModel
}

const validateWecomRobotID = async (id: string) => {
  let robotId = "id";
  if (id.includes("key=")) {
    robotId = id.substring(id.indexOf("key=") + 4);
  }
  else {
    robotId = id;
  }
  let formData = new FormData();
  formData.append('robotId', robotId);
  formData.append('message', 'Wecom Robot Test');
  try {
    const req = await fetch("http://ros:8103/utility/wecom/message", {
      "body": formData,
      "method": "POST",
    });
    if (req.status === 200) {
      return { isValid: true }
    }
  }
  catch {

  }
  return { isValid: false, message: "invalidRobotId" }
}

export const templates: Template[] = [
  {
    id: "shp-exportplan",
    title: "shp-exportplan",
    description: "shp-exportplan-desc", // "",
    icon: <FolderOutput className="h-6 w-6" />,
    category: "data integration automation",
    department: ["warehouse"],
    status: "ready",
    robot: "Outlook Bot",
    type: "custom",
    timeSaved: "",
    steps: [],
    parameters: []
  },
  {
    id: "cutting-plan",
    title: "cutting-plan",
    description: "cutting-plan-desc",// "",
    icon: <FolderKanban className="h-6 w-6" />,
    category: "data integration automation",
    department: ["pre-process"],
    status: "ready",
    robot: "Outlook Bot",
    type: "custom",
    timeSaved: "",
    steps: [],
    parameters: []
  },
  {
    id: "vne-ppc-exportplan",
    title: "vne-ppc-exportplan", //"VNE PPC Export Plan",
    description: "vne-ppc-exportplan-desc",// "",
    icon: <FolderOpenDot className="h-6 w-6" />,
    category: "data integration automation",
    department: ["packing", "post-process", "pre-process"],
    status: "ready",
    robot: "Outlook Bot",
    type: "custom",
    timeSaved: "",
    steps: [],
    parameters: []
  },
  {
    id: "dm014",
    title: "dm014",//"Post Process Worker Overtime",
    description: "dm014-desc",//"",
    icon: <FolderGit className="h-6 w-6" />,
    category: "data integration automation",
    department: ["post-process"],
    status: "ready",
    robot: "Outlook Bot",
    type: "custom",
    timeSaved: "",
    steps: [],
    parameters: []
  },
  {
    id: "ijt-report",
    title: "ijt-report",
    description: "ijt-report-desc",//"",
    icon: <FolderArchive className="h-6 w-6" />,
    category: "automatic report generation",
    department: ["pre-process"],
    status: "ready",
    robot: "Reporter",
    type: "custom",
    timeSaved: "",
    steps: [],
    parameters: []
  },
  {
    id: "rm060",
    title: "rm060",
    description: "rm060-desc",//"",
    icon: <PackageSearch className="h-6 w-6" />,
    category: "automatic report generation",
    department: ["post-process"],
    status: "ready",
    robot: "Reporter",
    type: "custom",
    timeSaved: "",
    steps: [],
    parameters: []
  },
  {
    id: "hyr002",
    title: "hyr002",
    description: "hyr002-desc", //"",
    icon: <ListOrdered className="h-6 w-6" />,
    category: "automatic report generation",
    department: ["post-process"],
    status: "ready",
    robot: "Reporter",
    type: "custom",
    timeSaved: "",
    steps: [],
    parameters: []
  },
  {
    id: "pp-daily-report",
    title: "pp-daily-report",
    description: "pp-daily-report-desc",
    icon: <TableProperties className="h-6 w-6" />,
    category: "automatic report generation",
    department: ["post-process"],
    status: "ready",
    robot: "Reporter",
    type: "general",
    timeSaved: "",
    steps: [
      "collectETSData",
      "collectFRData",
      "collectROSData",
      "analyze",
      "createReportLayout",
      "sendResultToWecom"
    ],
    parameters: [
      {
        id: "level",
        label: "level",
        type: "select",
        placeholder: "selectOrganizationLevel",
        required: true,
        options: [
          { label: "factory", value: "factory" },
          { label: "department", value: "department" },
          { label: "workshop", value: "workshop" },
          { label: "workline", value: "workline" },
        ]
      },
      {
        id: "key",
        label: "key",
        type: "text",
        placeholder: "pleaseInputOrganization",
        required: true
      },
      {
        id: "language",
        label: "language",
        type: "select",
        placeholder: "select Language",
        required: true,
        options: [
          { label: "vietnamese", value: "vi" },
          { label: "chinese", value: "cn" },
          { label: "english", value: "en" },
        ]
      },
      {
        id: "wecomRobotId",
        label: "wecomRobotId",
        type: "text",
        placeholder: "wecomRobotConfigUrl",
        required: true
      },
    ],
    parameterValidation: async (params: any) => {
      let isValid = true;
      const messages = {};
      try {
        const worklines = await (await fetch(`http://ros:8108/pp/list/${params.level}/${params.key}`)).json();
        if (worklines.length < 1) {
          isValid = false;
          messages["key"] = "organizationIsNotValid";
        }
        const wecomRobotValidate = await validateWecomRobotID(params.wecomRobotId);
        if (!wecomRobotValidate.isValid) {
          isValid = false;
          messages["wecomRobotId"] = wecomRobotValidate.message;
        }
      }
      catch {

      }
      return {
        isValid, messages
      }

    },
    preview: {
      chinese: <div className="flex flex-wrap gap-1">
        <img className="object-scale-down ..." src={ppReportCN1} />
        <img className="object-scale-down ..." src={ppReportCN2} />
        <img className="object-scale-down ..." src={ppReportCN3} />
      </div>,
      english: <div className="flex flex-wrap">
        <img className="object-scale-down ..." src={ppReportEN1} />
        <img className="object-scale-down ..." src={ppReportEN2} />
        <img className="object-scale-down ..." src={ppReportEN3} />
      </div>,
      vietnamese: <div className="flex flex-wrap">
        <img className="object-scale-down ..." src={ppReportVN1} />
        <img className="object-scale-down ..." src={ppReportVN2} />
        <img className="object-scale-down ..." src={ppReportVN3} />
      </div>,

    },
    recommendSettings: [
      transformEveryDayAt(10, 0),
      transformEveryDayAt(12, 0),
      transformEveryDayAt(14, 0),
      transformEveryDayAt(16, 0),
      transformEveryDayAt(18, 0),
    ],
    generateDescription: (param: Record<string, string>, t: (key: string, unicorn?: object) => string) => {
      return `${t("pp-daily-report")} ${t(param.level)} ${param.key}`
    },
    createAutomation: (schedules: ScheduleOptions[], param: Record<string, string>, description: string, t: (key: string, unicorn: object) => string) => {
      return {
        automation: {
          id: 0,
          automationName: "pp-daily-report",
          description: description,
          executionType: "",
          jSONParam: JSON.stringify(param),
          owner: "",
          manualOperationTimeInSeconds: 300,
          isActive: true,
          lastUpdatedTime: "2000-01-01"
        },
        schedules: schedules
      } as AutomationCreationModel
    }
  },
  {
    id: "pp-weekly-report",
    title: "pp-weekly-report",
    description: "pp-weekly-report-desc",
    icon: <NotebookTabs className="h-6 w-6" />,
    category: "automatic report generation",
    department: ["post-process"],
    status: "developing",
    robot: "Reporter",
    type: "general",
    timeSaved: "",
    steps: [],
    parameters: []
  },
  {
    id: "pp-monthly-report",
    title: "pp-monthly-report",
    description: "pp-monthly-report-desc",
    icon: <NotebookPen className="h-6 w-6" />,
    category: "automatic report generation",
    department: ["post-process"],
    status: "developing",
    robot: "Reporter",
    type: "general",
    timeSaved: "",
    steps: [],
    parameters: []
  },

  {
    id: "hr-daily-attendance",
    title: "hr-daily-attendance",
    description: "hr-daily-attendance-description",
    icon: <UserCheck className="h-6 w-6" />,
    category: "automatic report generation",
    department: ["all-department"],
    status: "developing",
    robot: "Reporter",
    type: "general",
    timeSaved: "",
    steps: [],
    parameters: []
  },
  {
    id: "hr-resignation",
    title: "hr-resignation", //"Resignation Report",
    description: "hr-resignation-description", //"Generate report for resignation",
    icon: <UserMinus className="h-6 w-6" />,
    category: "automatic report generation",
    department: ["all-department"],
    status: "developing",
    robot: "Reporter",
    type: "general",
    timeSaved: "",
    steps: [],
    parameters: []
  },
  {
    id: "cutting-report",
    title: "cutting-report", //"Resignation Report",
    description: "cutting-report-description", //"Generate report for resignation",
    icon: <SquareScissors className="h-6 w-6" />,
    category: "automatic report generation",
    department: ["pre-process"],
    status: "developing",
    robot: "Reporter",
    type: "general",
    timeSaved: "",
    steps: [],
    parameters: []
  },

]
