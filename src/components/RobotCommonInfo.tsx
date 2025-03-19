
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { Robot } from "@/types/robots";
import { useToast } from "@/components/ui/use-toast";

interface RobotCommonInfoProps {
  robot: Robot;
}

const RobotCommonInfo = ({ robot }: RobotCommonInfoProps) => {
  const { toast } = useToast();

  const handleInform = () => {
    toast({
      title: "Notification sent",
      description: `A notification about ${robot.name} has been sent to the team.`,
    });
  };

  return (
    <div className="mb-6">
      <Button variant="ghost" asChild className="mb-4 -ml-3">
        <Link to="/" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{robot.name}</h1>
          <p className="text-muted-foreground">{robot.description}</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleInform}>
          <Info className="h-4 w-4" />
          Inform
        </Button>
      </div>
    </div>
  );
};

export default RobotCommonInfo;
