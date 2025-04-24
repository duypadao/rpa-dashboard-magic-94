
import { useState } from "react";
import Layout from "@/components/Layout";
import AiInsights from "@/components/AiInsights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiService } from "@/services/api";
import { Bot, MessageSquare, PlusCircle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const Insights = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Fetch insights with React Query
  const { 
    data: insights = [], 
    isLoading: insightsLoading 
  } = useQuery({
    queryKey: ['insights'],
    queryFn: apiService.getInsights,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "AI Response",
        description: "Based on current data, I recommend optimizing the Invoice Processing Bot by splitting large batches into smaller ones to reduce processing time.",
        duration: 5000,
      });
      setQuery("");
    }, 1500);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground">
          AI-powered analysis and optimization recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="animate-scale-in">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <Zap className="mr-2 h-5 w-5 text-error" />
              Anomaly Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              AI automatically detects unusual patterns and behaviors in robot operations
            </p>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <Zap className="mr-2 h-5 w-5 text-info" />
              Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get AI-powered recommendations to improve robot performance and efficiency
            </p>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <Zap className="mr-2 h-5 w-5 text-warning" />
              Predictive Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              AI predicts future trends and potential issues before they occur
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="mr-2 h-5 w-5" />
                Ask AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="Ask about robot performance, optimization suggestions, or anomaly explanations..."
                  className="min-h-28"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4 animate-pulse" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Query
                      </>
                    )}
                  </Button>
                </div>
              </form>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Suggested Queries</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="justify-start text-sm h-auto py-2"
                    onClick={() => setQuery("Why is the Order Fulfillment Bot failing?")}
                  >
                    <PlusCircle className="mr-2 h-3 w-3" />
                    Why is the Order Fulfillment Bot failing?
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start text-sm h-auto py-2"
                    onClick={() => setQuery("How can I improve Invoice Processing Bot performance?")}
                  >
                    <PlusCircle className="mr-2 h-3 w-3" />
                    How can I improve Invoice Processing Bot performance?
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start text-sm h-auto py-2"
                    onClick={() => setQuery("Predict next week's workload")}
                  >
                    <PlusCircle className="mr-2 h-3 w-3" />
                    Predict next week's workload
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start text-sm h-auto py-2"
                    onClick={() => setQuery("Identify optimization opportunities")}
                  >
                    <PlusCircle className="mr-2 h-3 w-3" />
                    Identify optimization opportunities
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <AiInsights insights={insights} />
        </div>
      </div>
    </>
  );
};

export default Insights;
