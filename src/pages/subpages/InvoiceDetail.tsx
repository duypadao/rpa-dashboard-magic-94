
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import { apiService } from "@/services/api";
import RobotCommonInfo from "@/components/RobotCommonInfo";
import InvoiceHistory from "./components/InvoiceHistory";
import InvoiceAnalytics from "./components/InvoiceAnalytics";
import InvoiceOverView from "./components/InvoiceOverView";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetch robot data with React Query
  const { 
    data: robot, 
    isLoading: robotLoading,
    isError: robotError
  } = useQuery({
    queryKey: ['robot', id],
    queryFn: () => apiService.getRobotById(id || ""),
    enabled: !!id, // Only run query if id exists
  });

  // Fetch invoice history data
  const { 
    data: invoiceHistory = [], 
    isLoading: historyLoading 
  } = useQuery({
    queryKey: ['invoiceHistory', id],
    queryFn: () => apiService.getInvoiceHistory(id || ""),
    enabled: !!id,
  });

  // Fetch invoice overview data
  const { 
    data: invoiceOverView = [], 
    isLoading: overViewLoading 
  } = useQuery({
    queryKey: ['invoiceOverView', id],
    queryFn: () => apiService.getInvoiceOverView(id || ""),
    enabled: !!id,
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
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status={robot.status} className="text-sm" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Run</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{robot.lastRunTime}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <span>{robot.duration}</span>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Over View</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
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
