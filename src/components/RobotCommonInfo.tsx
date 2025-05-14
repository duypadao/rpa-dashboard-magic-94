
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { Robot } from "@/types/robots";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "./LanguageProvider";

interface RobotCommonInfoProps {
  robot: Robot;
}

const RobotCommonInfo = ({ robot }: RobotCommonInfoProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleInform = () => {
    toast({
      title: t('notificationSent'),
      description: `${t('notificationSentDesc')} ${robot.name} ${t('notificationSentDescEnd')}.`,
    });
  };

  return (
    <div className="mb-6">
      <Button variant="ghost" asChild className="mb-4 -ml-3">
        <Link to="/" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToDashboard')}
        </Link>
      </Button>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{robot.name}</h1>
          <p className="text-muted-foreground">{t(robot.description)}</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleInform}>
          <Info className="h-4 w-4" />
          {t('inform')}
        </Button>
      </div>
    </div>
  );
};

export default RobotCommonInfo;
