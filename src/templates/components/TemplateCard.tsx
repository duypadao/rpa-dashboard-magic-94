
import { FC } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Antenna, Clock, Gem, Goal, LoaderPinwheel } from "lucide-react";
import { Template } from "../data/templates";
import { useLanguage } from "@/components/LanguageProvider";

interface TemplateCardProps {
  template: Template
  onClick: (id: string) => void;
}




export const TemplateCard: FC<TemplateCardProps> = ({
  template,
  onClick,
}) => {
  const { t } = useLanguage();
  const { id,
    title,
    description,
    category,
    department,
    icon,
    type,
    status } = template;
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
                <div className="flex gap-2">
                  {status === "ready" && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <Goal className="h-3 w-3" />
                      {t("ready")}
                    </Badge>
                  )}
                  {status === "developing" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <LoaderPinwheel className="h-3 w-3" />
                      {t("developing")}
                    </Badge>
                  )}
                  {type === "custom" && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                    <Gem className="h-3 w-3" />
                      {t("custom")}
                    </Badge>
                  )}
                  {type === "general" && (
                    <Badge variant="default" className="flex items-center gap-1">
                    <Antenna className="h-3 w-3" />
                      {t("general")}
                    </Badge>
                  )}
                </div>

              </div>
              <CardTitle className="text-lg mt-2">{t(title)}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-2">{t(description)}</CardDescription>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="flex items-center gap-1">
                  {t(category)}
                </Badge>
                {
                  department.map((z) => <Badge key={`${z}${id}`} variant="outline" className="flex items-center gap-1">
                    {t(z)}
                  </Badge>)
                }

              </div>
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
