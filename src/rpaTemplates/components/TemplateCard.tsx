
import { FC } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock } from "lucide-react";

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  timeSaved: string;
  onClick: (id: string) => void;
}

export const TemplateCard: FC<TemplateCardProps> = ({
  id,
  title,
  description,
  icon,
  timeSaved,
  onClick,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card 
            className="w-full h-full cursor-pointer hover:shadow-md transition-all duration-200 border hover:border-primary/50"
            onClick={() => onClick(id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {icon}
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeSaved}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2 h-10">{description}</CardDescription>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
