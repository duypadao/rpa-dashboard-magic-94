
import { cn } from "@/lib/utils";

type StatusType = "running" | "idle" | "error" | "paused";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig = {
  running: {
    label: "Running",
    className: "badge-running",
    dot: "bg-success",
  },
  idle: {
    label: "Idle",
    className: "badge-idle",
    dot: "bg-secondary-foreground",
  },
  error: {
    label: "Error",
    className: "badge-error",
    dot: "bg-error",
  },
  paused: {
    label: "Paused",
    className: "badge-paused", 
    dot: "bg-warning",
  },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span className={cn("badge", config.className, className)}>
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
