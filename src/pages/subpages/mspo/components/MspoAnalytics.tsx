
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MspoOverViewItem } from "./MspoOverView";
import { 
  BrainCircuit, 
  BarChart, 
  TrendingUp, 
  Clock, 
  FileText, 
  CheckCircle2, 
  ShoppingCart, 
  RefreshCw, 
  Activity,
  Calendar
} from "lucide-react";

interface AnalyticInsight {
  id: string;
  title: string;
  icon: React.ReactNode;
  className?: string;
}

interface MspoAnalyticsProps {
  mspoData: MspoOverViewItem[];
  isLoading: boolean;
}

const MspoAnalytics = ({ mspoData, isLoading }: MspoAnalyticsProps) => {
  // Process mspo data for analytics
  const processedData = useMemo(() => {
    if (!mspoData || mspoData.length === 0) return null;

    // Calculate total orders and order changes
    const totalOrders = mspoData.reduce((sum, item) => sum + item.orderCount, 0);
    const totalOrderChanges = mspoData.reduce((sum, item) => sum + item.orderChangeCount, 0);
    
    // Find the date with the most activity
    const dateWithMostActivity = [...mspoData].sort(
      (a, b) => (b.orderCount + b.orderChangeCount) - (a.orderCount + a.orderChangeCount)
    )[0];
    
    // Calculate average order changes per day
    const avgOrderChangesPerDay = totalOrderChanges / mspoData.length;
    
    // Count total details and group by type
    const allDetails = mspoData.flatMap(item => item.details || []);
    const detailsByType = allDetails.reduce((acc, detail) => {
      if (!acc[detail.type]) {
        acc[detail.type] = [];
      }
      acc[detail.type].push(detail);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Group PO numbers and find most frequent
    const poNumbers = allDetails.map(detail => detail.poNumber);
    const poFrequency = poNumbers.reduce((acc, poNumber) => {
      acc[poNumber] = (acc[poNumber] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostFrequentPO = Object.entries(poFrequency)
      .sort((a, b) => b[1] - a[1])[0];
      
    // Calculate last run times
    const sortedByLastRun = [...mspoData].sort(
      (a, b) => new Date(b.lastRunTime).getTime() - new Date(a.lastRunTime).getTime()
    );
    
    return {
      totalOrders,
      totalOrderChanges,
      dateWithMostActivity,
      avgOrderChangesPerDay,
      detailsByType,
      mostFrequentPO,
      sortedByLastRun,
      allDetails
    };
  }, [mspoData]);

  // Generate analytics insights based on mspo data
  const generateInsights = useMemo(() => {
    if (!processedData) return [];

    const allInsights: AnalyticInsight[] = [
      {
        id: "total-orders",
        title: `A total of ${processedData.totalOrders} orders have been processed`,
        icon: <ShoppingCart className="h-5 w-5 text-primary" />
      },
      {
        id: "total-order-changes",
        title: `${processedData.totalOrderChanges} order changes have been processed`,
        icon: <RefreshCw className="h-5 w-5 text-warning" />
      },
      {
        id: "busiest-date",
        title: `${new Date(processedData.dateWithMostActivity.date).toLocaleDateString()} was the busiest day with ${processedData.dateWithMostActivity.orderCount + processedData.dateWithMostActivity.orderChangeCount} total activities`,
        icon: <Calendar className="h-5 w-5 text-info" />
      },
      {
        id: "avg-changes",
        title: `On average, ${processedData.avgOrderChangesPerDay.toFixed(2)} order changes are processed per day`,
        icon: <Activity className="h-5 w-5 text-primary" />
      },
      {
        id: "most-recent",
        title: `Most recent activity was on ${new Date(processedData.sortedByLastRun[0].lastRunTime).toLocaleDateString()} at ${new Date(processedData.sortedByLastRun[0].lastRunTime).toLocaleTimeString()}`,
        icon: <Clock className="h-5 w-5 text-info" />
      }
    ];

    // Add insights about order types if available
    if (processedData.detailsByType && Object.keys(processedData.detailsByType).length > 0) {
      const orderTypeInsight = {
        id: "order-types",
        title: `${Object.entries(processedData.detailsByType)
          .map(([type, details]) => `${details.length} ${type.toLowerCase()}s`)
          .join(" and ")} have been processed`,
        icon: <BarChart className="h-5 w-5 text-success" />
      };
      allInsights.push(orderTypeInsight);
    }

    // Add insight about most frequent PO number
    if (processedData.mostFrequentPO) {
      const poInsight = {
        id: "frequent-po",
        title: `Purchase Order ${processedData.mostFrequentPO[0]} appears ${processedData.mostFrequentPO[1]} times in the data`,
        icon: <TrendingUp className="h-5 w-5 text-primary" />
      };
      allInsights.push(poInsight);
    }
    
    // Add detail counts
    const detailsInsight = {
      id: "total-details",
      title: `A total of ${processedData.allDetails.length} detail records have been processed`,
      icon: <FileText className="h-5 w-5 text-success" />
    };
    allInsights.push(detailsInsight);

    // Randomly select up to 10 insights
    return allInsights
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  }, [processedData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          MSPO Processing Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg h-20 mb-4"></div>
            ))}
          </div>
        ) : generateInsights.length > 0 ? (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {generateInsights.map((insight, index) => (
                <div 
                  key={insight.id} 
                  className="p-4 glass rounded-lg flex items-start gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mt-1">{insight.icon}</div>
                  <p className="font-medium">{insight.title}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center text-muted-foreground py-6">
            No analytics available. Process some MSPO data to see insights.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MspoAnalytics;
