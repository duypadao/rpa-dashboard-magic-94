
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, XCircle, ArrowRight, CheckCheck } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Robot } from "@/types/robots";
import { cn } from "@/lib/utils";
import { CSSProperties, ReactElement, useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { humanizeDateTime } from "@/common";

interface StatusCardProps {
  robot: Robot;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  footer?: ReactElement;
  showLastRunTime?: boolean;
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


export const LastRun = ({ lastRun, t = null }: { lastRun: string | Date, t: (key: string, unicorn?: object) => void }) => {
  const [seed, setSeed] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeed(seed + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, [seed]);

  if (typeof lastRun === typeof "") {
    return lastRun
  }
  else {
    return humanizeDateTime(lastRun as Date, t);
  }
}

const StatusCard = ({ robot, className, style, onClick, footer = null, showLastRunTime = true }: StatusCardProps) => {
  const { t } = useLanguage();
  
  const getResultIcon = () => {
    switch (robot.lastResult) {
      case "success":
        return "✔️"; //
      case "warning":
        return <span className="text-warning">⚠️</span>;
      case "failure":
        return "❌️"; //<XCircle className="inline h-4 w-4 text-error" />;
      default:
        return null;
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case "success":
        return t('success');
      case "warning":
        return t('warning');
      case "failure":
        return t('failure');
      default:
        return result;
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

          {showLastRunTime && (<>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>{t('lastRun')}: <LastRun lastRun={robot.lastRunTime} t={t} /></span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <span className="mr-1">{t('result')}:</span>
                <span className={cn(
                  robot.lastResult === "success" && "text-success",
                  robot.lastResult === "warning" && "text-warning",
                  robot.lastResult === "failure" && "text-error"
                )}>
                  {getResultIcon()} {getResultText(robot.lastResult)}
                </span>
              </div>
              <div className="text-sm">
                {t('duration')}: {robot.duration}
              </div>
            </div>
          </>

          )}

          {robot.description && (
            <div className="text-sm text-muted-foreground line-clamp-2">
              {t(robot.description)}
            </div>
          )}
        </div>
      </CardContent>
      {footer ? footer : (
        <CardFooter className="p-4 pt-0">
          <Button variant="outline" size="sm" className="w-full gap-2">
            {t('details')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}

    </Card>
  );
};

export default StatusCard;
