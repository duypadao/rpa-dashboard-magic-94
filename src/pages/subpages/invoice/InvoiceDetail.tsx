
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Clock, Percent, Hourglass, XCircle, Zap } from "lucide-react";
import { invoiceApiService } from "@/services/invoiceApi";
import RobotCommonInfo from "@/components/RobotCommonInfo";
import InvoiceHistory from "./components/InvoiceHistory";
import InvoiceAnalytics from "./components/InvoiceAnalytics";
import InvoiceOverView from "./components/InvoiceOverView";
import { useLanguage } from "@/components/LanguageProvider";
import { formatDateTime, formatSuccessRate, formatDurationBySecond, formatDurationBySecondToFixed, formatDateStr, formatTime, formatDateV2 } from "@/ultis/datetime";
import { useState } from "react";

export interface InvoiceSummary {
  invoiceCreated: number;
  invoiceCreatedInMonth: number;
  warningInvoice: number;
  warningInvoiceInMonth: number;
  failInvoice: number;
  failInvoiceInMonth: number;
  estSavingTime: number;
  estSavingTimeInMonth: number;
  failRate: number;
  failRateInMonth: number;
}

const InvoiceDetail = () => {
  const { t } = useLanguage();
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);

  const {
    data: robot,
    isLoading: robotLoading,
  } = useQuery({
    queryKey: ['invoiceRobot'],
    queryFn: () => invoiceApiService.getInvoiceRobot(),
  });

  // Fetch invoice summary data
  const {
    data: invoiceSummary,
    isLoading: summaryLoading
  } = useQuery({
    queryKey: ['invoiceSummary'],
    queryFn: () => invoiceApiService.getInvoiceSummary(),
  });

  // Fetch invoice history data
  const {
    data: invoiceHistory = [],
    isLoading: historyLoading,
  } = useQuery({
    queryKey: ['invoiceHistory', filterDate],
    queryFn: () => invoiceApiService.getInvoiceHistory(filterDate),
  });

  // Fetch invoice overview data
  const {
    data: invoiceOverView = [],
    isLoading: overViewLoading
  } = useQuery({
    queryKey: ['invoiceOverView'],
    queryFn: () => invoiceApiService.getInvoiceOverView(),
  });

  if (robotLoading && summaryLoading) {
    return <div>Loading...</div>;
  }

  if (!robot || !invoiceSummary) {
    return <div>Robot not found</div>;
  }


  return (
    <Layout>
      {/* Common robot information section */}
      <RobotCommonInfo robot={robot} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        {/* Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('status')}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <StatusBadge status={robot.status} className="text-sm" />
          </CardContent>
        </Card>

        {/* Last Run */}
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('lastRun')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-6 w-6 mr-2" />
              <div>
                <div className="text-sm font-medium">{formatDateV2(robot.lastRunTime as Date)}</div>
                <p className="text-sm ">{formatTime(robot.lastRunTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium ">{t('invoice.invoiceCreated')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{invoiceSummary.invoiceCreatedInMonth}</div>
                <p className="text-xs">{invoiceSummary.invoiceCreated} {t('accumulate')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('invoice.warningInvoice')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{invoiceSummary.warningInvoiceInMonth}</div>
                <p className="text-xs">{invoiceSummary.warningInvoice} {t('accumulate')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fail */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('invoice.failureInvoice')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <XCircle className="h-6 w-6 mr-2 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{invoiceSummary.failInvoiceInMonth}</div>
                <p className="text-xs">{invoiceSummary.failInvoice} {t('accumulate')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('invoice.successRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Percent className="h-6 w-6 mr-2 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{formatSuccessRate(invoiceSummary.failRateInMonth)}</div>
                <p className="text-xs">{formatSuccessRate(invoiceSummary.failRate)} {t('accumulate')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Time Saved */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('timeSaved')}*</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Zap className="h-6 w-6 mr-2 text-orange-400" />
              <div>
                <div className="text-xl font-bold">{formatDurationBySecondToFixed(invoiceSummary.estSavingTimeInMonth)}</div>
                <p className="text-xs">{formatDurationBySecondToFixed(invoiceSummary.estSavingTime)} {t('accumulate')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="history">{t('history')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="animate-fade-in">
          <InvoiceOverView invoiceData={invoiceOverView} isLoading={overViewLoading} />
        </TabsContent>

        <TabsContent value="history" className="animate-fade-in">
          <InvoiceHistory
            invoiceData={invoiceHistory}
            isLoading={historyLoading}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
          />
        </TabsContent>

        <TabsContent value="analytics" className="animate-fade-in">
          <InvoiceAnalytics invoiceData={invoiceHistory} isLoading={historyLoading} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default InvoiceDetail;
