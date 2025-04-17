
import { Robot } from "@/types/robots";
import { API_BASE_URL, RobotResponse } from "./api";
import { formatDate } from "@/ultis/datetime";
import { MspoSummary } from "@/pages/subpages/mspo/MspoDetail";

export const mspoApiService = {

async getMspoRobot(): Promise<Robot | undefined> {
    try {
        const response = await fetch(`${API_BASE_URL}/robots/mspo`);
        
        if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
        }
        
        const data: RobotResponse = await response.json();
        return data as Robot;
    } catch (error) {
        console.error(`Error fetching invoice robot `, error);
    }
},

async getMspoSummary(): Promise<MspoSummary | undefined> {
    try {
        const response = await fetch(`${API_BASE_URL}/robots/mspo/summary`);
        
        if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
        }
        
        const data: MspoSummary = await response.json();
        return data as MspoSummary;
    } catch (error) {
        console.error(`Error fetching invoice robot `, error);
    }
},

async getMspoOverView(date?: Date): Promise<any[]> {
    try {
      let url = `${API_BASE_URL}/robots/mspo/overview`;

      const formattedDate = formatDate(date ?? new Date()) // Format date as YYYY-MM-DD
        url += `?date=${formattedDate}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching invoice overview `, error);
      return [];
    }
  },

 async getMspoPdf(pdfPath: string): Promise<string | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/robots/mspo/get-pdf`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pdfPath }),
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error(`Error fetching invoice PDF `, error);
        return null;
    }
 } 
}
