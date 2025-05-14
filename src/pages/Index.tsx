import { useState, useMemo, useRef, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import StatusCard from "@/components/StatusCard";
import { apiService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Bot, Search as SearchIcon, SlidersHorizontal, LayoutGrid, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Robot } from "@/types/robots";
import { useLanguage } from "@/components/LanguageProvider";
import AiInsights from "@/components/AiInsights";
import { RobotContext, RobotContainer } from "@/robots/robotContext";
import { LABRobots } from "@/robots/lab/labRobots";
import { DataCard } from "@/components/DataCard";
import { round,formatSecond } from "@/common";
import UtilityRobots from "@/robots/rpa/utilityRobots";

const Summary = () => {
  const { getRobots, getLastUpdatedTime } = useContext(RobotContext);
  const { t } = useLanguage();
  const [lastUpdatedTime, setLastUpdatedTime] = useState(-1);
  useEffect(() => {
    const interval = setInterval(() => {
      if (getLastUpdatedTime() > lastUpdatedTime) {
        setLastUpdatedTime(getLastUpdatedTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdatedTime]);
  const robots = getRobots();
  const running = robots.filter(z => z.status === "running").length;
  const robotCount = robots.length;
  const runningRate = round(running / robotCount * 100, 1);
  const activeRobot = robots.filter(z => z.status !== "offline").length;
  const activeRate = round(activeRobot / robots.length * 100, 2);

  const successTasks = robots.map(z => z.successCount).reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
  const errorTasks = robots.map(z => z.errorCount).reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
  const totalTasks = successTasks + errorTasks;
  const successRate = totalTasks < 1 ? 0 : round(successTasks / totalTasks * 100, 2);
  const errorRate = totalTasks < 1 ? 0 :  round(errorTasks / totalTasks * 100, 2);

  const estimateSavingDuration = robots.map(z => z.estimateSavingDuration).reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
  const estimateSavingDurationInHours = round(estimateSavingDuration / 60 / 60, 1);

  const totalRunningDuration = robots.map(z => z.totalRunningDuration).reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
  const totalRunningDurationInHours = round(totalRunningDuration / 60 / 60, 1);
  const workSpeed = totalRunningDuration < 1 ? 0 : round(estimateSavingDuration / totalRunningDuration * 100, 2);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DataCard value={running} title={t("runningRobot")} rate={runningRate} description={`${t("totalRobot")} ${robotCount}`} description2={`${t("activeRobots")} ${activeRate}%`}></DataCard>
        <DataCard value={successTasks} title={t("successTasks")} rate={successRate} description={`${t("totalTasks")} ${totalTasks}`} description2={`${t("errorRate")}: ${errorTasks} (${errorRate}%)`}></DataCard>
        <DataCard value={`${formatSecond(estimateSavingDuration,t)}`} title={t("savingTime")} rate={null} description={``} description2={""}></DataCard>
        <DataCard value={`${formatSecond(totalRunningDuration,t)}`} title={t("robotRunningTime")} rate={workSpeed} description={`${t("robotWork {{rate}} % thanManualWork", { rate: workSpeed })}`} description2={""}></DataCard>
      </div>

    </>


  )
}



const RobotInsights = () => {
  const { getRobots, getLastUpdatedTime } = useContext(RobotContext);
  const { t } = useLanguage();
  const [lastUpdatedTime, setLastUpdatedTime] = useState(-1);
  // Generate insights from robots data
  const generateInsightsFromRobots = (robotsData: Robot[]) => {
    if (!robotsData || robotsData.length === 0) return [];

    const insights = [];

    // Calculate overall success rate
    const runningRobots = robotsData.filter(r => r.status === "running");
    const failingRobots = robotsData.filter(r => r.status === "error");

    if (runningRobots.length > 0) {
      insights.push({
        id: "success-rate",
        title: `${runningRobots.length} ${t('robotsRunningSuccessfully')}`,
        description: t('mostRobotsOperatingNormally'),
        type: "optimization",
        severity: "low"
      });
    }

    if (failingRobots.length > 0) {
      insights.push({
        id: "failing-robots",
        title: `${failingRobots.length} ${t('robotsExperiencingErrors')}`,
        description: t('attentionRequiredForErrorRobots'),
        type: "anomaly",
        severity: "high",
        robot: failingRobots[0]?.name
      });
    }

    // Add more insights based on the data
    if (robotsData.length > 0) {
      // Find the longest running robot
      const longestRunningRobot = [...robotsData].sort((a, b) => {
        // const durationA = a.duration.includes("h") ? parseInt(a.duration) * 60 : parseInt(a.duration);
        // const durationB = b.duration.includes("h") ? parseInt(b.duration) * 60 : parseInt(b.duration);
        return (b.duration as number) - (a.duration as number);
      })[0];

      insights.push({
        id: "longest-running",
        title: `${t(longestRunningRobot.name)} ${t('hasTheLongestRuntime')}`,
        description: `${t('optimizeRobotProcessFlow')}`,
        type: "optimization",
        severity: "medium",
        robot: longestRunningRobot.name
      });

      // Predict workload based on current status
      insights.push({
        id: "workload-prediction",
        title: t('predictedIncreasedWorkload'),
        description: t('expectedMoreInvoices'),
        type: "prediction",
        severity: "medium"
      });
    }

    return insights;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("RobotInsights useEffect");
      // console.log(`getLastUpdatedTime : ${getLastUpdatedTime()}`)
      // console.log(`lastUpdatedTime : ${lastUpdatedTime}`)
      if (getLastUpdatedTime() > lastUpdatedTime) {
        setLastUpdatedTime(getLastUpdatedTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdatedTime])
  // Generate insights using the robots data
  const insights = useMemo(() => {
    return generateInsightsFromRobots(getRobots());
  }, [lastUpdatedTime]);
  console.log("RobotInsights rendered");
  return (
    <>
      {/* AI Insights section */}

      <div className="mb-4">
        <h2 className="text-xl font-medium">{t('availableInsights')}</h2>
      </div>

      <AiInsights
        insights={insights}
        isLoading={false}
      />

    </>
  )
}


const RPA8112Robots = ({ searchTerm, statusFilter, view }) => {
  const { registerRobot } = useContext(RobotContext);
  const navigate = useNavigate();
  const { t } = useLanguage();
  // Fetch robots with React Query
  const { data: robots = [], isLoading, isError, isFetched, } = useQuery({
    queryKey: ["robots"],
    queryFn: ()=>{
      return apiService.getRobots(t);
    } ,
  });
  if (isFetched) {
    registerRobot(robots);
  }
  // Filter robots based on search term and status
  const filteredRobots = useMemo(() => {
    return robots.filter((robot) => {
      const matchesSearch = robot.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || robot.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [robots, searchTerm, statusFilter]);
  console.log(robots);

  // Navigate to robot detail page
  const handleRobotClick = (robot: Robot) => {
    // Check if this is the Invoice Robot
    switch (robot.id.toString()) {
      case "1":
        // Navigate to Invoice page
        navigate("/invoice");
        break;
      case "2":
        // Navigate to Analytics page
        navigate("/mspo");
        break;
      default:
        navigate(`/robot/${robot.id}`, { state: { robot } });
        break;
    }
  };
  console.log("RPA8112Robots rendered");

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-medium">{t('robotsOverview')}</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 animate-pulse bg-muted rounded-lg"></div>
          ))}
        </div>
      ) : isError || !robots.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[40vh] text-center p-6">
            <h2 className="text-xl font-semibold mb-2">{t('couldNotLoadRobots')}</h2>
            <p className="text-muted-foreground">{t('tryAgainLater')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid ${view === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-4`}>
          {filteredRobots.map((robot) => (
            <StatusCard
              key={robot.id}
              robot={robot}
              showLastRunTime={true}
              onClick={() => handleRobotClick(robot)}
              className={`cursor-pointer hover:shadow-md transition-all duration-300 ${view === "list" ? "md:max-w-full" : ""}`}
            />
          ))}
        </div>
      )}
    </>
  )
}




const Index = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <>
      {/* Header section with title and search controls */}
      <div className="mb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{t('robotStatusOverview')}</h1>
            <p className="text-muted-foreground">{t('monitorAllRobots')}</p>
          </div>

          {/* Search and filter controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchRobots')}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {t('filterByStatus')}: {statusFilter === 'all' ? t('allRobots') : t(statusFilter)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  {t('allRobots')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("running")}>
                  {t('running')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("stopped")}>
                  {t('stopped')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("error")}>
                  {t('error')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              className="h-10"
              onClick={() => setView(view === "grid" ? "list" : "grid")}
            >
              {view === "grid" ? (
                <ArrowUpDown className="h-4 w-4 mr-2" />
              ) : (
                <LayoutGrid className="h-4 w-4 mr-2" />
              )}
              {view === "grid" ? t('List View') : t('Grid View')}
            </Button>
          </div>
        </div>

        <Separator />
      </div>
      <RobotContainer>
        <Summary></Summary>
        <div className="mb-8"></div>
        {/* Main content area with robots and insights side by side */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Robots section */}
          <div className="md:col-span-8">
            <LABRobots searchTerm={searchTerm} statusFilter={statusFilter} view={view}></LABRobots>
            <div className="mb-8"></div>
            <RPA8112Robots searchTerm={searchTerm} statusFilter={statusFilter} view={view}></RPA8112Robots>
            <div className="mb-8"></div>
            <UtilityRobots searchTerm={searchTerm} statusFilter={statusFilter} view={view}></UtilityRobots>
          </div>
          <div className="md:col-span-4">
            <RobotInsights />
          </div>
        </div>
      </RobotContainer>
    </>
  );
};

export default Index;
