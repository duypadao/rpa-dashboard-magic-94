
export interface Robot {
  id: string;
  name: string;
  status: "running" | "idle" | "error" | "paused";
  lastRunTime: string;
  lastResult: "success" | "failure" | "warning";
  duration: string;
  description?: string;
  defaultProcessFlow?: string[];
  processNodes?: ProcessNode[];
}

export interface ProcessNode {
  id: string;
  name: string;
  status: "success" | "warning" | "failure" | "in-progress" | "pending";
  startTime?: string;
  endTime?: string;
  duration?: string;
  error?: string;
  manualProcessingTime?: number 
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
