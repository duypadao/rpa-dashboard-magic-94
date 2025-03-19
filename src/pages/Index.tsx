import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import StatusCard from "@/components/StatusCard";
import AiInsights from "@/components/AiInsights";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Robot } from "@/types/robots";
import { Filter, Search } from "lucide-react";
import { apiService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Insight } from "@/components/AiInsights";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  const { 
    data: robots = [], 
    isLoading: robotsLoading,
    isError: robotsError,
  } = useQuery({
    queryKey: ['robots'],
    queryFn: apiService.getRobots,
  });

  const generateInsightsFromRobots = (robots: Robot[]): Insight[] => {
    if (!robots.length) return [];
    
    const insights: Insight[] = [
      {
        id: "1",
        title: "Robot Performance Overview",
        description: `${robots.filter(r => r.status === "running").length} out of ${robots.length} robots are currently running.`,
        type: "optimization",
        severity: "medium"
      },
      {
        id: "2",
        title: "Most Successful Robot",
        description: `${robots.filter(r => r.lastResult === "success").sort((a, b) => b.description?.length || 0 - a.description?.length || 0)[0]?.name || robots[0].name} has the highest success rate.`,
        type: "prediction",
        severity: "low"
      },
      {
        id: "3",
        title: "Process Complexity",
        description: `${robots.sort((a, b) => (b.defaultProcessFlow?.length || 0) - (a.defaultProcessFlow?.length || 0))[0]?.name || robots[0].name} has the most complex workflow with ${robots.sort((a, b) => (b.defaultProcessFlow?.length || 0) - (a.defaultProcessFlow?.length || 0))[0]?.defaultProcessFlow?.length || 0} steps.`,
        type: "anomaly",
        severity: "medium"
      },
      {
        id: "4",
        title: "Resource Utilization",
        description: `${robots.filter(r => r.status === "idle").length} robots are currently idle and available for new tasks.`,
        type: "optimization",
        severity: "low"
      },
      {
        id: "5",
        title: "Error Detection",
        description: `${robots.filter(r => r.status === "error").length} robots need attention due to execution errors.`,
        type: "anomaly",
        severity: "high"
      }
    ];
    
    return insights.sort(() => 0.5 - Math.random()).slice(0, 5);
  };

  const filteredRobots = robots.filter((robot) => {
    const matchesSearch = robot.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || robot.status === statusFilter;
    const matchesResult = resultFilter === "all" || robot.lastResult === resultFilter;
    return matchesSearch && matchesStatus && matchesResult;
  });

  const handleRobotSelect = (robot: Robot) => {
    if (robot.id == "1") {
      navigate(`/invoice/${robot.id}`);
    } else {
      navigate(`/robot/${robot.id}`, { state: { robot } });
    }
  };

  const handleStatCardClick = (status: string) => {
    setStatusFilter(status);
    toast({
      title: `Filtered by ${status}`,
      description: `Showing only robots with '${status}' status`,
    });
  };

  useEffect(() => {
    if (robotsError) {
      toast({
        title: "Error loading robots",
        description: "Could not fetch robot data. Using local data as fallback.",
        variant: "destructive",
      });
    }
  }, [robotsError, toast]);

  const insights = generateInsightsFromRobots(robots);

  const getRobotColor = (robot: Robot, index: number) => {
    const colors = [
      "bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700",
      "bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700",
      "bg-purple-100 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700",
      "bg-amber-100 border-amber-300 dark:bg-amber-900/20 dark:border-amber-700",
      "bg-teal-100 border-teal-300 dark:bg-teal-900/20 dark:border-teal-700",
      "bg-indigo-100 border-indigo-300 dark:bg-indigo-900/20 dark:border-indigo-700",
      "bg-rose-100 border-rose-300 dark:bg-rose-900/20 dark:border-rose-700",
      "bg-cyan-100 border-cyan-300 dark:bg-cyan-900/20 dark:border-cyan-700",
    ];
    
    if (robot.id == "1") {
      return "bg-gradient-to-r from-amber-100 to-orange-100 border-orange-300 shadow-md dark:from-amber-900/30 dark:to-orange-900/30 dark:border-orange-700";
    }
    
    return colors[index % colors.length];
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">RPA Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage all RPA robots from a central location
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          className="glass rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md"
          onClick={() => handleStatCardClick("all")}
        >
          <div>
            <div className="text-sm text-muted-foreground">Total Robots</div>
            <div className="text-2xl font-semibold">{robots.length}</div>
          </div>
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary text-lg">⚙️</span>
          </div>
        </div>
        <div 
          className="glass rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md"
          onClick={() => handleStatCardClick("running")}
        >
          <div>
            <div className="text-sm text-muted-foreground">Running</div>
            <div className="text-2xl font-semibold">
              {robots.filter((r) => r.status === "running").length}
            </div>
          </div>
          <div className="h-10 w-10 bg-success/10 rounded-full flex items-center justify-center">
            <span className="text-success text-lg">▶️</span>
          </div>
        </div>
        <div 
          className="glass rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md"
          onClick={() => handleStatCardClick("error")}
        >
          <div>
            <div className="text-sm text-muted-foreground">Issues</div>
            <div className="text-2xl font-semibold">
              {robots.filter((r) => r.status === "error").length}
            </div>
          </div>
          <div className="h-10 w-10 bg-error/10 rounded-full flex items-center justify-center">
            <span className="text-error text-lg">⚠️</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search robots..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {robotsLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="glass rounded-lg p-4 h-40 animate-pulse">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : filteredRobots.length > 0 ? (
                filteredRobots.map((robot, index) => (
                  <StatusCard 
                    key={robot.id} 
                    robot={robot} 
                    className={`animate-scale-in cursor-pointer ${getRobotColor(robot, index)}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleRobotSelect(robot)}
                  />
                ))
              ) : (
                <div className="md:col-span-2 py-10 text-center">
                  <div className="text-muted-foreground">No robots match your filters</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <AiInsights 
            insights={insights} 
            isLoading={robotsLoading} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
