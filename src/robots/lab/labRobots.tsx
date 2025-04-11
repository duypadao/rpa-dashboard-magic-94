import { useState, useMemo, useRef, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StatusCard from "@/components/StatusCard";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Robot } from "@/types/robots";
import { useLanguage } from "@/components/LanguageProvider";
import dayjs from "dayjs";
import { formatSecond} from "@/common";
import { RobotContext } from "../robotContext";
import { LABStatusToRobotStatus, LAB_SERVER, LABAutomationTaskState, LABRobotReport } from "./common";
import { sleep, randomIntFromInterval } from "@/common";
import { ILABRobot } from "./common";
const signalR = await import("@microsoft/signalr");


const LABRobotContext = createContext<any>(null);

const LABRobotContextProvider = ({ children }) => {
  console.log("LABRobotContextProvider");
  const { update } = useContext(RobotContext);
  const connection = useRef(null);
  const [connectionState, setConnectionState] = useState("Disconnected");
  useEffect(() => {
    console.log("LABRobotContextProvider useEffect");
    const hubUrl = `${LAB_SERVER}/hub?isRobotViewer=1`;
    connection.current = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .build();

    connection.current.onclose(async () => {
      console.log("Disconnected from: " + hubUrl);
      setConnectionState("Disconnected");
      await sleep(randomIntFromInterval(1000, 20000));
      await start();
    });

    const start = async () => {
      try {
        if (connection.current._connectionState === "Disconnected") {
          await connection.current.start();
          console.log("SignalR Connected to: " + hubUrl);
          setConnectionState(connection.current._connectionState);
        }
      } catch (err) {
        console.log(err);
        await sleep(randomIntFromInterval(1000, 20000));
        await start();
      }
    };
    start();

    return () => {
      if (connectionState === "Connected") {
        connection.current.stop();
      }
    };
  }, []);

  if (connectionState === "Connected") {
    return (
      <LABRobotContext.Provider
        value={{
          connection: connection.current,
          update
        }}
      >
        {children}
      </LABRobotContext.Provider>
    );
  }
  return <></>;
};


const RobotCard = ({ robot, view }: { robot: ILABRobot, view: string }) => {
  console.log(`RobotCard ${robot.name} rendered`);
  const { t } = useLanguage();
  const { connection, update } = useContext(LABRobotContext);
  const [rb, setRobot] = useState(robot);
  const workerUpdateEventhandler = (event) => {
    if (event.data.name !== rb.name) {
      return;
    }
    console.log(`RobotCard ${robot.name} workerUpdateEventhandler`);
    let newStatus: ("running" | "idle" | "error" | "paused" | "offline") = "running";
    switch (event.action) {
      case "WorkerOnline": {
        newStatus = "idle";
        break;
      }
      case "WorkerOffline": {
        newStatus = "offline";
        break;
      }
      case "WorkerOnline": {
        newStatus = "idle";
        break;
      }
      case "WorkerStatusChanged": {
        newStatus = "running";
      }
      default: {
        break;
      }
    }
    setRobot({
      ...rb,
      status: newStatus,
      processingTask: event.data.processingTask
    })
    
    update({
      name: rb.name,
      options: {
        status: newStatus
      }
    })

  }
  const automationTaskChangeEventHandler = (automationtask) => {
    if(automationtask.workerIdentity !== rb.name){
      return;
    }
    console.log(`RobotCard ${robot.name} automationTaskChangeEventHandler`);
    let taskCount = rb.taskCount + 1;
    let successCount = rb.successCount;
    let errorCount = rb.errorCount;
    let totalRunningDuration = rb.totalRunningDuration;
    let lastResult: ("success" | "failure" | "warning") = "success";
    if (automationtask.automationTaskState === LABAutomationTaskState.SUCCESS) {
      successCount += 1;
    }
    else {
      errorCount += 1;
      lastResult = "failure";
    }
    const taskRunDuration = automationtask.operations
      .map(z => (new Date(z.endTime).getTime() - new Date(z.startTime).getTime()) / 1000)
      .reduce((a, b) => a + b, 0);
    totalRunningDuration += taskRunDuration;
    const options = {
      taskCount,
      successCount,
      errorCount,
      totalRunningDuration,
      lastResult,
      duration: formatSecond(taskRunDuration),
      lastRunTime: new Date(), //humanizeDateTime()
      estimateSavingDuration: 0
    }
    options.estimateSavingDuration = options.successCount * 90;
    setRobot({
      ...rb,
      ...options,
    })
    update({
      name: rb.name,
      options
    })

  }
  useEffect(() => {
    connection.on("WorkerUpdate", workerUpdateEventhandler);
    connection.on("AutomationTaskStateChange", automationTaskChangeEventHandler);
    return () => {
      connection.off("AutomationTaskStateChange", automationTaskChangeEventHandler);
      connection.off("WorkerUpdate", workerUpdateEventhandler);
    }
  }, [rb])
  const footer = rb.processingTask ? (
    <CardFooter className="p-4 pt-0">
      <div>
        <p>{t('currentTask')}</p>
        <p style={{ fontSize: "12px" }}>{t('limsNo')}: <span style={{ fontWeight: "bold" }}>{rb.processingTask.limsNo}</span></p>
        <p style={{ fontSize: "12px" }}>{t('automationType')}: <span style={{ fontWeight: "bold" }}>{rb.processingTask.automationType}</span></p>
      </div>
    </CardFooter>
  ) : <></>
  return (
    <StatusCard
      style={{ height: "238px" }}
      key={rb.name}
      robot={rb}
      footer={footer}
      // onClick={() => handleRobotClick(robot)}
      className={`cursor-pointer hover:shadow-md transition-all duration-300 ${view === "list" ? "md:max-w-full" : ""}`}
    />
  )
}

export const LABRobots = ({ searchTerm, statusFilter, view }) => {
  const { registerRobot } = useContext(RobotContext);
  const navigate = useNavigate();
  const { t } = useLanguage();
  // Fetch robots with React Query
  const { data: robots = [], isLoading, isError, isFetched, } = useQuery({
    queryKey: ["labRobots"],
    queryFn: async (): Promise<ILABRobot[]> => {
      const today = dayjs().format("YYYY-MM-DD")
      try {
        const robots = (await (await fetch(`${LAB_SERVER}/automation/list/robot`)).json()).map(z => ({
          name: z.name,
          id: z.name,
          status: "offline",
          lastRunTime: new Date(z.lastRunTime),
          lastResult: LABStatusToRobotStatus(z.lastRunResult),
          duration: formatSecond(z.lastRunDurationInSeconds, t),
          description: "labRobotForUploadingReport",
          taskCount: 0,
          successCount: 0,
          pendingCount: 0,
          errorCount: 0,
          totalRunningDuration: 0,
          estimateSavingDuration: 0
        } as ILABRobot));
        const reportData = (await (await fetch(`${LAB_SERVER}/automation/report?startDate=${today}&endDate=${today}`)).json()) as Array<LABRobotReport>;
        reportData.forEach(x => {
          const robot = robots.find(z => z.name === x.workerIdentity);
          if (robot) {
            robot.taskCount += x.reportCount;
            robot.successCount += x.automationTaskState == LABAutomationTaskState.SUCCESS ? x.reportCount : 0;
            robot.errorCount += x.automationTaskState == LABAutomationTaskState.ERROR ? x.reportCount : 0;
            robot.pendingCount += x.automationTaskState == LABAutomationTaskState.PENDING ? x.reportCount : 0;
            robot.totalRunningDuration += x.robotRunningDuration;
            robot.estimateSavingDuration = robot.successCount * 90;
          }
        });

        const connections = (await (await fetch(`${LAB_SERVER}/hub/connections`)).json())
        connections.forEach(con => {
          if (con.connectionUnit !== "Worker") {
            return;
          }
          const robot = robots.find(z => z.name === con.name);
          robot.status = con.processingTask ? "running" : "idle";
          robot.processingTask = con.processingTask;
        });
        return robots;
      } catch (error) {
        console.error("Error fetching robots:", error);
      }
    },
    refetchInterval: false
  });
  if (isFetched) {
    registerRobot(robots);
  }
  // Filter robots based on search term and status
  const filteredRobots = useMemo(() => {
    return robots.filter((robot) => {
      const matchesSearch = robot.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || robot.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [robots, searchTerm, statusFilter]);

  // Navigate to robot detail page
  const handleRobotClick = (robot: Robot) => {
    // Check if this is the Invoice Robot
    if (robot.id === "1") {
      navigate("/invoice");
    } else {
      // For all other robots, navigate to the robot/:id page with robot data
      navigate(`/robot/${robot.id}`, { state: { robot } });
    }
  };
  console.log("LABRobots rendered");

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-medium">{t('LABRobots')}</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 animate-pulse bg-muted rounded-lg"></div>
          ))}
        </div>
      ) : isError || !robots.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[40vh] text-center p-6">
            <h2 className="text-xl font-semibold mb-2">{t('couldNotLoadRobots')}</h2>
            <p className="text-muted-foreground">{t('tryAgainLater')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid ${view === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-4`}>
          <LABRobotContextProvider>
            {filteredRobots.map((robot) => (
              <RobotCard robot={robot} view={view} key={robot.name}>
              </RobotCard>
            ))}
          </LABRobotContextProvider>
        </div>
      )}
    </>
  )
}