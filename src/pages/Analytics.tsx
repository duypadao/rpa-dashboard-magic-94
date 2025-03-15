
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SuccessRateChart from "@/components/charts/SuccessRateChart";
import TrendChart from "@/components/charts/TrendChart";
import { getSuccessRateData, getTrendData } from "@/data/robots";

const Analytics = () => {
  const successRateData = getSuccessRateData();
  const trendData = getTrendData();

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Visualize and analyze robot performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="last30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="animate-scale-in" style={{ animationDelay: "0ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground">↑ 4% from last month</p>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36m</div>
            <p className="text-xs text-muted-foreground">↓ 2m from last month</p>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">467</div>
            <p className="text-xs text-muted-foreground">↑ 12% from last month</p>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: "300ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failure Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10%</div>
            <p className="text-xs text-muted-foreground">↓ 2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="robots">Robots</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="chart-container">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Success Rate Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-full pt-4">
                <SuccessRateChart data={successRateData} />
              </CardContent>
            </Card>
            <Card className="chart-container">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Weekly Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-full pt-4">
                <TrendChart 
                  data={trendData} 
                  dataKeys={[
                    { key: "success", color: "hsl(var(--success))", name: "Success" },
                    { key: "failure", color: "hsl(var(--error))", name: "Failure" }
                  ]} 
                />
              </CardContent>
            </Card>
          </div>
          <Card className="chart-container">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Process Duration Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-full pt-4">
              <TrendChart 
                data={trendData} 
                dataKeys={[
                  { key: "duration", color: "hsl(var(--primary))", name: "Avg. Duration (min)" },
                ]} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-20">
                Detailed trend analysis will be available in the next version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="robots" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Robot-specific Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-20">
                Individual robot analytics will be available in the next version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Analytics;
