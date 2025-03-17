
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, XCircle, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Robot } from "@/data/robots";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface StatusCardProps {
  robot: Robot;
  className?: string;
  style?: CSSProperties;
}

const StatusCard = ({ robot, className, style }: StatusCardProps) => {
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
  
  // Determine the correct route based on the robot
  const getLinkPath = () => {
    if (robot.id === "1") {
      return `/invoice/${robot.id}`;
    }
    return `/robot/${robot.id}`;
  };

  return (
    <Card 
      className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}
      style={style}
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
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full gap-2" asChild>
          <Link to={getLinkPath()}>
            Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StatusCard;
