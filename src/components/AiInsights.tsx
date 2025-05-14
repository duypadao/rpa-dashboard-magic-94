
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BrainCircuit, AlertTriangle, LineChart, Lightbulb } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: "anomaly" | "optimization" | "prediction";
  severity: "low" | "medium" | "high";
  robot?: string;
}

interface AiInsightsProps {
  insights: Insight[];
  isLoading?: boolean;
}

const AiInsights = ({ insights, isLoading = false }: AiInsightsProps) => {
  const { t } = useLanguage();
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "anomaly":
        return <AlertTriangle className="h-4 w-4" />;
      case "optimization":
        return <Lightbulb className="h-4 w-4" />;
      case "prediction":
        return <LineChart className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-error/10 text-error";
      case "medium":
        return "bg-warning/10 text-warning";
      case "low":
        return "bg-info/10 text-info";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>{t('aiInsights')}</CardTitle>
          </div>
        </div>
        <CardDescription>{t('smartAnalysis')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {isLoading ? (
          // Loading state
          Array.from({ length: 3 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="p-3 glass rounded-lg animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
            </div>
          ))
        ) : insights.length > 0 ? (
          insights.map((insight, index) => (
            <div 
              key={insight.id}
              className="p-3 glass rounded-lg hover:shadow-sm transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold">{insight.title}</h3>
                <div className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  getInsightColor(insight.severity)
                )}>
                  {getInsightIcon(insight.type)}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{insight.description}</p>
              {insight.robot && (
                <div className="text-xs text-muted-foreground">
                  Robot: <span className="font-medium">{insight.robot}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No insights available at this time.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiInsights;
