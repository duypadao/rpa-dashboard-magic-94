
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceHistoryItem } from "./InvoiceHistory";
import { BrainCircuit, BarChart, TrendingUp } from "lucide-react";

interface AnalyticInsight {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface InvoiceAnalyticsProps {
  invoiceData: InvoiceHistoryItem[];
  isLoading: boolean;
}

const InvoiceAnalytics = ({ invoiceData, isLoading }: InvoiceAnalyticsProps) => {
  // Generate analytics insights based on invoice data
  const generateInsights = (data: InvoiceHistoryItem[]): AnalyticInsight[] => {
    if (data.length === 0) return [];

    // Group by supplier
    const supplierGroups = data.reduce((acc, curr) => {
      acc[curr.supplierName] = acc[curr.supplierName] || [];
      acc[curr.supplierName].push(curr);
      return acc;
    }, {} as Record<string, InvoiceHistoryItem[]>);

    // Calculate success rates by supplier
    const supplierSuccessRates = Object.entries(supplierGroups).map(([name, invoices]) => {
      const successCount = invoices.filter(inv => inv.result === 'success').length;
      const rate = (successCount / invoices.length) * 100;
      return { name, rate, count: invoices.length };
    });

    // Find supplier with most invoices
    const mostInvoices = supplierSuccessRates.reduce((max, curr) => 
      curr.count > max.count ? curr : max, { name: "", count: 0, rate: 0 });

    // Find supplier with best success rate
    const bestSuccessRate = supplierSuccessRates.reduce((max, curr) => 
      curr.rate > max.rate ? curr : max, { name: "", count: 0, rate: 0 });

    // Get current month name
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    const insights: AnalyticInsight[] = [
      {
        id: "insight1",
        title: `${mostInvoices.name} has processed ${mostInvoices.count} invoices this ${currentMonth}.`,
        icon: <BarChart className="h-5 w-5 text-primary" />
      },
      {
        id: "insight2",
        title: `Best success rate belongs to ${bestSuccessRate.name} with ${bestSuccessRate.rate.toFixed(1)}% success.`,
        icon: <TrendingUp className="h-5 w-5 text-success" />
      },
      {
        id: "insight3",
        title: `Total of ${data.length} invoices processed, with ${data.filter(d => d.result === 'success').length} successful outcomes.`,
        icon: <BrainCircuit className="h-5 w-5 text-info" />
      }
    ];

    return insights;
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
          <div className="space-y-4">
            {insights.map((insight) => (
              <div 
                key={insight.id} 
                className="p-4 glass rounded-lg flex items-start gap-3 animate-fade-in"
              >
                <div className="mt-1">{insight.icon}</div>
                <p className="font-medium">{insight.title}</p>
              </div>
            ))}
          </div>
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
