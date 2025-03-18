
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import ProcessFlow from "@/components/ProcessFlow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Info } from "lucide-react";
import { apiService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import AiInsights from "@/components/AiInsights";

const RobotDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
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

  // Fetch history data with React Query
  // const { 
  //   data: historyData = [], 
  //   isLoading: historyLoading 
  // } = useQuery({
  //   queryKey: ['history'],
  //   queryFn: apiService.getHistoryData,
  // });

  // Fetch insights with React Query
  const { 
    data: insights = [], 
    isLoading: insightsLoading 
  } = useQuery({
    queryKey: ['insights'],
    queryFn: apiService.getInsights,
  });

  // Handle inform button click
  const handleInform = () => {
    toast({
      title: "Notification sent",
      description: `A notification about ${robot?.name} has been sent to the team.`,
    });
  };

  // Show errors if data fetching failed
  if (robotError) {
    toast({
      title: "Error loading robot details",
      description: "Could not fetch robot details. Using local data as fallback.",
      variant: "destructive",
    });
  }

  if (processError) {
    toast({
      title: "Error loading process data",
      description: "Could not fetch process flow data. Using local data as fallback.",
      variant: "destructive",
    });
  }

  // Show loading state
  if (robotLoading) {
    return (
      <Layout>
        <Button variant="ghost" asChild className="mb-4 -ml-3">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="glass rounded-lg p-6 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Layout>
    );
  }

  if (!robot) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-semibold mb-2">Robot not found</h2>
          <p className="text-muted-foreground mb-4">The robot you are looking for does not exist.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4 -ml-3">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{robot.name}</h1>
            <p className="text-muted-foreground">{robot.description}</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleInform}>
            <Info className="h-4 w-4" />
            Inform
          </Button>
        </div>
      </div>

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
          <TabsTrigger value="process">Process Status</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="process" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Current Process Flow</CardTitle>
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
          <Card>
            <CardHeader>
              <CardTitle>Run History</CardTitle>
            </CardHeader>
            {/* <CardContent>
              {historyLoading ? (
                <div className="rounded-md border p-4 animate-pulse">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Result
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border dark:bg-transparent">
                      {historyData.map((item, index) => (
                        <tr key={index} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {item.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                item.result === "success"
                                  ? "bg-success/10 text-success"
                                  : item.result === "warning"
                                  ? "bg-warning/10 text-warning"
                                  : "bg-error/10 text-error"
                              }`}
                            >
                              {item.result.charAt(0).toUpperCase() + item.result.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {item.duration}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent> */}
          </Card>
        </TabsContent>
        <TabsContent value="insights" className="animate-fade-in">
          <AiInsights insights={insights} isLoading={insightsLoading} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default RobotDetail;
