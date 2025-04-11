
import { cn } from "@/lib/utils";
import { BatteryWarning, CheckCircle2, CircleAlert, FileWarningIcon, Loader2, MessageCircleWarningIcon, XCircle } from "lucide-react";

export interface ProcessNode {
  id: string;
  name: string;
  status: "success" | "warning" | "failure" | "in-progress" | "pending";
  startTime?: string;
  endTime?: string;
  duration?: string;
  error?: string;
}

interface ProcessFlowProps {
  nodes: ProcessNode[];
  className?: string;
}

const ProcessFlow = ({ nodes, className }: ProcessFlowProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "warning":
        return <MessageCircleWarningIcon className="h-5 w-5 text-warning" />;
      case "failure":
        return <XCircle className="h-5 w-5 text-error" />;
      case "in-progress":
        return <Loader2 className="h-5 w-5 text-info animate-spin" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted" />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {nodes.map((node, index) => (
        <div key={node.id} className="relative">
          {index < nodes.length - 1 && (
            <div 
              className={cn(
                "absolute left-2.5 top-6 w-0.5 h-full -ml-px",
                node.status === "success" ? "bg-success/30" : 
                node.status === "warning" ? "bg-warning/30" :
                node.status === "failure" ? "bg-error/30" : 
                node.status === "in-progress" ? "bg-info/30" : "bg-muted"
              )}
            />
          )}
          <div className="flex items-start">
            <div className="mr-3 flex-shrink-0">{getStatusIcon(node.status)}</div>
            <div className="flex-1 glass p-3 rounded-lg animate-slide-in-right" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="font-medium">{node.name}</div>
                {node.duration && (
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    Duration: {node.duration}
                  </div>
                )}
              </div>
              
              {(node.startTime || node.endTime) && (
                <div className="mt-1 flex text-xs text-muted-foreground gap-x-2">
                  {node.startTime && <div>Start: {node.startTime}</div>}
                  {node.endTime && <div>End: {node.endTime}</div>}
                </div>
              )}
              
              {node.error && (
                <div className="mt-2 text-xs bg-error/10 text-error p-2 rounded">
                  {node.error}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessFlow;
