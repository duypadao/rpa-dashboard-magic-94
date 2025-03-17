
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle, Circle, Loader2 } from "lucide-react";
import { ProcessNode } from "@/components/ProcessFlow";

interface HorizontalProcessFlowProps {
  nodes: ProcessNode[];
  className?: string;
}

const HorizontalProcessFlow = ({ nodes, className }: HorizontalProcessFlowProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-success" />;
      case "failure":
        return <XCircle className="h-8 w-8 text-error" />;
      case "in-progress":
        return <Loader2 className="h-8 w-8 text-info animate-spin" />;
      case "warning":
        return <AlertTriangle className="h-8 w-8 text-warning" />;
      default:
        return <Circle className="h-8 w-8 text-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success/20 border-success";
      case "failure":
        return "bg-error/20 border-error";
      case "in-progress":
        return "bg-info/20 border-info";
      case "warning":
        return "bg-warning/20 border-warning";
      default:
        return "bg-muted/20 border-muted";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-nowrap items-start overflow-x-auto pb-6 pt-2">
        {nodes.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center min-w-[150px] max-w-[200px] relative">
            {/* Connector line */}
            {index < nodes.length - 1 && (
              <div 
                className={cn(
                  "absolute top-8 h-0.5 right-0 w-full translate-x-1/2 z-0",
                  node.status === "success" ? "bg-success/40" : 
                  node.status === "failure" ? "bg-error/40" : 
                  node.status === "in-progress" ? "bg-info/40" : "bg-muted/40"
                )}
              />
            )}
            
            {/* Node */}
            <div 
              className={cn(
                "relative z-10 flex flex-col items-center animate-fade-in transition-all duration-500", 
                { "opacity-50": node.status === "pending" }
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-3 bg-background rounded-full p-1.5">
                {getStatusIcon(node.status)}
              </div>
              <div 
                className={cn(
                  "glass p-4 rounded-lg border-2 w-full text-center mb-2",
                  getStatusColor(node.status)
                )}
              >
                <h4 className="text-sm font-medium mb-1">{node.name}</h4>
                {node.duration && node.status !== "pending" && (
                  <p className="text-xs text-muted-foreground">{node.duration}</p>
                )}
              </div>
              
              {node.error && (
                <div className="mt-2 text-xs bg-error/10 text-error p-2 rounded w-full text-center">
                  {node.error}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalProcessFlow;
