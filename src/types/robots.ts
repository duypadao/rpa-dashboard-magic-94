import { NumericKeys } from "node_modules/react-hook-form/dist/types/path/common";

export interface Robot {
  id: string;
  name: string;
  status: "running" | "idle" | "error" | "paused" | "offline";
  lastRunTime: string | Date;
  lastResult: "success" | "failure" | "warning";
  duration: string | number;
  description?: string;
  defaultProcessFlow?: string[];
  processNodes?: ProcessNode[];
  reportCount?: number;
  successCount?: number;
  pendingCount?:number;
  errorCount?: number;
  totalRunningDuration?: number;
  estimateSavingDuration?: number;
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
