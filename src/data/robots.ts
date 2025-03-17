
import { Insight } from "@/components/AiInsights";
import { ProcessNode } from "@/components/ProcessFlow";

export interface Robot {
  id: string;
  name: string;
  status: "running" | "idle" | "error" | "paused";
  lastRunTime: string;
  lastResult: "success" | "failure" | "warning";
  duration: string;
  description?: string;
}

export const robots: Robot[] = [
  {
    id: "1",
    name: "Invoice Processing Bot",
    status: "running",
    lastRunTime: "2023-10-15 14:30",
    lastResult: "success",
    duration: "45m 12s",
    description: "Processes invoice PDFs and enters data into accounting system",
  },
  {
    id: "2",
    name: "Customer Onboarding Bot",
    status: "idle",
    lastRunTime: "2023-10-14 09:15",
    lastResult: "success",
    duration: "12m 30s",
    description: "Automates new customer data entry and verification workflow",
  },
  {
    id: "3",
    name: "Order Fulfillment Bot",
    status: "error",
    lastRunTime: "2023-10-15 10:45",
    lastResult: "failure",
    duration: "2m 18s",
    description: "Processes new orders and updates inventory management system",
  },
  {
    id: "4",
    name: "HR Data Migration Bot",
    status: "paused",
    lastRunTime: "2023-10-13 16:20",
    lastResult: "warning",
    duration: "1h 05m",
    description: "Transfers employee data between HR systems",
  },
  {
    id: "5",
    name: "Monthly Reporting Bot",
    status: "idle",
    lastRunTime: "2023-10-01 08:00",
    lastResult: "success",
    duration: "3h 22m",
    description: "Generates and distributes monthly performance reports",
  },
  {
    id: "6",
    name: "Email Classification Bot",
    status: "running",
    lastRunTime: "2023-10-15 12:10",
    lastResult: "success",
    duration: "Running...",
    description: "Classifies and routes customer emails to appropriate departments",
  },
  {
    id: "7",
    name: "Data Validation Bot",
    status: "idle",
    lastRunTime: "2023-10-14 11:30",
    lastResult: "success",
    duration: "25m 42s",
    description: "Validates data integrity across multiple systems",
  },
  {
    id: "8",
    name: "Customer Service Bot",
    status: "error",
    lastRunTime: "2023-10-15 09:00",
    lastResult: "failure",
    duration: "5m 03s",
    description: "Handles customer service ticket assignment and prioritization",
  },
];

export const getProcessNodes = (robotId: string): ProcessNode[] => {
  const nodes: ProcessNode[] = [
    {
      id: "node1",
      name: "Initialize Process",
      status: "success",
      startTime: "2023-10-15 14:30:00",
      endTime: "2023-10-15 14:30:05",
      duration: "5s",
    },
    {
      id: "node2",
      name: "Connect to Data Source",
      status: "success",
      startTime: "2023-10-15 14:30:05",
      endTime: "2023-10-15 14:30:10",
      duration: "5s",
    },
    {
      id: "node3",
      name: "Extract Data",
      status: "success",
      startTime: "2023-10-15 14:30:10",
      endTime: "2023-10-15 14:30:25",
      duration: "15s",
    },
    {
      id: "node4",
      name: "Transform Data",
      status: "success", 
      startTime: "2023-10-15 14:30:25",
      endTime: "2023-10-15 14:30:40",
      duration: "15s",
    },
  ];

  // Customize nodes based on robot status
  if (robotId === "3" || robotId === "8") {
    return [
      ...nodes.slice(0, 3),
      {
        id: "node4",
        name: "Transform Data",
        status: "failure",
        startTime: "2023-10-15 14:30:25",
        endTime: "2023-10-15 14:30:27",
        duration: "2s",
        error: "Invalid data format encountered: Expected numeric value but received string",
      },
      {
        id: "node5",
        name: "Load Data",
        status: "pending",
      },
    ];
  } else if (robotId === "6") {
    return [
      ...nodes,
      {
        id: "node5",
        name: "Load Data",
        status: "in-progress",
        startTime: "2023-10-15 14:30:40",
        endTime: undefined,
        duration: "Running...",
      },
    ];
  } else {
    return [
      ...nodes,
      {
        id: "node5",
        name: "Load Data",
        status: "success",
        startTime: "2023-10-15 14:30:40",
        endTime: "2023-10-15 14:30:50",
        duration: "10s",
      },
      {
        id: "node6",
        name: "Validation",
        status: "success",
        startTime: "2023-10-15 14:30:50",
        endTime: "2023-10-15 14:31:00",
        duration: "10s",
      },
      {
        id: "node7",
        name: "Process Complete",
        status: "success",
        startTime: "2023-10-15 14:31:00",
        endTime: "2023-10-15 14:31:05",
        duration: "5s",
      },
    ];
  }
};

export const getRobotById = (id: string) => {
  return robots.find(robot => robot.id === id);
};

export const getHistoryData = () => {
  return [
    {
      date: "2023-10-15 14:30:00",
      result: "success",
      duration: "45m 12s",
    },
    {
      date: "2023-10-14 10:15:00",
      result: "success",
      duration: "46m 05s",
    },
    {
      date: "2023-10-13 09:22:00",
      result: "warning",
      duration: "50m 30s",
    },
    {
      date: "2023-10-12 15:10:00",
      result: "failure",
      duration: "12m 45s",
    },
    {
      date: "2023-10-11 11:05:00",
      result: "success",
      duration: "44m 22s",
    },
  ];
};

export const getSuccessRateData = () => {
  return [
    { name: "Success", value: 72, color: "hsl(var(--success))" },
    { name: "Warning", value: 18, color: "hsl(var(--warning))" },
    { name: "Failure", value: 10, color: "hsl(var(--error))" },
  ];
};

export const getTrendData = () => {
  return [
    {
      name: "Week 1",
      success: 35,
      failure: 4,
      duration: 42,
    },
    {
      name: "Week 2",
      success: 38,
      failure: 3,
      duration: 39,
    },
    {
      name: "Week 3",
      success: 32,
      failure: 6,
      duration: 45,
    },
    {
      name: "Week 4",
      success: 40,
      failure: 2,
      duration: 38,
    },
    {
      name: "Week 5",
      success: 42,
      failure: 1,
      duration: 36,
    },
  ];
};

export const getAiInsights = (): Insight[] => {
  return [
    {
      id: "insight1",
      title: "Anomaly Detected: Unusual Processing Time",
      description: "Invoice Processing Bot is taking 23% longer than average to complete tasks since yesterday.",
      type: "anomaly",
      severity: "medium",
      robot: "Invoice Processing Bot"
    },
    {
      id: "insight2",
      title: "Recurring Error Pattern",
      description: "Order Fulfillment Bot fails at the same step consistently when processing orders from international vendors.",
      type: "anomaly",
      severity: "high",
      robot: "Order Fulfillment Bot"
    },
    {
      id: "insight3",
      title: "Performance Optimization Opportunity",
      description: "Data validation step could be optimized to reduce processing time by an estimated 15%.",
      type: "optimization",
      severity: "low",
      robot: "Data Validation Bot"
    },
    {
      id: "insight4",
      title: "Resource Allocation Suggestion",
      description: "Schedule Email Classification Bot to run during off-peak hours to improve overall system performance.",
      type: "optimization",
      severity: "medium",
      robot: "Email Classification Bot"
    },
    {
      id: "insight5",
      title: "Upcoming System Maintenance Impact",
      description: "Scheduled maintenance may affect 3 robots. Consider rescheduling their runs to avoid disruption.",
      type: "prediction",
      severity: "medium"
    },
    {
      id: "insight6",
      title: "Workload Forecast",
      description: "Expected 35% increase in invoice processing volume next week based on historical patterns.",
      type: "prediction",
      severity: "low",
      robot: "Invoice Processing Bot"
    },
  ];
};
