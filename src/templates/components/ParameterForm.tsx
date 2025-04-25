
import { FC, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Template, templates } from "../data/templates";
import { ArrowLeft, Eye, Save, Wand2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CWRPDF from "../assets/Create Wecom Robot.pdf";
interface ParameterFormProps {
  template: Template;
  params: Record<string, string>;
  onCompleted: (parameters: Record<string, string>) => void;
}

export const ParameterForm: FC<ParameterFormProps> = ({
  template,
  params,
  onCompleted,
}) => {
  const { t } = useLanguage();
  const [parameters, setParameters] = useState<Record<string, string>>(params);
  const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});
  if (!template) {
    return <div>{t("templateIsNotFound")}</div>;
  }

  const handleInputChange = async (key: string, value: string) => {
    const newParams = {
      ...parameters,
      [key]: value
    }
    setParameters(newParams);
  };

  const isFormComplete = template.parameters.every((param) =>
    parameters[param.id] && parameters[param.id].trim() !== ""
  );
  const validateAndSave = async () => {
    if (template.parameterValidation) {
      const validationResult = await template.parameterValidation(parameters);
      if (!validationResult.isValid) {
        setErrorMessage(validationResult.messages)
      }
      else {
        setErrorMessage({});
        onCompleted(parameters)
      }
    }
    else {
      onCompleted(parameters)
    }
  }
  return (
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
                  <p className="text-sm text-muted-foreground">{t("wecomRobotIdHelper")}: <a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" target="_blank" href={CWRPDF}>{t("clickHere")}</a></p>
                )}
                {errorMessage[param.id] && (
                  <p className="text-sm text-destructive">{t(errorMessage[param.id])}</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button
              variant="success"
              onClick={() => validateAndSave()}
              disabled={!isFormComplete}
            >
              <Save className="mr-2 h-4 w-4" />
              {t("save")}
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  );
};
