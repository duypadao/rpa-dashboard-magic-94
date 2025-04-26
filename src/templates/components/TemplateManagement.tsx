
import { FC, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart4, CheckCircle, Clock, Clock10, PlaySquare, WatchIcon, XCircle } from "lucide-react";
import { myTemplates } from "../data/myTemplates";
import { useLanguage } from "@/components/LanguageProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Template } from "../data/templates";
import { useAxios } from "@/axios/AxiosProvider";
import { humanizeDateTime } from "@/common";
import dayjs from "dayjs";
import { humanizeScheduleOptions, ScheduleOptions } from "../data/scheduleOptions";


interface AutomationOverview {
  id: number,
  description: string,
  status: "success" | "failure" | "running" | "notRun",
  executionCount: number,
  successRate: number,
  lastRun: string,
  isActive: boolean,
  schedules: ScheduleOptions[]
}
const AUTOMATION_SERVER = "http://ros:5089";
export const TemplateManagement = () => {
  const { t } = useLanguage();
  const axios = useAxios();
  axios.defaults.withCredentials = true;
  const { data: automation = [], isLoading, isError, isFetched } = useQuery({
    queryKey: ["myTemplate"],
    queryFn: async (): Promise<AutomationOverview[]> => {
      const { data } = await axios.get(`${AUTOMATION_SERVER}/automation/getUserAutomation`,{
        withCredentials: true,
        headers: {
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      });
      return data as AutomationOverview[]
    },
    refetchInterval: false
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number, isActive: boolean }) => {
      const { data } = await axios.postForm(`${AUTOMATION_SERVER}/automation/setActive`, {
        id, isActive
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["myTemplate"], (current: AutomationOverview[]) => {
        const itemIndex = current.findIndex(z => z.id === data.id);
        current[itemIndex].isActive = data.isActive;
        return current;
      })
    }
  })
  const toggleTemplateStatus = async (id: number, isActive: boolean) => {
    await mutation.mutateAsync({
      id, isActive
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-500";
      case "failure":
        return "text-red-500";
      case "running":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "failure":
        return <XCircle className="h-4 w-4" />;
      case "running":
        return <PlaySquare className="h-4 w-4" />;
      default:
        return <Clock10 className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full">
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("executionCount")}</TableHead>
                <TableHead>{t("successRate")}</TableHead>
                <TableHead>{t("lastRun")}</TableHead>
                <TableHead>{t("enableDisable")}</TableHead>
                <TableHead>{t("schedule")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automation.map((at) => (
                <TableRow key={at.id}>
                  <TableCell className="font-medium">{at.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className={getStatusColor(at.status)}>
                        {getStatusIcon(at.status)}
                      </span>
                      <span>{t(at.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{at.executionCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={at.successRate} className="w-20" />
                      <span>{at.successRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {(at.lastRun ? humanizeDateTime(new Date(at.lastRun), t) : "")}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={at.isActive}
                      onCheckedChange={() => toggleTemplateStatus(at.id, !at.isActive)}
                    />
                  </TableCell>
                  <TableCell>
                    {humanizeScheduleOptions(at.schedules).map(z => 
                    <div key={`schedule${at.id}`} className="flex justify-start gap-2 flex-wrap">
                      <p className="font-semibold">{t(z.type)}</p>
                      <div className="flex gap-2 flex-wrap">
                        {z.value.map(v => <Badge key={`scheduleValue${v}`} variant="secondary">
                          {v}
                        </Badge>)
                        }
                      </div>
                    </div>)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* <Tabs defaultValue="templates">
        <TabsList className="mb-6">
          <TabsTrigger value="templates">{t("templatesList")}</TabsTrigger>
          <TabsTrigger value="stats">{t("stats")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates">

        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PlaySquare className="h-5 w-5 text-primary" />
                  {t("executionStats")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{t("totalExecutions")}</span>
                      <span className="text-sm font-semibold">186</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{t("successCount")}</span>
                      <span className="text-sm font-semibold">162</span>
                    </div>
                    <Progress value={87} className="h-2 bg-muted" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{t("failureCount")}</span>
                      <span className="text-sm font-semibold">24</span>
                    </div>
                    <Progress value={13} className="h-2 bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart4 className="h-5 w-5 text-primary" />
                  {t("timeStats")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t("timeSaved")}</span>
                    <Badge>23.5 {t("hours")}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t("avgExecTime")}</span>
                    <Badge variant="outline">2.3 {t("minutes")}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t("maxExecTime")}</span>
                    <Badge variant="outline">8.7 {t("minutes")}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs> */}
    </div>
  );
};
