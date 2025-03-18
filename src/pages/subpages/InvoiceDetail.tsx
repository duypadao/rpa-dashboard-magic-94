
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import ProcessFlow from "@/components/ProcessFlow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import { apiService } from "@/services/api";
import  RobotCommonInfo from "@/components/RobotCommonInfo";
import InvoiceHistory from "./components/InvoiceHistory";
import InvoiceAnalytics from "./components/InvoiceAnalytics";

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

  // Fetch process nodes with React Query
  const { 
    data: processNodes = [], 
    isLoading: processLoading,
    isError: processError 
  } = useQuery({
    queryKey: ['robotProcess', id],
    queryFn: () => apiService.getProcessSteps(id || ""),
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

      <Tabs defaultValue="process" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="process">{robot.status == "running" ? "" : "Last"} Process Status</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="process" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>{robot.status == "running" ? "Current" : "Last"} Process Flow</CardTitle>
            </CardHeader>
            <CardContent>
              {processLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ) : (
                <ProcessFlow nodes={processNodes} />
              )}
            </CardContent>
          </Card>
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
