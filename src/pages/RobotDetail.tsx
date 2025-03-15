
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import ProcessFlow from "@/components/ProcessFlow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRobotById, getProcessNodes, getHistoryData } from "@/data/robots";
import { ArrowLeft, Clock, Play, StopCircle } from "lucide-react";
import { Link } from "react-router-dom";

const RobotDetail = () => {
  const { id } = useParams<{ id: string }>();
  const robot = getRobotById(id || "");
  const processNodes = getProcessNodes(id || "");
  const historyData = getHistoryData();

  if (!robot) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-semibold mb-2">Robot not found</h2>
          <p className="text-muted-foreground mb-4">The robot you are looking for does not exist.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4 -ml-3">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{robot.name}</h1>
            <p className="text-muted-foreground">{robot.description}</p>
          </div>
          <div className="flex gap-2">
            {robot.status === "running" ? (
              <Button variant="outline" className="gap-2">
                <StopCircle className="h-4 w-4" />
                Stop
              </Button>
            ) : (
              <Button className="gap-2">
                <Play className="h-4 w-4" />
                Run Now
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status={robot.status} className="text-sm" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Run</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{robot.lastRunTime}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <span>{robot.duration}</span>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="process" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="process">Process Status</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
        </TabsList>
        <TabsContent value="process" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Current Process Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <ProcessFlow nodes={processNodes} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Run History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Result
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-border">
                    {historyData.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              item.result === "success"
                                ? "bg-success/10 text-success"
                                : item.result === "warning"
                                ? "bg-warning/10 text-warning"
                                : "bg-error/10 text-error"
                            }`}
                          >
                            {item.result.charAt(0).toUpperCase() + item.result.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default RobotDetail;
