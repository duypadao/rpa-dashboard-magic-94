
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InvoiceHistoryItem } from "./InvoiceHistory";
import {
  BrainCircuit,
  BarChart,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Users,
  LineChart,
  Activity,
  Star
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { formatDateStr } from "@/ultis/datetime";

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
  // Process invoice data for analytics
  const { t } = useLanguage();
  const processedData = useMemo(() => {
    if (!invoiceData || invoiceData.length === 0) return null;

    // Group invoices by supplier
    const supplierGroups = invoiceData.reduce((acc, invoice) => {
      if (!acc[invoice.supplierName]) {
        acc[invoice.supplierName] = [];
      }
      acc[invoice.supplierName].push(invoice);
      return acc;
    }, {} as Record<string, InvoiceHistoryItem[]>);

    // Sort suppliers by number of successful invoices
    const supplierSuccessRates = Object.entries(supplierGroups).map(([supplier, invoices]) => {
      const successCount = invoices.filter(inv => inv.resultType === 'success').length;
      const failCount = invoices.filter(inv => inv.resultType === 'failure').length;
      const warningCount = invoices.filter(inv => inv.resultType === 'warning').length;
      const totalCount = invoices.length;
      const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0;
      const failRate = totalCount > 0 ? (failCount / totalCount) * 100 : 0;

      const durationsInMinutes = invoices.map(inv => {
        const durationParts = inv.duration.split(' ');
        let minutes = 0;
        durationParts.forEach(part => {
          if (part.includes('m')) {
            minutes += parseInt(part.replace('m', ''), 10);
          } else if (part.includes('s')) {
            minutes += parseInt(part.replace('s', ''), 10) / 60;
          }
        });
        return minutes;
      });
      const avgDuration = durationsInMinutes.reduce((sum, min) => sum + min, 0) / durationsInMinutes.length;

      const meanDuration = avgDuration;
      const variance = durationsInMinutes.reduce((sum, min) => sum + Math.pow(min - meanDuration, 2), 0) / durationsInMinutes.length;
      const stdDevDuration = Math.sqrt(variance);

      return {
        supplier,
        invoices,
        successCount,
        failCount,
        warningCount,
        totalCount,
        successRate,
        failRate,
        avgDuration,
        stdDevDuration
      };
    });

    // Overall stats
    const totalInvoices = invoiceData.length;
    const successfulInvoices = invoiceData.filter(inv => inv.resultType === 'success').length;
    const overallSuccessRate = (successfulInvoices / totalInvoices) * 100;

    // Sort by success count
    const suppliersBySuccessCount = [...supplierSuccessRates].sort((a, b) => b.successCount - a.successCount);

    // Sort by success rate
    const suppliersBySuccessRate = [...supplierSuccessRates].sort((a, b) => b.successRate - a.successRate);

    // Sort by fail rate
    const suppliersByFailRate = [...supplierSuccessRates].sort((a, b) => b.failRate - a.failRate);

    // Sort by average duration (processing time)
    const suppliersByProcessingTime = [...supplierSuccessRates].sort((a, b) => a.avgDuration - b.avgDuration);

    // New: Group invoices by date (assuming processedDate exists)
    const invoicesByDate = invoiceData.reduce((acc, invoice) => {
      const dateKey = formatDateStr(invoice.date);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(invoice);
      return acc;
    }, {} as Record<string, InvoiceHistoryItem[]>);

    const dailyStats = Object.entries(invoicesByDate).map(([date, invoices]) => {
      const total = invoices.length;
      const success = invoices.filter(inv => inv.resultType === 'success').length;
      const successRate = total > 0 ? (success / total) * 100 : 0;
      return { date, total, success, successRate };
    });

    // New: Busiest day and best success rate day
    const busiestDay = dailyStats.reduce((max, curr) => curr.total > max.total ? curr : max, dailyStats[0] || { date: 'N/A', total: 0 });
    const bestSuccessDay = dailyStats.reduce((max, curr) => curr.successRate > max.successRate ? curr : max, dailyStats[0] || { date: 'N/A', successRate: 0 });

    // New: Overall processing time statistics
    const allDurationsInMinutes = invoiceData.map(inv => {
      const durationParts = inv.duration.split(' ');
      let minutes = 0;
      durationParts.forEach(part => {
        if (part.includes('m')) {
          minutes += parseInt(part.replace('m', ''), 10);
        } else if (part.includes('s')) {
          minutes += parseInt(part.replace('s', ''), 10) / 60;
        }
      });
      return minutes;
    });
    const avgProcessingTime = allDurationsInMinutes.reduce((sum, min) => sum + min, 0) / allDurationsInMinutes.length;
    const minProcessingTime = Math.min(...allDurationsInMinutes);
    const maxProcessingTime = Math.max(...allDurationsInMinutes);

    // New: Result type distribution
    const totalWarnings = invoiceData.filter(inv => inv.resultType === 'warning').length;
    const totalFailures = invoiceData.filter(inv => inv.resultType === 'failure').length;
    const successPercentage = (successfulInvoices / totalInvoices) * 100;
    const warningPercentage = (totalWarnings / totalInvoices) * 100;
    const failurePercentage = (totalFailures / totalInvoices) * 100;

    // New: Suppliers with perfect success rates (min 10 invoices)
    const perfectSuppliers = supplierSuccessRates.filter(s => s.successRate === 100 && s.totalCount >= 10)
      .sort((a, b) => b.totalCount - a.totalCount);
    const topPerfectSupplier = perfectSuppliers[0];

    // New: Most consistent and most variable suppliers by processing time
    const supplierByConsistency = [...supplierSuccessRates].sort((a, b) => a.stdDevDuration - b.stdDevDuration);
    const mostConsistentSupplier = supplierByConsistency[0];
    const mostVariableSupplier = supplierByConsistency[supplierByConsistency.length - 1];

    return {
      supplierGroups,
      supplierSuccessRates,
      suppliersBySuccessCount,
      suppliersBySuccessRate,
      suppliersByFailRate,
      suppliersByProcessingTime,
      totalInvoices,
      successfulInvoices,
      overallSuccessRate,
      busiestDay,
      bestSuccessDay,
      avgProcessingTime,
      minProcessingTime,
      maxProcessingTime,
      successPercentage,
      warningPercentage,
      failurePercentage,
      topPerfectSupplier,
      mostConsistentSupplier,
      mostVariableSupplier
    };
  }, [invoiceData]);

  // Generate analytics insights based on invoice data
  const generateInsights = useMemo(() => {
    if (!processedData) return [];

    const allInsights: AnalyticInsight[] = [
      {
        id: "top-supplier",
        title: `${processedData.suppliersBySuccessCount[0]?.supplier || 'No supplier'} leads with ${processedData.suppliersBySuccessCount[0]?.successCount || 0} successfully processed invoices this month`,
        icon: <Star className="h-5 w-5 text-warning" />
      },
      {
        id: "highest-success-rate",
        title: `${processedData.suppliersBySuccessRate[0]?.supplier || 'No supplier'} has the highest success rate at ${processedData.suppliersBySuccessRate[0]?.successRate.toFixed(1) || 0}%`,
        icon: <CheckCircle2 className="h-5 w-5 text-success" />
      },
      {
        id: "fastest-processing",
        title: `${processedData.suppliersByProcessingTime[0]?.supplier || 'No supplier'} has the fastest average processing time of ${processedData.suppliersByProcessingTime[0]?.avgDuration.toFixed(1) || 0} minutes per invoice`,
        icon: <Clock className="h-5 w-5 text-info" />
      },
      {
        id: "highest-failure-rate",
        title: `${processedData.suppliersByFailRate[0]?.supplier || 'No supplier'} has the highest failure rate at ${processedData.suppliersByFailRate[0]?.failRate.toFixed(1) || 0}%`,
        icon: <AlertTriangle className="h-5 w-5 text-error" />
      },
      {
        id: "overall-success",
        title: `Overall invoice processing success rate is ${processedData.overallSuccessRate.toFixed(1)}%`,
        icon: <BarChart className="h-5 w-5 text-primary" />
      },
      {
        id: "total-invoices",
        title: `${processedData.totalInvoices} invoices processed in total this month`,
        icon: <Activity className="h-5 w-5 text-info" />
      },
      {
        id: "volume-leader",
        title: `${processedData.suppliersBySuccessCount[0]?.supplier || 'No supplier'} has the highest invoice volume, accounting for ${(processedData.suppliersBySuccessCount[0]?.totalCount / processedData.totalInvoices * 100).toFixed(1) || 0}% of all invoices`,
        icon: <TrendingUp className="h-5 w-5 text-primary" />
      },
      {
        id: "warning-rate",
        title: `${processedData.supplierSuccessRates.reduce((max, curr) => {
          const currWarningRate = curr.warningCount / curr.totalCount;
          const maxWarningRate = max.warningCount / max.totalCount;
          return currWarningRate > maxWarningRate ? curr : max;
        }, processedData.supplierSuccessRates[0]).supplier} has the highest warning rate`,
        icon: <AlertTriangle className="h-5 w-5 text-warning" />
      },
      {
        id: "busiest-day",
        title: `The busiest day was ${processedData.busiestDay.date} with ${processedData.busiestDay.total} invoices processed`,
        icon: <Activity className="h-5 w-5 text-primary" />
      },
      {
        id: "best-success-day",
        title: `The day with the highest success rate was ${processedData.bestSuccessDay.date} at ${processedData.bestSuccessDay.successRate.toFixed(1)}%`,
        icon: <CheckCircle2 className="h-5 w-5 text-success" />
      },
      {
        id: "processing-time-stats",
        title: `Average processing time: ${processedData.avgProcessingTime.toFixed(1)} min (fastest: ${processedData.minProcessingTime.toFixed(1)} min, slowest: ${processedData.maxProcessingTime.toFixed(1)} min)`,
        icon: <Clock className="h-5 w-5 text-info" />
      },
      {
        id: "result-distribution",
        title: `Invoices: ${processedData.successPercentage.toFixed(1)}% success, ${processedData.warningPercentage.toFixed(1)}% warnings, ${processedData.failurePercentage.toFixed(1)}% failures`,
        icon: <BarChart className="h-5 w-5 text-primary" />
      },
      {
        id: "most-consistent-supplier",
        title: `${processedData.mostConsistentSupplier?.supplier || 'No supplier'} has the most consistent processing time (std dev: ${processedData.mostConsistentSupplier?.stdDevDuration.toFixed(1) || 0} min)`,
        icon: <LineChart className="h-5 w-5 text-success" />
      },
      {
        id: "most-variable-supplier",
        title: `${processedData.mostVariableSupplier?.supplier || 'No supplier'} has the most variable processing time (std dev: ${processedData.mostVariableSupplier?.stdDevDuration.toFixed(1) || 0} min)`,
        icon: <LineChart className="h-5 w-5 text-error" />
      },
      {
        id: "top-perfect-supplier",
        title: processedData.topPerfectSupplier 
          ? `${processedData.topPerfectSupplier.supplier} achieved 100% success with ${processedData.topPerfectSupplier.totalCount} invoices`
          : "No supplier achieved 100% success with at least 10 invoices",
        icon: <Star className="h-5 w-5 text-warning" />
      }
    ];

    // Randomly select 5 insights
    return allInsights
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  }, [processedData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          {t("invoiceProcessingAnalytics")}
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
            No analytics available. Process some invoices to see insights.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceAnalytics;
