import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import SuccessRateChart from "@/components/charts/SuccessRateChart";
import TrendChart from "@/components/charts/TrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/services/api";

const Analytics = () => {
  // Fetch success rate data
  const { data: successRateData = [], isLoading: successRateLoading } = useQuery({
    queryKey: ['analytics', 'successRate'],
    queryFn: apiService.getSuccessRateData,
  });

  // Fetch trend data
  const { data: trendData = [], isLoading: trendLoading } = useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: apiService.getTrendData,
  });

  // Define data keys for the trend chart
  const trendDataKeys = [
    { key: "success", color: "hsl(var(--success))", name: "Success" },
    { key: "failure", color: "hsl(var(--error))", name: "Failure" },
    { key: "duration", color: "hsl(var(--primary))", name: "Duration (min)" }
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Performance metrics and insights for all RPA processes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {trendLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse h-4/5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : (
              <TrendChart data={trendData} dataKeys={trendDataKeys} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {successRateLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="rounded-full animate-pulse h-4/5 aspect-square bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ) : (
              <SuccessRateChart data={successRateData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Robots</CardTitle>
          </CardHeader>
          <CardContent>
            {/* This could be another component that also uses the API */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Invoice Processing Bot</span>
                  <span className="text-xs text-success">98.2% success</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: "98.2%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Classification Bot</span>
                  <span className="text-xs text-success">96.7% success</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: "96.7%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Data Validation Bot</span>
                  <span className="text-xs text-success">95.3% success</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: "95.3%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer Onboarding Bot</span>
                  <span className="text-xs text-success">94.1% success</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: "94.1%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Order Fulfillment Bot</span>
                  <span className="text-xs text-warning">85.6% success</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: "85.6%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
