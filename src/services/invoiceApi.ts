import { API_BASE_URL, ProcessStepResponse, RobotResponse, mapProcessStepsToNodes, mockProcessNodes } from "./api";
import { Robot, ProcessNode} from "@/types/robots";
import { InvoiceHistoryItem } from "@/pages/subpages/invoice/components/InvoiceHistory";
import { InvoiceOverViewItem } from "@/pages/subpages/invoice/components/InvoiceOverView";
import { InvoiceSummary } from "@/pages/subpages/invoice/InvoiceDetail";
import { formatDate } from "@/ultis/datetime";

export const invoiceApiService = {
// Fetch process flow for an invoice
  async getProcessNodes(invoice: InvoiceHistoryItem): Promise<ProcessNode[]> {
    try {
      //const date = dayjs(invoice.date, "YYYY-MM-DD HH:mm:ss").format("YYYYMMDD")
      const response = await fetch(`${API_BASE_URL}/robots/invoice/flow/${invoice.id}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: ProcessStepResponse[] = await response.json();
      return mapProcessStepsToNodes(data);
    } catch (error) {
      console.error(`Error fetching process flow for invoice ${invoice.invoiceNo}:`, error);
      
      // Return mock data as fallback
      return mockProcessNodes;
    }
  },
  //Fetch invocie robot
  async getInvoiceRobot(): Promise<Robot | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/robots/invoice`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: RobotResponse = await response.json();
      return data as Robot;
    } catch (error) {
      console.error(`Error fetching invoice robot `, error);
    }
  },
  
  // Fetch invoice overview data
  async getInvoiceSummary(): Promise<InvoiceSummary | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/robots/invoice/summary`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data : InvoiceSummary = await response.json();
      return data as InvoiceSummary;

    } catch (error) {
      console.error(`Error fetching invoice overview `, error);
    }
  },
  
  // Fetch invoice overview data
  async getInvoiceOverView(): Promise<InvoiceOverViewItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/robots/invoice/overview`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching invoice overview `, error);
      return [];
    }
  },
  
  // Fetch invoice history data for a specific robot
  async getInvoiceHistory(date?: Date): Promise<InvoiceHistoryItem[]> {
    try {
      let url = `${API_BASE_URL}/robots/invoice/history`;
      const formattedDate = formatDate(date ?? new Date()) // Format date as YYYY-MM-DD
              url += `?date=${formattedDate}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching invoice history for :`, error);
      return [];
    }
  },
}