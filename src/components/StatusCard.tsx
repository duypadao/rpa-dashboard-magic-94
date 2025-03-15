
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Settings, XCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Robot } from "@/data/robots";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  robot: Robot;
  className?: string;
}

const StatusCard = ({ robot, className }: StatusCardProps) => {
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

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
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
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Play className="h-3 w-3 mr-1" />
          Run
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/robot/${robot.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StatusCard;
