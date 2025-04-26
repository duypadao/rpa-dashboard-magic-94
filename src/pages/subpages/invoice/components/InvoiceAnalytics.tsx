
import { ReactNode, useMemo } from "react";
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
import { convertDurationToSecond, formatDateStr } from "@/ultis/datetime";
import { formatDurationBySecondTranslation } from "@//ultis/datetime";

interface AnalyticInsight {
  id: string;
  title: ReactNode;
  icon: ReactNode;
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

      const durationsInSecond = invoices.map(inv => {
        return convertDurationToSecond(inv.duration);
      });
      const avgDuration = durationsInSecond.reduce((sum, min) => sum + min, 0) / durationsInSecond.length;

      const meanDuration = avgDuration;
      const variance = durationsInSecond.reduce((sum, min) => sum + Math.pow(min - meanDuration, 2), 0) / durationsInSecond.length;
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
    const allDurationsInSeconds = invoiceData.map(inv => {
      return convertDurationToSecond(inv.duration);
    });
    const avgProcessingTime = allDurationsInSeconds.reduce((sum, min) => sum + min, 0) / allDurationsInSeconds.length;
    const minProcessingTime = Math.min(...allDurationsInSeconds);
    const maxProcessingTime = Math.max(...allDurationsInSeconds);

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

    const highlightClassName = "text-primary";
    const allInsights: AnalyticInsight[] = [
      {
        id: "top-supplier",
        title: (
          <>
            <span className={highlightClassName}>
              {processedData.suppliersBySuccessCount[0]?.supplier || t("invoice.noSupplier")}
            </span>{" "}
            {t("invoice.leadsWith")}{" "}
            <span className={highlightClassName}>
              {processedData.suppliersBySuccessCount[0]?.successCount || 0} {t("invoice.successfullyProcessedInvoicesThisMonth")}
            </span>
          </>
        ),
        icon: <Star className="h-5 w-5 text-warning" />
      },
      {
        id: "highest-success-rate",
        title: (
          <>
            <span className={highlightClassName}>
              {processedData.suppliersBySuccessRate[0]?.supplier || t("invoice.noSupplier")}
            </span>{" "}
            {t("invoice.hasTheHighestSuccessRateAt")}{" "}
            <span className={highlightClassName}>
              {processedData.suppliersBySuccessRate[0]?.successRate.toFixed(1) || 0}%
            </span>
          </>
        ),
        icon: <CheckCircle2 className="h-5 w-5 text-success" />
      },
      {
        id: "fastest-processing",
        title: (
          <>
            <span className={highlightClassName}>
              {processedData.suppliersByProcessingTime[0]?.supplier || t("invoice.noSupplier")}
            </span>{" "}
            {t("invoice.hasTheFastestAverageProcessingTimeOf")}{" "}
            <span className={highlightClassName}>
              {formatDurationBySecondTranslation(processedData.suppliersByProcessingTime[0]?.avgDuration, t)} {t("invoice.perInvoice")}
            </span>
          </>
        ),
        icon: <Clock className="h-5 w-5 text-info" />
      },
      {
        id: "highest-failure-rate",
        title: (
          <>
            <span className={highlightClassName}>
              {processedData.suppliersByFailRate[0]?.supplier || t("invoice.noSupplier")}
            </span>{" "}
            {t("invoice.hasTheHighestFailureRateAt")}{" "}
            <span className={highlightClassName}>
              {processedData.suppliersByFailRate[0]?.failRate.toFixed(1) || 0}%
            </span>
          </>
        ),
        icon: <AlertTriangle className="h-5 w-5 text-error" />
      },
      {
        id: "overall-success",
        title: (
          <>
            {t("invoice.overallInvoiceProcessingSuccessRateIs")}{" "}
            <span className={highlightClassName}>
              {processedData.overallSuccessRate.toFixed(1)}%
            </span>
          </>
        ),
        icon: <BarChart className="h-5 w-5 text-primary" />
      },
      {
        id: "total-invoices",
        title: (
          <>
            {t("invoice.totalInvoicesProcessedThisMonth")}{" "}
            <span className={highlightClassName}>
              {processedData.totalInvoices}
            </span>
          </>
        ),
        icon: <Activity className="h-5 w-5 text-info" />
      },
      {
        id: "volume-leader",
        title: (
          <>
            <span className={highlightClassName}>
              {processedData.suppliersBySuccessCount[0]?.supplier || t("invoice.noSupplier")}
            </span>{" "}
            {t("invoice.hasTheHighestInvoiceVolumeAccountingFor")}{" "}
            <span className={highlightClassName}>
              {(processedData.suppliersBySuccessCount[0]?.totalCount / processedData.totalInvoices * 100).toFixed(1) || 0}%
            </span>{" "}
            {t("invoice.ofAllInvoices")}
          </>
        ),
        icon: <TrendingUp className="h-5 w-5 text-primary" />
      },
      {
        id: "warning-rate",
        title: (
          <>
            {t("invoice.supplier")}{" "}
            <span className={highlightClassName}>
              {processedData.supplierSuccessRates.reduce((max, curr) => {
                const currWarningRate = curr.warningCount / curr.totalCount;
                const maxWarningRate = max.warningCount / max.totalCount;
                return currWarningRate > maxWarningRate ? curr : max;
              }, processedData.supplierSuccessRates[0]).supplier}
            </span>{" "}
            {t("invoice.hasTheHighestWarningRate")}
          </>
        ),
        icon: <AlertTriangle className="h-5 w-5 text-warning" />
      },
      {
        id: "busiest-day",
        title: (
          <>
            {t("invoice.theBusiestDayWas")}{" "}
            <span className={highlightClassName}>
              {processedData.busiestDay.date}
            </span>{" "}
            {t("invoice.withInvoicesProcessed")}{" "}
            <span className={highlightClassName}>
              {processedData.busiestDay.total}
            </span>
          </>
        ),
        icon: <Activity className="h-5 w-5 text-primary" />
      },
      {
        id: "best-success-day",
        title: (
          <>
            {t("invoice.theDayWithTheHighestSuccessRateWas")}{" "}
            <span className={highlightClassName}>
              {processedData.bestSuccessDay.date}
            </span>{" "}
            {t("invoice.atSuccessRate")}{" "}
            <span className={highlightClassName}>
              {processedData.bestSuccessDay.successRate.toFixed(1)}%
            </span>
          </>
        ),
        icon: <CheckCircle2 className="h-5 w-5 text-success" />
      },
      {
        id: "processing-time-stats",
        title: (
          <>
            {t("invoice.averageProcessingTime")}{" "}
            <span className={highlightClassName}>
            {formatDurationBySecondTranslation(processedData.avgProcessingTime, t)} 
            </span>{" "}
            ({t("invoice.fastest")}{" "}
            <span className={highlightClassName}>
              {formatDurationBySecondTranslation(processedData.minProcessingTime, t)}
            </span>
            , {t("invoice.slowest")}{" "}
            <span className={highlightClassName}>
              {formatDurationBySecondTranslation(processedData.maxProcessingTime, t)}
            </span>)
          </>
        ),
        icon: <Clock className="h-5 w-5 text-info" />
      },
      {
        id: "result-distribution",
        title: (
          <>
            {t("invoice.invoices")}{" "}
            <span className={highlightClassName}>
              {processedData.successPercentage.toFixed(1)}% {t("invoice.success")}
            </span>,{" "}
            <span className={highlightClassName}>
              {processedData.warningPercentage.toFixed(1)}% {t("invoice.warnings")}
            </span>,{" "}
            <span className={highlightClassName}>
              {processedData.failurePercentage.toFixed(1)}% {t("invoice.failures")}
            </span>
          </>
        ),
        icon: <BarChart className="h-5 w-5 text-primary" />
      },
      {
        id: "most-consistent-supplier",
        title: (
          <>
            <span className={highlightClassName}>
              {processedData.mostConsistentSupplier?.supplier || t("invoice.noSupplier")}
            </span>{" "}
            {t("invoice.hasTheMostConsistentProcessingTime")}{" "}
            <span className={highlightClassName}>
              {formatDurationBySecondTranslation(processedData.mostConsistentSupplier?.stdDevDuration, t)}
            </span>
          </>
        ),
        icon: <LineChart className="h-5 w-5 text-success" />
      },
      {
        id: "most-variable-supplier",
        title: (
          <>
            <span className={highlightClassName}>
              {processedData.mostVariableSupplier?.supplier || t("invoice.noSupplier")}
            </span>{" "}
            {t("invoice.hasTheMostVariableProcessingTime")}{" "}
            <span className={highlightClassName}>
              {formatDurationBySecondTranslation(processedData.mostVariableSupplier?.stdDevDuration, t)}
            </span>
          </>
        ),
        icon: <LineChart className="h-5 w-5 text-error" />
      },
      {
        id: "top-perfect-supplier",
        title: (
          <>
            {processedData.topPerfectSupplier ? (
              <>
                <span className={highlightClassName}>
                  {processedData.topPerfectSupplier.supplier}
                </span>{" "}
                {t("invoice.achieved100PercentSuccessWith")}{" "}
                <span className={highlightClassName}>
                  {processedData.topPerfectSupplier.totalCount}
                </span>{" "}
                {t("invoice.invoices")}
              </>
            ) : (
              t("invoice.noSupplierAchieved100PercentSuccessWithAtLeast10Invoices")
            )}
          </>

        ),
        icon: <Star className="h-5 w-5 text-warning" />
      }
    ];






    // Randomly select 5 insights
    return allInsights
    // .sort(() => Math.random() - 0.5)
    // .slice(0, 8);
  }, [processedData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          {t("invoice.invoiceProcessingAnalytics")}
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
