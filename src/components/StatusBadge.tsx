
import { cn } from "@/lib/utils";
import { useLanguage } from "./LanguageProvider";

type StatusType = "running" | "idle" | "error" | "paused" | "offline";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig = {
  running: {
    label: "running",
    className: "badge-running",
    dot: "bg-success",
  },
  idle: {
    label: "idle",
    className: "badge-idle",
    dot: "bg-secondary-foreground",
  },
  error: {
    label: "error",
    className: "badge-error",
    dot: "bg-error",
  },
  paused: {
    label: "paused",
    className: "badge-paused", 
    dot: "bg-warning",
  },
  offline: {
    label: "offline",
    className: "badge-offline",
    dot: "bg-secondary-foreground"
  }
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const {t} = useLanguage();
  const config = statusConfig[status];
  
  return (
    <span className={cn("badge", config.className, className)}>
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", config.dot)} />
      {t(config.label)}
    </span>
  );
};

export default StatusBadge;
