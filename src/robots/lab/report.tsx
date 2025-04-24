import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/components/LanguageProvider";
import dayjs from "dayjs";
import { round, getMondayAndSaturdayFromDate, getFirstDayAndLastDayOfMonthFromDate, getFirstDayAndLastDayOfYearFromDate, sleep, formatSecond } from "@/common";
import { ILABRobotReport, LAB_SERVER, AVG_MANUAL_TASK_DURATION, LABAutomationTaskState } from "./common";
import { Robot } from "../robots";
import { DataCard } from "@/components/DataCard";
import {
  ComposedChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
type SelectedMode = "today" | "thisWeek" | "thisMonth" | "thisYear" | "customRange";

const analyzeData = (data: ILABRobotReport[]) => {
  let robots: Array<Robot> = [];
  let totalTasks = 0;
  let successTasks = 0;
  let errorTasks = 0;
  let totalRunningDuration = 0;
  let savingDuration = 0;
  data.forEach(x => {
    let robot = robots.find(z => z.name === x.workerIdentity);
    if (!robot) {
      robot = {
        id: x.workerIdentity,
        name: x.workerIdentity,
        taskCount: 0,
        successCount: 0,
        errorCount: 0,
        totalRunningDuration: 0,
        estimateSavingDuration: 0,
      } as Robot;
      robots.push(robot);
    }
    totalTasks += x.reportCount;
    robot.taskCount += x.reportCount;

    successTasks += x.automationTaskState == LABAutomationTaskState.SUCCESS ? x.reportCount : 0;
    robot.successCount += x.automationTaskState == LABAutomationTaskState.SUCCESS ? x.reportCount : 0;

    errorTasks += x.automationTaskState == LABAutomationTaskState.ERROR ? x.reportCount : 0;
    robot.errorCount += x.automationTaskState == LABAutomationTaskState.ERROR ? x.reportCount : 0;

    totalRunningDuration += x.robotRunningDuration;
    robot.totalRunningDuration += x.robotRunningDuration;

    robot.estimateSavingDuration = robot.successCount * AVG_MANUAL_TASK_DURATION;
  });
  savingDuration = successTasks * AVG_MANUAL_TASK_DURATION;

  const successRate = totalTasks < 1 ? 0 : round(successTasks / totalTasks * 100, 2);
  const errorRate = totalTasks < 1 ? 0 : round(errorTasks / totalTasks * 100, 2);
  const workSpeed = totalRunningDuration < 1 ? 0 : round(savingDuration / totalRunningDuration * 100, 2);
  return { robots, workSpeed, successRate, errorRate, totalRobots: robots.length, totalTasks, successTasks, errorTasks, savingDuration, totalRunningDuration };
}
const Chart = ({ data }: { data: Array<Robot> }) => {
  const { t } = useLanguage()
  const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
    return <text x={x + width / 2} y={y} fill="green" textAnchor="middle" dy={-6}>{`${value}`}</text>;
  };
  const renderCustomErrorBarLabel = ({ payload, x, y, width, height, value }) => {
    return <text x={x + (`${value}`.length * 3.5) + 30} y={y} fill="red" textAnchor="middle" dy={-6}>{`${value}`}</text>;
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar name={t("error")} dataKey="errorCount" label={renderCustomErrorBarLabel} barSize={20} stackId="A" fill="red" />
        <Bar name={t("success")} dataKey="successCount" label={renderCustomBarLabel} barSize={20} stackId="A" fill="green" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

const COLORS = {
  LIMS_UploadOldReportAndReturnSample: '#0088FE',
  LIMS_UploadReportWithConclusion: '#00C49F',
  LIMS_LABCLogoStamp: '#FFBB28',
  LIMS_LABCAccessory: '#FF8042',
  LIMS_BRAReportPrintAndUpload: '#A0A002'
};
const PieChartType = ({ data }: { data: Array<ILABRobotReport> }) => {
  const { t } = useLanguage();
  const typeSummary = data.map(z => z.automationType).filter((v, i, a) => a.indexOf(v) === i)
    .map(z => {
      return {
        name: t(z),
        type: z,
        value: data.filter(v => v.automationType === z).map(v => v.reportCount).reduce((a, b) => a + b, 0)
      };

    })
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Legend align="center" verticalAlign="bottom" layout="horizontal" />
        <Pie
          data={typeSummary}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={true}
        >
          {typeSummary.map((entry, index) => {
            return (
              <Cell key={`cell-${index}`} fill={COLORS[entry.type]} />
            )
          })}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
const RobotView = ({ data, reportData }: { data: Array<Robot>, reportData: Array<ILABRobotReport> }) => {
  const [selectedRobot, setSelectedRobot] = useState(data[0]);
  const { t } = useLanguage();
  return (
    <>
      <div className="mt-8"></div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4">
        {data.map(z => <Button
          variant="outline"
          size="sm"
          key={z.name}
          className={`h-10 ${selectedRobot.name === z.name ? "bg-primary text-white" : ""}`}
          onClick={() => {
            setSelectedRobot(z);
          }}
        >
          {z.name}
        </Button>)}
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-center">{selectedRobot.name}</h1>
      <div style={{ height: "400px", width: "100%" }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xl">{t("savingTime")}:  </p>
          <p className="font-bold text-3xl text-blue-800">{formatSecond(selectedRobot.estimateSavingDuration, t)}</p>
          <p className="text-xl">{t("robotRunningTime")}: </p>
          <p className="font-bold text-3xl text-blue-800">{formatSecond(selectedRobot.totalRunningDuration, t)}</p>
          <p className="text-xl">{t("successTasks")}: <span className="font-bold text-3xl text-emerald-700">{selectedRobot.successCount}</span></p>
          <p className="text-xl">{t("errorTasks")}: <span className="font-bold text-3xl text-red-700">{selectedRobot.errorCount}</span></p>
        </div>
        <div style={{ height: "100%", width: "66%" }}>
          <PieChartType data={reportData.filter(z => z.workerIdentity === selectedRobot.name)}></PieChartType>
        </div>
      </div>
    </>

  )
}
const LABReport = () => {
  const { t } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<SelectedMode>("today");
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD")
  });
  const handleModeSelection = (mode: SelectedMode) => {
    setSelectedMode(mode);
    let startDate: string;
    let endDate: string;
    if (mode === "customRange") {
      startDate = "";
      endDate = "";
    }
    else if (mode === "today") {
      startDate = dayjs().format("YYYY-MM-DD");
      endDate = dayjs().format("YYYY-MM-DD");
    }
    else if (mode === "thisWeek") {
      const { monday, saturday } = getMondayAndSaturdayFromDate(new Date());
      startDate = dayjs(monday).format("YYYY-MM-DD");
      endDate = dayjs(saturday).format("YYYY-MM-DD");
    }
    else if (mode === "thisMonth") {
      const { firstDay, lastDay } = getFirstDayAndLastDayOfMonthFromDate(new Date());
      startDate = dayjs(firstDay).format("YYYY-MM-DD");
      endDate = dayjs(lastDay).format("YYYY-MM-DD");
    }
    else if (mode === "thisYear") {
      const { firstDay, lastDay } = getFirstDayAndLastDayOfYearFromDate(new Date());
      startDate = dayjs(firstDay).format("YYYY-MM-DD");
      endDate = dayjs(lastDay).format("YYYY-MM-DD");
    }
    setDateRange({ startDate, endDate });
  }
  const { data: reportData = [], isLoading, isError } = useQuery({
    queryKey: [dateRange.startDate, dateRange.endDate],
    queryFn: async (): Promise<ILABRobotReport[]> => {
      try {
        if (!dateRange.startDate || !dateRange.endDate 
          || dateRange.startDate < '2020-01-01' || dateRange.endDate < '2020-01-01' 
          || dateRange.startDate > dateRange.endDate) {
          return []
        }
        const reportData = (await (await fetch(`${LAB_SERVER}/automation/report?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)).json()) as Array<ILABRobotReport>;
        return reportData;
      } catch (error) {
        console.error("Error fetching robots:", error);
      }
    },
    refetchInterval: false
  });
  const buttons: Array<SelectedMode> = ["today", "thisWeek", "thisMonth", "thisYear", "customRange"];
  const { robots, workSpeed, successRate, errorRate, totalRobots, totalTasks, successTasks, errorTasks, savingDuration, totalRunningDuration } = analyzeData(reportData);

  return (
    <>
      {/* Header section with title and search controls */}
      <div className="mb-8 space-y-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{t('LABRobotReport')}</h1>
            <p className="text-muted-foreground">{t('summaryLABRobotPerformance')}</p>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4">
          {buttons.map(z => <Button
            variant="outline"
            size="sm"
            key={z}
            className={`h-10 ${selectedMode === z ? "bg-primary text-white" : ""}`}
            onClick={() => {
              handleModeSelection(z);
            }}
          >
            {t(z)}
          </Button>)}

          <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-1">
            <label>{t("startDate")}</label>
            <Input readOnly={selectedMode !== "customRange"}
              style={{ width: "200px" }}
              type="date" value={dateRange.startDate}
              onChange={(e) => {
                setDateRange({
                  ...dateRange,
                  startDate: e.target.value
                })
              }}></Input>
            <label style={{ marginLeft: "10px" }}>{t("endDate")}</label>
            <Input readOnly={selectedMode !== "customRange"}
              style={{ width: "200px" }}
              type="date" value={dateRange.endDate}
              onChange={(e) => {
                setDateRange({
                  ...dateRange,
                  endDate: e.target.value
                })
              }}></Input>
          </div>
        </div>
        <Separator />
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 animate-pulse bg-muted rounded-lg"></div>
            ))}
          </div>
        ) : isError || !reportData.length ? (
          <h1>No Data</h1>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DataCard value={formatSecond(savingDuration, t)} title={t("savingTime")}></DataCard>
              <DataCard value={formatSecond(totalRunningDuration, t)} title={t("robotRunningTime")}></DataCard>
              <DataCard value={`${workSpeed} %`} title={t("robotPerformance")} ></DataCard>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <DataCard value={totalRobots} title={t("totalRobots")}></DataCard>
              <DataCard value={totalTasks} title={t("totalTasks")}></DataCard>
              <DataCard value={successTasks} title={t("successTasks")} description2={`${t("successRate")}: ${successRate}%`}></DataCard>
              <DataCard value={errorTasks} title={t("errorTasks")} description2={`${t("errorRate")}: ${errorRate}%`}></DataCard>
            </div>

            <div style={{ height: "300px", width: "100%" }}>
              <h1 className="text-2xl font-semibold tracking-tight text-center">{t('labRobotChartTitle')}</h1>
              <Chart data={robots} />
            </div>

            <div style={{ width: "100%" }}>
              <RobotView data={robots} reportData={reportData} />
            </div>
          </>

        )}
      </div>
    </>
  );
};

export default LABReport;
