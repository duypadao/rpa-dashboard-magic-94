
import React, { ReactNode, useMemo } from "react";
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
import { useLanguage } from "@/components/LanguageProvider";

interface AnalyticInsight {
  id: string;
  title: ReactNode;
  icon: ReactNode;
  className?: string;
}

interface MspoAnalyticsProps {
  mspoData: MspoOverViewItem[];
  isLoading: boolean;
}

const MspoAnalytics = ({ mspoData, isLoading }: MspoAnalyticsProps) => {
  const { t } = useLanguage();
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
    const highlightClassName = "text-primary";
    const allInsights: AnalyticInsight[] = [
      {
        id: "total-orders",
        title: (
          <>
            <span className={highlightClassName}>{processedData.totalOrders}</span>{" "}
            {t("mspo.totalOrdersProcessed")}
          </>
        ),
        icon: <ShoppingCart className="h-5 w-5 text-primary" />
      },
      {
        id: "total-order-changes",
        title: (
          <>
            <span className={highlightClassName}>{processedData.totalOrderChanges}</span>{" "}
            {t("mspo.totalOrderChangesProcessed")}
          </>
        ),
        icon: <RefreshCw className="h-5 w-5 text-warning" />
      },
      {
        id: "busiest-date",
        title: (
          <>
            <span className={highlightClassName}>
              {new Date(processedData.dateWithMostActivity.date).toLocaleDateString()}
            </span>{" "}
            {t("mspo.busiestDayWith")}{" "}
            <span className={highlightClassName}>
              {processedData.dateWithMostActivity.orderCount +
                processedData.dateWithMostActivity.orderChangeCount}
            </span>{" "}
            {t("mspo.totalActivities")}
          </>
        ),
        icon: <Calendar className="h-5 w-5 text-info" />
      },
      {
        id: "avg-changes",
        title: (
          <>
            {t("mspo.averageOrderChanges")}{" "}
            <span className={highlightClassName}>
              {processedData.avgOrderChangesPerDay.toFixed(2)}
            </span>{" "}
            {t("mspo.perDay")}
          </>
        ),
        icon: <Activity className="h-5 w-5 text-primary" />
      },
      {
        id: "most-recent",
        title: (
          <>
            {t("mspo.mostRecentActivity")}{" "}
            <span className={highlightClassName}>
              {new Date(processedData.sortedByLastRun[0].lastRunTime).toLocaleDateString()}
            </span>{" "}
            {t("mspo.at")}{" "}
            <span className={highlightClassName}>
              {new Date(processedData.sortedByLastRun[0].lastRunTime).toLocaleTimeString()}
            </span>
          </>
        ),
        icon: <Clock className="h-5 w-5 text-info" />
      }
    ];

    // Add insights about order types if available
    if (processedData.detailsByType && Object.keys(processedData.detailsByType).length > 0) {
      const entries = Object.entries(processedData.detailsByType);
      const orderTypeInsight = {
        id: "order-types",
        title: (
          <>
            {entries.map(([type, details], idx) => (
              <span key={type}>
                <span className={highlightClassName}>{details.length}</span>{" "}
                {type}
                {idx < entries.length - 2 ? ", " : idx === entries.length - 2 ? ` ${t("mspo.and")} ` : ""}
              </span>
            ))}{" "}
            {t("mspo.haveBeenProcessed")}
          </>
        ),
        icon: <BarChart className="h-5 w-5 text-success" />
      };
      allInsights.push(orderTypeInsight);
    }
    

    // Add insight about most frequent PO number
    if (processedData.mostFrequentPO) {
      const poInsight = {
        id: "frequent-po",
        title: (
          <>
            {t("mspo.poNumber")}{" "}
            <span className={highlightClassName}>{processedData.mostFrequentPO[0]}</span>{" "}
            {t("mspo.appears")}{" "}
            <span className={highlightClassName}>{processedData.mostFrequentPO[1]}</span>{" "}
            {t("mspo.timesInData")}
          </>
        ),
        icon: <TrendingUp className="h-5 w-5 text-primary" />
      };
      allInsights.push(poInsight);
    }

    // Add detail counts
    const detailsInsight = {
      id: "total-details",
      title: (
        <>
          <span className={highlightClassName}>{processedData.allDetails.length}</span>{" "}
          {t("mspo.totalDetailRecordsProcessed")}
        </>
      ),
      icon: <FileText className="h-5 w-5 text-success" />
    };
    allInsights.push(detailsInsight);

    // Randomly select up to 10 insights
    return allInsights;
    // .sort(() => Math.random() - 0.5)
    // .slice(0, 10);
  }, [processedData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          {t('mspo.mspoProcessingAnalytics')}
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
