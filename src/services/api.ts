import { ProcessNode, Robot } from "@/types/robots";
import { Insight } from "@/components/AiInsights";
import { formatSecond } from "@/common";


//export const API_BASE_URL = "https://localhost:7009/rpa/dashboard";
export const API_BASE_URL = "http://ros:8112/rpa/dashboard";

// API response types
export interface RobotResponse {
  id: string;
  name: string;
  status: "running" | "idle" | "error" | "paused";
  lastRunTime: string | Date;
  lastResult: "success" | "failure" | "warning";
  duration: number | number;
  description?: string;
  defaultProcessFlow?: string[]; // Added default process flow
}

export interface ProcessStepResponse {
  id: number;
  name: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  status: "success" | "warning" | "failure" | "in-progress" | "pending";
  error?: string | null;
}
// Map API response to our app's data structure
export const mapProcessStepsToNodes = (steps: ProcessStepResponse[]): ProcessNode[] => {
  return steps.map((step) => {
    // Map API status to our component's status type
    const statusMap: Record<string, "success" | "warning" | "failure" | "in-progress" | "pending"> = {
      success: "success",
      warning: "warning",
      failure: "failure",
      "in-progress": "in-progress",
      pending: "pending"
    };
    
    return {
      id: `node${step.id}`,
      name: step.name,
      status: statusMap[step.status] || "pending",
      startTime: step.startTime,
      endTime: step.endTime,
      duration: step.duration,
      error: step.error || undefined
    };
  });
};

// Map default process flow to nodes - always set as success status
export const mapDefaultProcessFlowToNodes = (names: string[]): ProcessNode[] => {
  return names.map((name, index) => {
    return {
      id: `node${index + 1}`,
      name: name,
      status: "success", // Always set as success
    };
  });
};

// API service
export const apiService = {
  // Fetch all robots
  async getRobots(t : (key: string, unicorn: object ) => string ): Promise<Robot[]> {
    try {
      // For development, falling back to mock data if API call fails
      const response = await fetch(`${API_BASE_URL}/robots`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: RobotResponse[] = await response.json();
      //Convert lastRunTime to Date type
      console.log(data);
      data.forEach((robot) => {
        robot.lastRunTime = new Date(robot.lastRunTime); // Convert to local date string
        robot.defaultProcessFlow = robot.defaultProcessFlow || []; // Ensure default process flow is an array
        robot.duration = formatSecond(robot.duration, t); // Convert to local date string
      });
      console.log(data);
      return data as Robot[]; // The structure is the same so we can cast directly // .sort(()=> Math.random() - 0.5).slice(0,3)
    } catch (error) {
      console.error("Error fetching robots:", error);
    }
  },
  
  // Get default process flow based on robot definition - always with success status
  getDefaultProcessFlow(robot: Robot): ProcessNode[] {
    if (!robot.defaultProcessFlow || robot.defaultProcessFlow.length === 0) {
      // Return empty array if no default process flow
      return [];
    }
    
    return mapDefaultProcessFlowToNodes(robot.defaultProcessFlow);
  },
  
  
  
  // Other API methods
  async getSuccessRateData() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/success-rate`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching success rate data:", error);
    }
  },
  
  async getTrendData() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/trends`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching trend data:", error);
    }
  },
  
  // Get AI insights based on robots
  async getInsights(): Promise<Insight[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/insights`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  }
};
