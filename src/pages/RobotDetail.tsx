
import { useParams, Link, useLocation } from "react-router-dom";
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
import RobotCommonInfo from "@/components/RobotCommonInfo";
import { Robot } from "@/data/robots";
import { useMemo } from "react";

const RobotDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get robot data from router state if available
  const robotFromState = location.state?.robot as Robot | undefined;
  
  // Fetch robot data with React Query only if not provided in state
  const { 
    data: fetchedRobot, 
    isLoading: robotLoading,
    isError: robotError
  } = useQuery({
    queryKey: ['robot', id],
    queryFn: () => apiService.getRobotById(id || ""),
    enabled: !!id && !robotFromState, // Only run query if id exists and we don't have the robot data
  });
  
  // Use robot from state or fetched data
  const robot = robotFromState || fetchedRobot;
  
  // Generate process nodes based on robot type
  const processNodes = useMemo(() => {
    if (!robot) return [];
    
    // For Invoice Processing Bot (id: 1), we'll use existing logic
    if (robot.id === "1") {
      return []; // This case is handled separately in InvoiceDetail.tsx
    }
    
    // For other robots, use default process flow from robot definition
    return apiService.getDefaultProcessFlow(robot);
  }, [robot]);

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

  // Show loading state
  if (robotLoading || (!robot && !robotError)) {
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
          <TabsTrigger value="process">Process Flow</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="process" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Default Process Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-y-auto">
                <ProcessFlow nodes={processNodes} />
              </div>
            </CardContent>
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
