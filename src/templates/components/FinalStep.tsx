import { useLanguage } from "@/components/LanguageProvider";
import { Template } from "../data/templates";
import { ScheduleOptions } from "../data/scheduleOptions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduleTable } from "./ScheduleSetup";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, ContactRound, DiamondPlus, StepForward, Wand2 } from "lucide-react";
import { useAxios } from "@/axios/AxiosProvider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface FinalStepProps {
  template: Template;
  schedules: ScheduleOptions[],
  params: Record<string, string>,
  onBack: () => void;
}

const AUTOMATION_SERVER = "http://ros:5089";

const FinalStep = ({ template, schedules, params, onBack }: FinalStepProps) => {
  const [created, setCreated] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const axios = useAxios();
  const [description, setDescription] = useState<string>("");
  const generateDescription = () => {
    setDescription(template.generateDescription(params, t))
  }
  const createAutomation = async () => {
    if (!description) {
      toast({
        title: t("notification"),
        description: t("pleaseInputDescriptionForYourAutomation"),
      });
      return;
    }
    const automationModel = template.createAutomation(schedules, params, description, t);
    try {
      await axios.post(`${AUTOMATION_SERVER}/automation/createAutomation`, automationModel);
      setCreated(true);
    }
    catch {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("failToCreateAutomationPleaseTryAgainLater"),
      });
    }

  }



  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("finalStepTitle")}</CardTitle>
        <CardDescription>{t("finalStepDescription")}</CardDescription>
      </CardHeader>


      <CardContent>
        <h1 className="text-xl mb-2">{t("yourAutomationSetup")}</h1>
        <div className="flex flex-wrap gap-2 justify-start">
          {Object.entries(params).map(([k, v]) =>
            <div key={k}>
              <p className="font-semibold">
                {t(k)}: <span className="text-primary font-normal">{v}</span>
              </p>
            </div>
          )}
        </div>
        <div className="mb-5"></div>
        <h1 className="text-xl mb-2">{t("yourAutomationRunSchedule")}</h1>
        <ScheduleTable scheOpts={schedules}></ScheduleTable>
        <div className="mb-5"></div>
        <Label htmlFor={"description"}>
          {t("description")}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <div className="flex flex-wrap justify-start gap-2">
          <Input
            className="w-100 grow"
            id={"description"}
            placeholder={t("inputSimpleDescription")}
            value={description}
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            required
            readOnly={!created}
          />
          {!created && <Button variant="outline"
            onClick={() => { generateDescription() }}
          >
            <DiamondPlus className="mr-2 h-4 w-4" />
            {t("generateDescription")}
          </Button>}

        </div>

        {created ? (
          <div>
            <div className="bg-green-100 text-green-900 border-green-300 mt-5 rounded-md">
              <div className="flex items-center p-4">
                <CheckCircleIcon className="w-6 h-6 text-green-700 mr-2" />
                <p>{t("createAutomationSuccess")}</p>
              </div>
            </div>
            <div className="flex justify-around mt-3">
              <Button
                onClick={() => { onBack() }}
              >
                <StepForward className="mr-2 h-4 w-4" />
                {t("createOtherAutomation")}
              </Button>


              <Link to={"/myTemplate"}>
                <Button>
                  <ContactRound className="mr-2 h-4 w-4" />
                  {t("manageYourTemplate")}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mt-5">
            <Button variant="success"
              onClick={() => { createAutomation() }}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {t("createAutomation")}
            </Button>
          </div>
        )}
      </CardContent>



    </Card>
  );
};

export default FinalStep;
