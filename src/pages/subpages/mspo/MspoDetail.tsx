
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, CheckCircle, Clock, Download, FileCheck2, Zap } from "lucide-react";
import { mspoApiService } from "@/services/mspoApi";
import RobotCommonInfo from "@/components/RobotCommonInfo";
import MspoAnalytics from "./components/MspoAnalytics";
import MspoOverView from "./components/MspoOverView";
import { useLanguage } from "@/components/LanguageProvider";
import { formatDateTime, formatDurationBySecondToFixed } from "@/ultis/datetime";

export interface MspoSummary {
  runDays:number;
  runDaysWithPO: number;
  totalDownloadedPOs: number;
  estimatedTimeSavedInSeconds: number;

  runDaysThisMonth: number;
  runDaysWithPOThisMonth: number;
  totalDownloadedPOsThisMonth: number;
  estimatedTimeSavedThisMonthInSeconds: number;
}

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

  //Fetch robot data with React Query
  const { 
    data: mspoSummary, 
    isLoading: summaryLoading,
  } = useQuery({
    queryKey: ['mspoSummary'],
    queryFn: () => mspoApiService.getMspoSummary(),
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

  if (robotLoading && summaryLoading) {
    return <div>Loading...</div>;
  }

  if (!robot || !mspoSummary) {
    return <div>Robot not found</div>;
  }

  return (
    <>
      {/* Common robot information section */}
      <RobotCommonInfo robot={robot} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
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
            <span>{formatDateTime(robot.lastRunTime)}</span>
          </CardContent>
        </Card>
        {/* Run Day */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium ">{t('mspo.rundays')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarCheck className="h-6 w-6 mr-2 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{mspoSummary.runDaysThisMonth}</div>
                <p className="text-xs">{mspoSummary.runDays} {t('total')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Run Day With PO */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium ">{t('mspo.runDaysWithPO')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileCheck2 className="h-6 w-6 mr-2 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{mspoSummary.runDaysWithPOThisMonth}</div>
                <p className="text-xs">{mspoSummary.runDaysWithPO} {t('total')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total PO Downloaded */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium ">{t('mspo.totalDownloadedPOs')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Download className="h-6 w-6 mr-2 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{mspoSummary.totalDownloadedPOsThisMonth}</div>
                <p className="text-xs">{mspoSummary.totalDownloadedPOs} {t('total')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Run Day With PO */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium ">{t('timeSaved')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Zap className="h-6 w-6 mr-2 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{formatDurationBySecondToFixed(mspoSummary.estimatedTimeSavedThisMonthInSeconds)}</div>
                <p className="text-xs">{formatDurationBySecondToFixed(mspoSummary.estimatedTimeSavedInSeconds)} {t('total')}</p>
              </div>
            </div>
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
    </>
  );
};

export default MspoDetail;
