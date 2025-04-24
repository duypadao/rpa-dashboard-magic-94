
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect as reactUseEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import ProcessFlow from "@/components/ProcessFlow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock } from "lucide-react";
import { apiService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import AiInsights from "@/components/AiInsights";
import RobotCommonInfo from "@/components/RobotCommonInfo";
import { Robot } from "@/types/robots";
import { useMemo } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const RobotDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Check if this is the Invoice Robot and redirect if needed
  // reactUseEffect(() => {
  //   if (id === "1") {
  //     navigate("/invoice", { replace: true });
  //   }
  // }, [id, navigate]);
  
  // Get robot data from router state
  const robot = location.state?.robot as Robot | undefined;
  
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

  // Check if current robot is the Invoice Processing Robot
  const isInvoiceRobot = useMemo(() => {
    return robot?.name.includes("Invoice") || robot?.id === "1";
  }, [robot]);

  // If no robot data from state, redirect to home
  reactUseEffect(() => {
    if (!robot && id) {
      toast({
        title: "Robot data not available",
        description: "Returning to dashboard to get robot information",
        variant: "destructive",
      });
      navigate("/", { replace: true });
    }
  }, [robot, id, navigate, toast]);

  // Show loading state
  if (!robot) {
    return (
      <>
        <Button variant="ghost" asChild className="mb-4 -ml-3">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToDashboard')}
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
      </>
    );
  }

  return (
    <>
      <RobotCommonInfo robot={robot} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-background to-muted/30 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('status')}</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status={robot.status} className="text-sm" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-background to-muted/30 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('lastRun')}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{robot.lastRunTime}</span>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-background to-muted/30 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('duration')}</CardTitle>
          </CardHeader>
          <CardContent>
            <span>{robot.duration}</span>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="process" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="process">{t('processFlow')}</TabsTrigger>
          {isInvoiceRobot && <TabsTrigger value="insights">{t('aiInsightsTab')}</TabsTrigger>}
        </TabsList>
        <TabsContent value="process" className="animate-fade-in">
          <Card className="bg-gradient-to-br from-background to-muted/30 border-border/50">
            <CardHeader>
              <CardTitle>{t('defaultProcessFlow')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-y-auto">
                <ProcessFlow nodes={processNodes} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {isInvoiceRobot && (
          <TabsContent value="insights" className="animate-fade-in">
            <AiInsights insights={insights} isLoading={insightsLoading} />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
};

export default RobotDetail;
