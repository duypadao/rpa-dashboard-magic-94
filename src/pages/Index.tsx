
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import StatusCard from "@/components/StatusCard";
import AiInsights from "@/components/AiInsights";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Robot } from "@/data/robots";
import { Filter, RefreshCw, Search } from "lucide-react";
import { apiService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const { toast } = useToast();

  // Fetch robots with React Query
  const { 
    data: robots = [], 
    isLoading: robotsLoading,
    isError: robotsError,
    refetch: refetchRobots
  } = useQuery({
    queryKey: ['robots'],
    queryFn: apiService.getRobots,
  });

  // Fetch insights with React Query
  const { 
    data: insights = [], 
    isLoading: insightsLoading 
  } = useQuery({
    queryKey: ['insights'],
    queryFn: apiService.getInsights,
  });

  // Handle refresh button click
  const handleRefresh = () => {
    refetchRobots();
    toast({
      title: "Refreshing data",
      description: "The dashboard is being updated with the latest data.",
    });
  };

  const filteredRobots = robots.filter((robot) => {
    const matchesSearch = robot.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || robot.status === statusFilter;
    const matchesResult = resultFilter === "all" || robot.lastResult === resultFilter;
    return matchesSearch && matchesStatus && matchesResult;
  });

  // Show error if robots data fetching failed
  useEffect(() => {
    if (robotsError) {
      toast({
        title: "Error loading robots",
        description: "Could not fetch robot data. Using local data as fallback.",
        variant: "destructive",
      });
    }
  }, [robotsError, toast]);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">RPA Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage all RPA robots from a central location
          </p>
        </div>
        <Button className="flex items-center" onClick={handleRefresh}>
          <RefreshCw className={`mr-2 h-4 w-4 ${robotsLoading ? 'animate-spin' : ''}`} />
          {robotsLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Total Robots</div>
            <div className="text-2xl font-semibold">{robots.length}</div>
          </div>
          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary text-lg">⚙️</span>
          </div>
        </div>
        <div className="glass rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Running</div>
            <div className="text-2xl font-semibold">
              {robots.filter((r) => r.status === "running").length}
            </div>
          </div>
          <div className="h-8 w-8 bg-success/10 rounded-full flex items-center justify-center">
            <span className="text-success text-lg">▶️</span>
          </div>
        </div>
        <div className="glass rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Issues</div>
            <div className="text-2xl font-semibold">
              {robots.filter((r) => r.status === "error").length}
            </div>
          </div>
          <div className="h-8 w-8 bg-error/10 rounded-full flex items-center justify-center">
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
                // Show loading state
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="glass rounded-lg p-4 h-40 animate-pulse">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : filteredRobots.length > 0 ? (
                filteredRobots.map((robot, index) => (
                  <StatusCard 
                    key={robot.id} 
                    robot={robot} 
                    className="animate-scale-in" 
                    style={{ animationDelay: `${index * 50}ms` }}
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
            isLoading={insightsLoading} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
