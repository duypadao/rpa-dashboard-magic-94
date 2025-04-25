import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Eye, Forward, Wand2 } from "lucide-react";
import { Template, templates } from "../data/templates";
import Preview from "./Preview";
import { ParameterForm } from "./ParameterForm";
import ScheduleSetup from "./ScheduleSetup";
import FinalStep from "./FinalStep";
import { ScheduleOptions } from "../data/scheduleOptions";
type CurrentStep = "preview" | "paramSetup" | "configSchedule" | "finalStep";


interface CreateAutomationProps {
  templateId: string;
  onBack: () => void;
}

const CreateAutomation = ({ templateId, onBack }: CreateAutomationProps) => {
  const { t } = useLanguage();
  const template = templates.find(z => z.id === templateId);
  const [schedules, setSchedules] = useState<ScheduleOptions[]>([]);
  const [params, setParams] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<CurrentStep>("preview");
  const OnParamSetupCompleted = (parameters: Record<string, string>) => {
    setParams(parameters);
    nextTab();
  }
  console.log(schedules);
  const onScheduleSetupCompleted = (schedule: ScheduleOptions[]) => {
    setSchedules(schedule)
    nextTab();
  }
  const list: CurrentStep[] = ["preview", "paramSetup", "configSchedule", "finalStep"];
  const onTabChange = (value: CurrentStep) => {
    setTab(value);
  }
  const nextTab = () => {
    const currentIndex = list.findIndex(z => z === tab);
    setTab(list[currentIndex + 1]);
  }
  const prevTab = () => {
    const currentIndex = list.findIndex(z => z === tab);
    setTab(list[currentIndex - 1]);
  }
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Button
        variant="ghost"
        className="w-fit mb-2 p-0 h-auto font-normal"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("return")}
      </Button>
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">

          <CardTitle className="text-2xl">{t(template.title)}</CardTitle>
          <CardDescription>{t(template.description)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={"preview"} value={tab} onValueChange={onTabChange}>
            <TabsList className="mb-6">
              {list.map(k => <TabsTrigger value={k}>{t(k)}</TabsTrigger>)}
            </TabsList>

            <TabsContent value={"preview"}>
              <Preview template={template}></Preview>
            </TabsContent>
            <TabsContent value={"paramSetup"}>
              <ParameterForm template={template} params={params} onCompleted={OnParamSetupCompleted}></ParameterForm>
            </TabsContent>

            <TabsContent value={"configSchedule"}>
              <ScheduleSetup template={template} schedules={schedules} onCompleted={onScheduleSetupCompleted}></ScheduleSetup>
            </TabsContent>

            <TabsContent value={"finalStep"}>
              <FinalStep template={template}></FinalStep>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 px-0 mt-6">
          {tab !== "preview" && (
            <Button
              onClick={() => prevTab()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("previousStep")}
            </Button>
          )}
          {tab !== "finalStep" && (
            <Button
              onClick={() => nextTab()}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              {t("nextStep")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateAutomation;
