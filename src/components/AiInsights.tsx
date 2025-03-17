
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: "anomaly" | "optimization" | "prediction";
  severity?: "low" | "medium" | "high";
  robot?: string;
}

interface AiInsightsProps {
  insights: Insight[];
  className?: string;
}

const AiInsights = ({ insights, className }: AiInsightsProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const filteredInsights = activeTab === "all" 
    ? insights 
    : insights.filter(insight => insight.type === activeTab);
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          <CardTitle>AI Insights</CardTitle>
        </div>
        <CardDescription>AI-powered analysis and recommendations</CardDescription>
      </CardHeader>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-4 mb-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="anomaly">Anomalies</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="prediction">Predictions</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value={activeTab} className="mt-0">
          <CardContent className="p-0 max-h-[400px] overflow-auto">
            <div className="divide-y">
              {filteredInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-4 hover:bg-muted/30 transition-colors animate-scale-in"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {insight.type === "anomaly" ? (
                        <div className="h-6 w-6 rounded-full bg-error/10 flex items-center justify-center">
                          <Zap className="h-3.5 w-3.5 text-error" />
                        </div>
                      ) : insight.type === "optimization" ? (
                        <div className="h-6 w-6 rounded-full bg-info/10 flex items-center justify-center">
                          <Zap className="h-3.5 w-3.5 text-info" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-warning/10 flex items-center justify-center">
                          <Zap className="h-3.5 w-3.5 text-warning" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      {insight.robot && (
                        <p className="text-xs text-muted-foreground">Robot: {insight.robot}</p>
                      )}
                      {insight.severity && (
                        <div className="flex items-center mt-2">
                          <span className="text-xs mr-1">Severity:</span>
                          <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded-full",
                            insight.severity === "high" && "bg-error/10 text-error",
                            insight.severity === "medium" && "bg-warning/10 text-warning",
                            insight.severity === "low" && "bg-info/10 text-info",
                          )}>
                            {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      <div className="p-4 bg-muted/30 border-t">
        <div className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">Ask AI a question</div>
          <Button variant="ghost" size="sm" className="ml-auto">
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AiInsights;
