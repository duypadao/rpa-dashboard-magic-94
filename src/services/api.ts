import { Robot } from "@/data/robots";
import { ProcessNode } from "@/components/ProcessFlow";
import { Insight } from "@/components/AiInsights";
import { InvoiceHistoryItem } from "@/pages/subpages/components/InvoiceHistory";

// API response types
export interface RobotResponse {
  id: string;
  name: string;
  status: "running" | "idle" | "error" | "paused";
  lastRunTime: string;
  lastResult: "success" | "failure" | "warning";
  duration: string;
  description?: string;
}

export interface ProcessStepResponse {
  Step: string;
  ResultStep: "Done" | "Error" | "Executing" | "InProgress";
  startTime?: string;
  endTime?: string;
  duration?: string;
  errorMessage?: string;
}

// Map API response to our app's data structure
export const mapProcessStepsToNodes = (steps: ProcessStepResponse[]): ProcessNode[] => {
  return steps.map((step, index) => {
    // Map API status to our component's status type
    const statusMap: Record<string, "success" | "failure" | "in-progress" | "pending"> = {
      Done: "success",
      Error: "failure",
      Executing: "in-progress",
      InProgress: "pending"
    };
    
    return {
      id: `node${index + 1}`,
      name: step.Step,
      status: statusMap[step.ResultStep],
      startTime: step.startTime,
      endTime: step.endTime,
      duration: step.duration,
      error: step.errorMessage
    };
  });
};

// API Endpoints
const API_BASE_URL = "https://localhost:7009/rpa/dashboard"; // Replace with your actual API URL

// API service
export const apiService = {
  // Fetch all robots
  async getRobots(): Promise<Robot[]> {
    try {
      // For development, falling back to mock data if API call fails
      const response = await fetch(`${API_BASE_URL}/robots`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: RobotResponse[] = await response.json();
      return data as Robot[]; // The structure is the same so we can cast directly
    } catch (error) {
      console.error("Error fetching robots:", error);
      
      // Import and return mock data as fallback
      const { robots } = await import("@/data/robots");
      return robots;
    }
  },
  
  // Fetch a single robot by ID
  async getRobotById(id: string): Promise<Robot | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/robots/${id}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: RobotResponse = await response.json();
      return data as Robot;
    } catch (error) {
      console.error(`Error fetching robot ${id}:`, error);
      
      // Import and return mock data as fallback
      const { getRobotById } = await import("@/data/robots");
      return getRobotById(id);
    }
  },
  
  // Fetch process steps for a robot
  async getProcessSteps(robotId: string): Promise<ProcessNode[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/robots/${robotId}/process`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: ProcessStepResponse[] = await response.json();
      return mapProcessStepsToNodes(data);
    } catch (error) {
      console.error(`Error fetching process for robot ${robotId}:`, error);
      
      // Import and return mock data as fallback
      const { getProcessNodes } = await import("@/data/robots");
      return getProcessNodes(robotId);
    }
  },
  
  // Fetch history data
  async getHistoryData(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching history data:", error);
      
      // Import and return mock data as fallback
      const { getHistoryData } = await import("@/data/robots");
      return getHistoryData();
    }
  },
  
  // Fetch insights
  async getInsights(): Promise<Insight[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/insights`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching insights:", error);
      
      // Import and return mock data as fallback
      const { getAiInsights } = await import("@/data/robots");
      return getAiInsights();
    }
  },
  
  // Fetch invoice history data for a specific robot
  async getInvoiceHistory(robotId: string): Promise<InvoiceHistoryItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/robots/${robotId}/invoices`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching invoice history for robot ${robotId}:`, error);
      
      // Import and return mock data as fallback
      const { getInvoiceHistory } = await import("@/data/robots");
      return getInvoiceHistory(robotId);
    }
  },
  
  // Other API methods can be added here
  async getSuccessRateData() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/success-rate`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching success rate data:", error);
      
      // Import and return mock data as fallback
      const { getSuccessRateData } = await import("@/data/robots");
      return getSuccessRateData();
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
      
      // Import and return mock data as fallback
      const { getTrendData } = await import("@/data/robots");
      return getTrendData();
    }
  }
};
