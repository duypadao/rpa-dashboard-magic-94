
import { FC, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { templates } from "../data/templates";
import { ArrowLeft, Eye, Wand2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface ParameterFormProps {
  templateId: string;
  onBack: () => void;
  onGenerate: (parameters: Record<string, string>) => void;
  onPreview: (parameters: Record<string, string>) => void;
}

export const ParameterForm: FC<ParameterFormProps> = ({
  templateId,
  onBack,
  onGenerate,
  onPreview,
}) => {
  const {t} = useLanguage();
  const template = templates.find((t) => t.id === templateId);
  const [parameters, setParameters] = useState<Record<string, string>>({});

  if (!template) {
    return <div>{t("templateIsNotFound")}</div>;
  }

  const handleInputChange = (key: string, value: string) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  const isFormComplete = template.parameters.every((param) => 
    parameters[param.id] && parameters[param.id].trim() !== ""
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <Button 
            variant="ghost" 
            className="w-fit mb-2 p-0 h-auto font-normal"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("return")}
          </Button>
          <CardTitle className="text-2xl">{t(template.title)}</CardTitle>
          <CardDescription>{t(template.description)}</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side: Template illustration and steps */}
            <div className="w-full md:w-2/5">
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center mb-4">
                <div className="p-6 rounded-full bg-primary/10 text-primary">
                  {template.icon}
                </div>
              </div>
              <h3 className="font-medium mb-2">{t("automationSteps")}</h3>
              <ol className="space-y-2">
                {template.steps.map((step, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span>{t(step)}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            {/* Right side: Parameter form */}
            <div className="w-full md:w-3/5">
              <h3 className="font-medium mb-4">{t("paramaterSetup")}</h3>
              <div className="space-y-4">
                {template.parameters.map((param) => (
                  <div key={param.id} className="space-y-2">
                    <Label htmlFor={param.id}>
                      {param.label}
                      {param.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    {param.type === "text" && (
                      <Input
                        id={param.id}
                        placeholder={param.placeholder}
                        value={parameters[param.id] || ""}
                        onChange={(e) => handleInputChange(param.id, e.target.value)}
                        required={param.required}
                      />
                    )}
                    {param.type === "textarea" && (
                      <Textarea
                        id={param.id}
                        placeholder={param.placeholder}
                        value={parameters[param.id] || ""}
                        onChange={(e) => handleInputChange(param.id, e.target.value)}
                        required={param.required}
                      />
                    )}
                    {param.type === "select" && (
                      <Select
                        value={parameters[param.id] || ""}
                        onValueChange={(value) => handleInputChange(param.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={param.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {param.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(option.label)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {param.description && (
                      <p className="text-sm text-muted-foreground">{t(param.description)}</p>
                    )}
                    {param.id === "wecomRobotId" && (
                       <p className="text-sm text-muted-foreground">{t("wecomRobotIdHelper")}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 px-0 mt-6">
          <Button
            onClick={() => onGenerate(parameters)}
            disabled={!isFormComplete}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {t("generateAutomation")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
