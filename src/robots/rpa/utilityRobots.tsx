
import { RobotContext } from "../robotContext";
import { useContext, useMemo } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { getConnections } from "./common";
import { Robot } from "../robots";
import { RPARobotContextProvider } from "./rpaContext";
import StatusCard from "@/components/StatusCard";
import { formatSecond } from "@/common";
const baseRobots = [
  { "name": "socialMediaScraperRobot", "workerId": "7667DDC7-2C1F-441F-91D6-DCC1F8026EA4".toLowerCase(), description: "socialMediaScraperDescription" },
  { "name": "outlookBotRobot", "workerId": "B9E73B70-1B46-4AC7-8217-B6CAC9F0088F".toLowerCase(), description: "outlookBotDescription" },
  { "name": "fileSystemWatcherRobot", "workerId": "A6F7221D-E4E3-4585-BF8D-1FF64D5B5F23".toLowerCase(), description: "fileSystemWatcherDescription" }
]

export const UtilityRobots = ({ searchTerm, statusFilter, view }) => {
  console.log("UtilityRobots");
  const { registerRobot } = useContext(RobotContext);
  const { t } = useLanguage();
  // Fetch robots with React Query
  const { data: robots = [], isLoading, isError, isFetched, } = useQuery({
    queryKey: ["utilityRobots"],
    queryFn: async (): Promise<Robot[]> => {
      try {
        const connections = await getConnections();
        const robots = baseRobots.map(z => {
          const connection = connections.find(x => x.workerId === z.workerId);
          console.log(connection);
          return {
            id: z.workerId,
            name: z.name,
            status: connection && connection.state === "Executing" ? "running"
              : connection ? "idle" 
              : "offline",
            description: t(z.description),
            lastRunTime: new Date(connection.lastRunTime),
            lastResult: connection.lastRunResult,
            duration: formatSecond(connection.lastRunDuration, t) ,
            taskCount: 0,
            successCount: 0,
            pendingCount: 0,
            errorCount: 0,
            totalRunningDuration: 0,
            estimateSavingDuration: 0
          } as Robot;
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
  console.log("UtilityRobot rendered");

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-medium">{t('UtilityRobots')}</h2>
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
          <RPARobotContextProvider>
            {filteredRobots.map((rb) => (
              <StatusCard
                key={rb.name}
                robot={rb}
                showLastRunTime={true}
                className={`cursor-pointer hover:shadow-md transition-all duration-300 ${view === "list" ? "md:max-w-full" : ""}`}
              />
            ))}
          </RPARobotContextProvider>
        </div>
      )}
    </>
  )
}

export default UtilityRobots;