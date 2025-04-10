
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import { invoiceApiService } from "@/services/invoiceApi";
import RobotCommonInfo from "@/components/RobotCommonInfo";
import InvoiceHistory from "./components/InvoiceHistory";
import InvoiceAnalytics from "./components/InvoiceAnalytics";
import InvoiceOverView from "./components/InvoiceOverView";
import { useLanguage } from "@/components/LanguageProvider";

const InvoiceDetail = () => {
  const { t } = useLanguage();
  // Hard-coded ID for Invoice Processing Robot
  
  //Fetch robot data with React Query
  const { 
    data: robot, 
    isLoading: robotLoading,
  } = useQuery({
    queryKey: ['invoiceRobot'],
    queryFn: () => invoiceApiService.getInvoiceRobot(),
  });

  // Fetch invoice history data
  const { 
    data: invoiceHistory = [], 
    isLoading: historyLoading 
  } = useQuery({
    queryKey: ['invoiceHistory'],
    queryFn: () => invoiceApiService.getInvoiceHistory(),
  });

  // Fetch invoice overview data
  const { 
    data: invoiceOverView = [], 
    isLoading: overViewLoading 
  } = useQuery({
    queryKey: ['invoiceOverView'],
    queryFn: () => invoiceApiService.getInvoiceOverView(),
  });

  if (robotLoading) {
    return <div>Loading...</div>;
  }

  if (!robot) {
    return <div>Robot not found</div>;
  }

  return (
    <Layout>
      {/* Common robot information section */}
      <RobotCommonInfo robot={robot} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('status')}</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status={robot.status} className="text-sm" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('lastRun')}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{robot.lastRunTime}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('duration')}</CardTitle>
          </CardHeader>
          <CardContent>
            <span>{robot.duration}</span>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Over View</TabsTrigger>
          <TabsTrigger value="history">{t('history')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="animate-fade-in">
          <InvoiceOverView invoiceData={invoiceOverView} isLoading={overViewLoading} />
        </TabsContent>
        
        <TabsContent value="history" className="animate-fade-in">
          <InvoiceHistory invoiceData={invoiceHistory} isLoading={historyLoading} />
        </TabsContent>
        
        <TabsContent value="analytics" className="animate-fade-in">
          <InvoiceAnalytics invoiceData={invoiceHistory} isLoading={historyLoading} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default InvoiceDetail;
