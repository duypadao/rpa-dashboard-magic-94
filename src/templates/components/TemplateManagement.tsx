
import { FC, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart4, CheckCircle, Clock, PlaySquare, XCircle } from "lucide-react";
import { myTemplates } from "../data/myTemplates";


export const TemplateManagement = () => {
  const [templates, setTemplates] = useState(myTemplates);
  const language = "en";
  // Translations for UI elements
  const translations = {
    templatesList: {
      en: "My Templates",
      vi: "Mẫu của Tôi",
      zh: "我的模板"
    },
    stats: {
      en: "Statistics",
      vi: "Thống kê",
      zh: "数据统计"
    },
    templateListTitle: {
      en: "RPA Template List",
      vi: "Danh Sách Mẫu RPA",
      zh: "RPA 模板列表"
    },
    templateListDesc: {
      en: "Manage all your automation templates",
      vi: "Quản lý tất cả các mẫu tự động hóa của bạn",
      zh: "管理您创建的所有自动化模板"
    },
    name: {
      en: "Name",
      vi: "Tên",
      zh: "名称"
    },
    status: {
      en: "Status",
      vi: "Trạng thái",
      zh: "状态"
    },
    executions: {
      en: "Executions",
      vi: "Số lần thực hiện",
      zh: "执行次数"
    },
    successRate: {
      en: "Success Rate",
      vi: "Tỷ lệ thành công",
      zh: "成功率"
    },
    lastRun: {
      en: "Last Run",
      vi: "Lần chạy cuối",
      zh: "最后运行时间"
    },
    enableDisable: {
      en: "Enable/Disable",
      vi: "Bật/Tắt",
      zh: "启用/停用"
    },
    executionStats: {
      en: "Execution Statistics",
      vi: "Thống Kê Thực Hiện",
      zh: "执行统计"
    },
    totalExecutions: {
      en: "Total Executions",
      vi: "Tổng số lần thực hiện",
      zh: "总执行次数"
    },
    successCount: {
      en: "Success Count",
      vi: "Số lần thành công",
      zh: "成功次数"
    },
    failureCount: {
      en: "Failure Count",
      vi: "Số lần thất bại",
      zh: "失败次数"
    },
    timeStats: {
      en: "Time Statistics",
      vi: "Thống Kê Thời Gian",
      zh: "时间统计"
    },
    timeSaved: {
      en: "Time Saved (est.)",
      vi: "Thời gian tiết kiệm (ước tính)",
      zh: "节省时间 (估计)"
    },
    avgExecTime: {
      en: "Average Execution Time",
      vi: "Thời gian thực hiện trung bình",
      zh: "平均执行时间"
    },
    maxExecTime: {
      en: "Maximum Execution Time",
      vi: "Thời gian thực hiện tối đa",
      zh: "最长执行时间"
    },
    hours: {
      en: "hours",
      vi: "giờ", 
      zh: "小时"
    },
    minutes: {
      en: "minutes",
      vi: "phút",
      zh: "分钟"
    }
  };

  const toggleTemplateStatus = (id: string) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === id
          ? { ...template, active: !template.active }
          : template
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "成功":
      case "Success":
      case "Thành công":
        return "text-green-500";
      case "失败":
      case "Failed":
      case "Thất bại":
        return "text-red-500";
      case "运行中":
      case "Running":
      case "Đang chạy":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "成功":
      case "Success":
      case "Thành công":
        return <CheckCircle className="h-4 w-4" />;
      case "失败":
      case "Failed":
      case "Thất bại":
        return <XCircle className="h-4 w-4" />;
      case "运行中":
      case "Running":
      case "Đang chạy":
        return <PlaySquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="templates">
        <TabsList className="mb-6">
          <TabsTrigger value="templates">{translations.templatesList[language]}</TabsTrigger>
          <TabsTrigger value="stats">{translations.stats[language]}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>{translations.templateListTitle[language]}</CardTitle>
              <CardDescription>{translations.templateListDesc[language]}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{translations.name[language]}</TableHead>
                    <TableHead>{translations.status[language]}</TableHead>
                    <TableHead>{translations.executions[language]}</TableHead>
                    <TableHead>{translations.successRate[language]}</TableHead>
                    <TableHead>{translations.lastRun[language]}</TableHead>
                    <TableHead>{translations.enableDisable[language]}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name[language]}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className={getStatusColor(template.status[language])}>
                            {getStatusIcon(template.status[language])}
                          </span>
                          <span>{template.status[language]}</span>
                        </div>
                      </TableCell>
                      <TableCell>{template.executionCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={template.successRate} className="w-20" />
                          <span>{template.successRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {template.lastRun[language]}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={template.active}
                          onCheckedChange={() => toggleTemplateStatus(template.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PlaySquare className="h-5 w-5 text-primary" />
                  {translations.executionStats[language]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{translations.totalExecutions[language]}</span>
                      <span className="text-sm font-semibold">186</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{translations.successCount[language]}</span>
                      <span className="text-sm font-semibold">162</span>
                    </div>
                    <Progress value={87} className="h-2 bg-muted" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{translations.failureCount[language]}</span>
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
                  {translations.timeStats[language]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{translations.timeSaved[language]}</span>
                    <Badge>23.5 {translations.hours[language]}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{translations.avgExecTime[language]}</span>
                    <Badge variant="outline">2.3 {translations.minutes[language]}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{translations.maxExecTime[language]}</span>
                    <Badge variant="outline">8.7 {translations.minutes[language]}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
