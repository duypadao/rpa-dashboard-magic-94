
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import { mspoApiService } from "@/services/mspoApi";
import RobotCommonInfo from "@/components/RobotCommonInfo";
import MspoAnalytics from "./components/MspoAnalytics";
import MspoOverView from "./components/MspoOverView";
import { useLanguage } from "@/components/LanguageProvider";

const MspoDetail = () => {
  const { t } = useLanguage();
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  
  //Fetch robot data with React Query
  const { 
    data: robot, 
    isLoading: robotLoading,
  } = useQuery({
    queryKey: ['mspoRobot'],
    queryFn: () => mspoApiService.getMspoRobot(),
  });

  // Fetch mspo overview data with date filter
  const { 
    data: mspoOverView = [], 
    isLoading: overViewLoading,
    isError: overViewError,
    error: overViewErrorDetail,
  } = useQuery({
    queryKey: ['mspoOverView', filterDate],
    queryFn: () => mspoApiService.getMspoOverView(filterDate),
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

      {overViewError && (
        <div className="text-red-500 mb-4">
          Error fetching overview: {overViewErrorDetail?.message}
        </div>
      )}

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="animate-fade-in">
          <MspoOverView 
            mspoData={mspoOverView} 
            isLoading={overViewLoading}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="animate-fade-in">
          <MspoAnalytics mspoData={mspoOverView} isLoading={overViewLoading} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default MspoDetail;
