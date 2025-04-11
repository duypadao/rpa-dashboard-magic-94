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


interface RobotContextOverviewProps {
  getRobots: () => Array<Robot>,
  registerRobot: (arr: Array<Robot>) => void,
  getLastUpdatedTime: () => number
};
const RobotOverviewContext = createContext<RobotContextOverviewProps>(null);


const Summary = () => {
  const { getRobots, getLastUpdatedTime } = useContext(RobotOverviewContext);
  const { t } = useLanguage();
  const [lastUpdatedTime, setLastUpdatedTime] = useState(-1);
  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("RobotInsights useEffect");
      // console.log(`getLastUpdatedTime : ${getLastUpdatedTime()}`)
      // console.log(`lastUpdatedTime : ${lastUpdatedTime}`)
      if(getLastUpdatedTime() > lastUpdatedTime){
        setLastUpdatedTime(getLastUpdatedTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdatedTime])
  console.log("Summary rendered");
  return (
    <>{lastUpdatedTime}</>
  )
}

const RobotOverviewContainer = ({ children }) => {
  const robots = useRef({});
  const lastUpdatedTime = useRef(new Date().getTime());
  const registerRobot = (rbs: Array<Robot>) => {
    rbs.forEach((r) => {
      robots.current[r.name] = r
    })
    lastUpdatedTime.current = new Date().getTime();
  }
  const getRobots = (): Array<Robot> => { return Object.values(robots.current) }; // () : Array<Robot>
  const getLastUpdatedTime = () => { return lastUpdatedTime.current };

  return <RobotOverviewContext.Provider value={{
    getRobots, registerRobot, getLastUpdatedTime
  }
  }>
    <Summary />
    {children}
  </RobotOverviewContext.Provider>
}

const RobotInsights = () => {
  const { getRobots, getLastUpdatedTime } = useContext(RobotOverviewContext);
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
        title: `${runningRobots.length} robots running successfully`,
        description: "Most robots are operating normally without issues",
        type: "optimization",
        severity: "low"
      });
    }

    if (failingRobots.length > 0) {
      insights.push({
        id: "failing-robots",
        title: `${failingRobots.length} robots are experiencing errors`,
        description: "Attention required for robots in error state",
        type: "anomaly",
        severity: "high",
        robot: failingRobots[0]?.name
      });
    }

    // Add more insights based on the data
    if (robotsData.length > 0) {
      // Find the longest running robot
      const longestRunningRobot = [...robotsData].sort((a, b) => {
        const durationA = a.duration.includes("h") ? parseInt(a.duration) * 60 : parseInt(a.duration);
        const durationB = b.duration.includes("h") ? parseInt(b.duration) * 60 : parseInt(b.duration);
        return durationB - durationA;
      })[0];

      insights.push({
        id: "longest-running",
        title: `${longestRunningRobot.name} has the longest runtime`,
        description: `Consider optimizing this robot's process flow for better efficiency`,
        type: "optimization",
        severity: "medium",
        robot: longestRunningRobot.name
      });

      // Predict workload based on current status
      insights.push({
        id: "workload-prediction",
        title: "Predicted increased workload for Invoice Processing",
        description: "Based on historical data, expect 15% more invoices next week",
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
      if(getLastUpdatedTime() > lastUpdatedTime){
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
  const { registerRobot } = useContext(RobotOverviewContext);
  const navigate = useNavigate();
  const { t } = useLanguage();
  // Fetch robots with React Query
  const { data: robots = [], isLoading, isError, isFetched, } = useQuery({
    queryKey: ["robots"],
    queryFn: apiService.getRobots,
    refetchInterval:  1000 * 60 * 5
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
    <Layout>
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
              {view === "grid" ? "List View" : "Grid View"}
            </Button>
          </div>
        </div>

        <Separator />
      </div>
      <RobotOverviewContainer>
        {/* Main content area with robots and insights side by side */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Robots section */}
          <div className="md:col-span-8">
            <RPA8112Robots searchTerm={searchTerm} statusFilter={statusFilter} view={view}></RPA8112Robots>
          </div>
          <div className="md:col-span-4">
          <RobotInsights />
          </div>
        </div>
      </RobotOverviewContainer>
    </Layout>
  );
};

export default Index;
