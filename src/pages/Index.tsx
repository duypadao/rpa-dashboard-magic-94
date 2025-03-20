
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import StatusCard from "@/components/StatusCard";
import { apiService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Bot, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Robot } from "@/types/robots";
import { useLanguage } from "@/components/LanguageProvider";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Fetch robots with React Query
  const { data: robots = [], isLoading, isError } = useQuery({
    queryKey: ["robots"],
    queryFn: apiService.getRobots,
  });

  // Filter robots based on search term and status
  const filteredRobots = useMemo(() => {
    return robots.filter((robot) => {
      const matchesSearch = robot.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || robot.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [robots, searchTerm, statusFilter]);

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

  // Generate insights using the robots data
  const insights = useMemo(() => {
    return generateInsightsFromRobots(robots);
  }, [robots]);

  // Navigate to robot detail page
  const handleRobotClick = (robotId: string) => {
    // Check if this is the Invoice Robot
    if (robotId === "1") {
      navigate("/invoice");
    } else {
      // For all other robots, navigate to the robot/:id page
      navigate(`/robot/${robotId}`);
    }
  };

  const getContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse bg-muted rounded-lg"></div>
          ))}
        </div>
      );
    }

    if (isError || !robots.length) {
      return (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center">
          <h2 className="text-xl font-semibold mb-2">{t('couldNotLoadRobots')}</h2>
          <p className="text-muted-foreground">{t('tryAgainLater')}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRobots.map((robot) => (
          <StatusCard 
            key={robot.id} 
            robot={robot} 
            onClick={() => handleRobotClick(robot.id)}
            className="cursor-pointer"
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">{t('robotStatusOverview')}</h1>
        <p className="text-muted-foreground">{t('monitorAllRobots')}</p>
      </div>

      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
            <Button variant="outline" size="sm" className="sm:ml-auto h-10">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {t('filterByStatus')}: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
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
      </div>

      {getContent()}

      {/* AI Insights section */}
      {!isLoading && !isError && robots.length > 0 && (
        <Card className="mt-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
              {t('aiInsights')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div
                  key={insight.id}
                  className="p-3 glass rounded-lg hover:shadow-sm transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold">{insight.title}</h3>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${
                      insight.severity === "high" 
                        ? "bg-error/10 text-error"
                        : insight.severity === "medium"
                        ? "bg-warning/10 text-warning"
                        : "bg-info/10 text-info"
                    }`}>
                      {insight.type}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{insight.description}</p>
                  {insight.robot && (
                    <div className="text-xs text-muted-foreground">
                      {t('robot')}: <span className="font-medium">{insight.robot}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <Bot className="mr-2 h-5 w-5" />
                {t('noInsightsAvailable')}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default Index;
