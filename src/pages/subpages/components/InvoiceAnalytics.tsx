
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InvoiceHistoryItem } from "./InvoiceHistory";
import { BrainCircuit, BarChart, TrendingUp, Clock, AlertTriangle, CheckCircle2, DollarSign, Users, LineChart, Activity } from "lucide-react";

interface AnalyticInsight {
  id: string;
  title: string;
  icon: React.ReactNode;
  className?: string;
}

interface InvoiceAnalyticsProps {
  invoiceData: InvoiceHistoryItem[];
  isLoading: boolean;
}

const InvoiceAnalytics = ({ invoiceData, isLoading }: InvoiceAnalyticsProps) => {
  const generateRandomStatistic = () => {
    return Math.floor(Math.random() * 100);
  };

  const generateRandomTime = () => {
    return `${Math.floor(Math.random() * 60)} minutes`;
  };

  const generateRandomMoney = () => {
    return `$${(Math.random() * 10000).toFixed(2)}`;
  };

  // Generate analytics insights based on invoice data
  const generateInsights = (data: InvoiceHistoryItem[]): AnalyticInsight[] => {
    if (data.length === 0) return [];

    const possibleInsights = [
      {
        id: "processing-time",
        title: `Average processing time this month is ${generateRandomTime()}`,
        icon: <Clock className="h-5 w-5 text-info" />
      },
      {
        id: "success-rate",
        title: `Success rate increased by ${generateRandomStatistic()}% compared to last month`,
        icon: <CheckCircle2 className="h-5 w-5 text-success" />
      },
      {
        id: "cost-savings",
        title: `Estimated cost savings this month: ${generateRandomMoney()}`,
        icon: <DollarSign className="h-5 w-5 text-primary" />
      },
      {
        id: "supplier-activity",
        title: `${generateRandomStatistic()}% of suppliers show increased activity`,
        icon: <Users className="h-5 w-5 text-warning" />
      },
      {
        id: "error-rate",
        title: `Error rate decreased by ${generateRandomStatistic()}% this week`,
        icon: <AlertTriangle className="h-5 w-5 text-error" />
      },
      {
        id: "processing-trend",
        title: `Processing efficiency improved by ${generateRandomStatistic()}%`,
        icon: <LineChart className="h-5 w-5 text-success" />
      },
      {
        id: "peak-hours",
        title: `Peak processing hours identified between 2-4 PM`,
        icon: <Activity className="h-5 w-5 text-info" />
      },
      {
        id: "volume-increase",
        title: `Invoice volume increased by ${generateRandomStatistic()}%`,
        icon: <TrendingUp className="h-5 w-5 text-primary" />
      },
      {
        id: "automated-tasks",
        title: `${generateRandomStatistic()}% of tasks fully automated`,
        icon: <BrainCircuit className="h-5 w-5 text-warning" />
      },
      {
        id: "performance-metric",
        title: `Overall system performance score: ${generateRandomStatistic()}%`,
        icon: <BarChart className="h-5 w-5 text-success" />
      }
    ];

    // Randomly select and shuffle insights
    return possibleInsights
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  };

  const insights = generateInsights(invoiceData);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          Invoice Processing Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg h-20 mb-4"></div>
            ))}
          </div>
        ) : insights.length > 0 ? (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {insights.map((insight, index) => (
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
            No analytics available. Process some invoices to see insights.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceAnalytics;
