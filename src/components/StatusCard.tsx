
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, XCircle, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Robot } from "@/types/robots";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface StatusCardProps {
  robot: Robot;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

// Robot color mapping for consistent UI
const robotColorMap: Record<string, string> = {
  "Invoice Processing Robot": "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 hover:border-cyan-500/30",
  "Data Extraction Bot": "from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/30",
  "Email Automation Bot": "from-amber-500/10 to-amber-600/5 border-amber-500/20 hover:border-amber-500/30",
  "Document Processing Bot": "from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/30",
  "Customer Service Bot": "from-pink-500/10 to-pink-600/5 border-pink-500/20 hover:border-pink-500/30",
  "HR Automation Bot": "from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/30",
  "Inventory Management Bot": "from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/30",
  "default": "from-gray-500/10 to-gray-600/5 border-gray-500/20 hover:border-gray-500/30"
};

const StatusCard = ({ robot, className, style, onClick }: StatusCardProps) => {
  const getResultIcon = () => {
    switch (robot.lastResult) {
      case "success":
        return null;
      case "warning":
        return <span className="text-warning">⚠️</span>;
      case "failure":
        return <XCircle className="h-4 w-4 text-error" />;
      default:
        return null;
    }
  };

  // Get color class based on robot name or default if not found
  const colorClass = robotColorMap[robot.name] || robotColorMap.default;
  
  // Special highlight for Invoice Processing Robot
  const isInvoiceRobot = robot.name.includes("Invoice");
  const highlightClass = isInvoiceRobot ? "ring-2 ring-primary/30 dark:ring-primary/20" : "";

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md bg-gradient-to-br", 
        colorClass,
        highlightClass,
        className
      )}
      style={style}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">{robot.name}</CardTitle>
          <StatusBadge status={robot.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>Last run: {robot.lastRunTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <span className="mr-1">Result:</span>
              <span className={cn(
                robot.lastResult === "success" && "text-success",
                robot.lastResult === "warning" && "text-warning",
                robot.lastResult === "failure" && "text-error"
              )}>
                {robot.lastResult.charAt(0).toUpperCase() + robot.lastResult.slice(1)}
                {getResultIcon()}
              </span>
            </div>
            <div className="text-sm">
              Duration: {robot.duration}
            </div>
          </div>
          {robot.description && (
            <div className="text-sm text-muted-foreground line-clamp-2">
              {robot.description}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full gap-2">
          Details
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StatusCard;
