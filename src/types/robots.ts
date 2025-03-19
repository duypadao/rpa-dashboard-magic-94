
export interface Robot {
  id: string;
  name: string;
  status: "running" | "idle" | "error" | "paused";
  lastRunTime: string;
  lastResult: "success" | "failure" | "warning";
  duration: string;
  description?: string;
  defaultProcessFlow?: string[];
}

export interface ProcessNode {
  id: string;
  name: string;
  status: "success" | "failure" | "in-progress" | "pending";
  startTime?: string;
  endTime?: string;
  duration?: string;
  error?: string;
}

export interface RunHistoryItem {
  id: string;
  robotId: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: "success" | "failure" | "warning";
  errorMessage?: string;
}
