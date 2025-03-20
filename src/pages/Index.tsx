
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import StatusCard from "@/components/StatusCard";
import { apiService } from "@/services/api";

const Index = () => {
  const navigate = useNavigate();
  
  // Fetch robots with React Query
  const { data: robots = [], isLoading, isError } = useQuery({
    queryKey: ["robots"],
    queryFn: apiService.getRobots,
  });

  // Navigate to robot detail page
  const handleRobotClick = (robotId: string) => {
    // Check if this is the Invoice Robot
    if (robotId === "1") {
      navigate("/invoice");
    } else {
      // For all other robots, navigate to the robot/:id page
      navigate(`/robot/${robotId}`);
    }
  };

  const getContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse bg-muted rounded-lg"></div>
          ))}
        </div>
      );
    }

    if (isError || !robots.length) {
      return (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center">
          <h2 className="text-xl font-semibold mb-2">Could not load robots</h2>
          <p className="text-muted-foreground">Please try again later or contact support if the issue persists.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {robots.map((robot) => (
          <StatusCard 
            key={robot.id} 
            robot={robot} 
            onClick={() => handleRobotClick(robot.id)}
            className="cursor-pointer"
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Robot Status Overview</h1>
        <p className="text-muted-foreground">Monitor all RPA robots and their current status.</p>
      </div>
      {getContent()}
    </Layout>
  );
};

export default Index;
