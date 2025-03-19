import { ProcessNode } from "@/components/ProcessFlow";
import { Insight } from "@/components/AiInsights";
import { InvoiceHistoryItem } from "@/pages/subpages/components/InvoiceHistory";
import { InvoiceOverViewItem } from "@/pages/subpages/components/InvoiceOverView";
import dayjs from "dayjs";

// API response types
export interface RobotResponse {
  id: string;
  name: string;
  status: "running" | "idle" | "error" | "paused";
  lastRunTime: string;
  lastResult: "success" | "failure" | "warning";
  duration: string;
  description?: string;
  defaultProcessFlow?: string[]; // Added default process flow
}

export interface ProcessStepResponse {
  id: number;
  name: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  status: "success" | "failure" | "in-progress" | "pending";
  error?: string | null;
}

// Map API response to our app's data structure
export const mapProcessStepsToNodes = (steps: ProcessStepResponse[]): ProcessNode[] => {
  return steps.map((step) => {
    // Map API status to our component's status type
    const statusMap: Record<string, "success" | "failure" | "in-progress" | "pending"> = {
      success: "success",
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

// API Endpoints
const API_BASE_URL = "https://localhost:7009/rpa/dashboard";
//const API_BASE_URL = "http://ros:8112/rpa/dashboard";

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
      
      // Create and return mock data as fallback
      return [
        {
          id: "1",
          name: "Invoice Processing Robot",
          status: "running",
          lastRunTime: "2023-06-15 14:30:22",
          lastResult: "success",
          duration: "45m 12s",
          description: "Processes vendor invoices and updates the accounting system",
          defaultProcessFlow: ["Extract Invoice Data", "Validate Invoice", "Match with PO", "Post to ERP", "Send Confirmation"]
        },
        {
          id: "2",
          name: "Order Fulfillment Bot",
          status: "idle",
          lastRunTime: "2023-06-15 10:15:00",
          lastResult: "success",
          duration: "32m 45s",
          description: "Processes customer orders and coordinates fulfillment",
          defaultProcessFlow: ["Receive Order", "Check Inventory", "Process Payment", "Generate Shipping Label", "Send Confirmation"]
        },
        {
          id: "3",
          name: "HR Onboarding Assistant",
          status: "error",
          lastRunTime: "2023-06-14 16:20:10",
          lastResult: "failure",
          duration: "15m 30s",
          description: "Automates employee onboarding documentation and system access",
          defaultProcessFlow: ["Create User Accounts", "Send Welcome Email", "Provision System Access", "Schedule Training", "Notify Manager"]
        },
        {
          id: "4",
          name: "Supplier Management Bot",
          status: "paused",
          lastRunTime: "2023-06-13 09:45:30",
          lastResult: "warning",
          duration: "1h 10m",
          description: "Manages supplier information and performance monitoring",
          defaultProcessFlow: ["Update Supplier Database", "Validate Contact Info", "Check Performance Metrics", "Generate Report", "Send Updates"]
        }
      ];
    }
  },
  
  // Get robot by ID
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
      
      // Find in mock data
      const robots = await this.getRobots();
      return robots.find(robot => robot.id === id);
    }
  },
  
  // Get detailed process steps for a running robot
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
  
  // Get default process flow based on robot definition - always with success status
  getDefaultProcessFlow(robot: Robot): ProcessNode[] {
    if (!robot.defaultProcessFlow || robot.defaultProcessFlow.length === 0) {
      // Return empty array if no default process flow
      return [];
    }
    
    return mapDefaultProcessFlowToNodes(robot.defaultProcessFlow);
  },
  
  // Fetch process flow for an invoice
  async getProcessNodes(invoice: InvoiceHistoryItem): Promise<ProcessNode[]> {
    try {
      const date = dayjs(invoice.date, "YYYY-MM-DD HH:mm:ss").format("YYYYMMDD")
      const response = await fetch(`${API_BASE_URL}/robots/invoice/flow/${date}/${invoice.supplierId}/${invoice.invoiceNo}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: ProcessStepResponse[] = await response.json();
      return mapProcessStepsToNodes(data);
    } catch (error) {
      console.error(`Error fetching process flow for invoice ${invoice.invoiceNo}:`, error);
      
      // Return mock data as fallback
      const { getProcessNodes } = await import("@/data/robots");
      return getProcessNodes("mock");
    }
  },
  
  // Fetch invoice overview data
  async getInvoiceOverView(robotId: string): Promise<InvoiceOverViewItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/robots/invoice/overview`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching invoice overview for robot ${robotId}:`, error);
    }
  },
  
  // Fetch invoice history data for a specific robot
  async getInvoiceHistory(robotId: string): Promise<InvoiceHistoryItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/robots/invoice/history`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching invoice history for robot ${robotId}:`, error);
    }
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
      
      // Generate mock insights
      return [
        {
          id: "1",
          title: "Invoice Processing Performance",
          description: "Invoice processing has improved by 15% in the last week",
          type: "optimization",
          severity: "medium",
          robot: "Invoice Processing Robot"
        },
        {
          id: "2",
          title: "Order Bot Error Pattern",
          description: "Order Fulfillment Bot shows recurring errors on Tuesdays",
          type: "anomaly",
          severity: "high",
          robot: "Order Fulfillment Bot"
        },
        {
          id: "3",
          title: "Onboarding Process Delay",
          description: "HR Onboarding Assistant is taking 20% longer than usual",
          type: "anomaly",
          severity: "medium",
          robot: "HR Onboarding Assistant"
        },
        {
          id: "4",
          title: "Supplier Database Growth",
          description: "Supplier database growing rapidly, consider optimization",
          type: "prediction",
          severity: "low",
          robot: "Supplier Management Bot"
        },
        {
          id: "5",
          title: "Invoice Volume Trend",
          description: "Invoice volume expected to increase by 30% next month",
          type: "prediction",
          severity: "medium",
          robot: "Invoice Processing Robot"
        }
      ];
    }
  }
};
