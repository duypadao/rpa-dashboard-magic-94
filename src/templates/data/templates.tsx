
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
  TableProperties,
  UserCheck,
  UserMinus,

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
    description: "dm014-desc" ,//"",
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
    steps: [],
    parameters: []
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

]
