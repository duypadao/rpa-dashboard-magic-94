import { useLanguage } from "@/components/LanguageProvider";
import { Template } from "../data/templates";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Save, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { humanizeScheduleOptions, ScheduleOptions, transformEveryDayAt, ScheduleType } from "../data/scheduleOptions";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScheduleSetupProps {
  template: Template;
  schedules: ScheduleOptions[];
  onCompleted: (schedules: ScheduleOptions[]) => void;
}

const ScheduleForm = ({ onCreated }: { onCreated: (opt: ScheduleOptions) => void }) => {
  const { t } = useLanguage();
  const [type, setType] = useState<ScheduleType>("everyDayAt");
  const [runTime, setRunTime] = useState<string>("00:00");

  const create = () => {
    const spl = runTime.split(":");
    const hour = parseInt(spl[0]);
    const minute = parseInt(spl[1]);
    const so = transformEveryDayAt(hour, minute);
    onCreated(so);
  }
  return (
    <>
      <h3 className="font-medium mb-4">{t("createSchedule")}</h3>
      <div className="space-y-2">
        <Label htmlFor={"type"}>
          {t("type")}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as ScheduleType)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder={t("selectScheduleType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={"everyDayAt"} value={"everyDayAt"}>
              {t("everyDayAt")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={"runTime"}>
          {t("runTime")}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id={"runTime"}
          placeholder={t("selectRunTime")}
          value={runTime}
          type="time"
          onChange={(e) => setRunTime(e.target.value)}
          required
        />
      </div>
      <div className="mt-4 text-center">
        <Button variant="outline"
          onClick={() => create()}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("create")}
        </Button>
      </div>

    </>
  )
}

const ScheduleSetup = ({ template, schedules, onCompleted }: ScheduleSetupProps) => {
  const { t } = useLanguage();
  const [scheOpts, setScheOptions] = useState<ScheduleOptions[]>(schedules);
  const humanScheduleOpt = humanizeScheduleOptions(scheOpts);
  const useRecommendSchedule = () => {
    setScheOptions(template.recommendSettings);
  }
  const onScheduleCreated = (opt: ScheduleOptions) => {
    setScheOptions((prv) => [...prv, opt]);
  }
  const reset = () => {
    setScheOptions([]);
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/5">
            <CardTitle>{t("scheduleSetupTitle")}</CardTitle>
            <CardDescription>{t("scheduleSetupDescription")}</CardDescription>
          </div>
          <div className="w-full md:w-3/5">
            <div className="w-100 flex justify-end gap-2">
              <Button variant="outline"
                onClick={() => useRecommendSchedule()}
              >
                <Star className="mr-2 h-4 w-4" />
                {t("useRecommendSchedule")}
              </Button>
              <Button variant="outline"
                onClick={() => reset()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {t("resetScheduleOptions")}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/5">
            <ScheduleForm onCreated={onScheduleCreated}></ScheduleForm>
          </div>
          <div className="w-full md:w-3/5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("scheduleName")}</TableHead>
                  <TableHead>{t("scheduleRunValue")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {humanScheduleOpt.map((hso) => (
                  <TableRow key={hso.type}>
                    <TableCell className="font-medium">{t(hso.type)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        {hso.value.map(v => <Badge variant="secondary">
                          {v}
                        </Badge>)
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-center">
              <Button
                variant="success"
                onClick={() => onCompleted(scheOpts)}
                disabled={scheOpts.length < 1}
              >
                <Save className="mr-2 h-4 w-4" />
                {t("save")}
              </Button>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ScheduleSetup;
