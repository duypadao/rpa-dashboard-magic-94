import { Robot } from "@/types/robots";
import { API_BASE_URL,RobotResponse } from "./api";

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

async getMspoOverView(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/robots/mspo/overview`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching invoice overview `, error);
      return [];
    }
  },
}