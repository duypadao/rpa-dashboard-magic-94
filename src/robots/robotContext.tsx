import { Robot } from "./robots";
import { createContext, useRef } from "react";

export interface RobotContextProps {
    getRobots: () => Array<Robot>,
    registerRobot: (arr: Array<Robot>) => void,
    getLastUpdatedTime: () => number,
    update: ({ name, options }: { name: string, options: object }) => void,
};
export const RobotContext = createContext<RobotContextProps>(null);

export const RobotContainer = ({ children }) => {
    const robots = useRef({});
    const lastUpdatedTime = useRef(new Date().getTime());
    const registerRobot = (rbs: Array<Robot>) => {
        rbs.forEach((r) => {
            robots.current[r.name] = r
        })
        lastUpdatedTime.current = new Date().getTime();
    }
    const update = ({ name, options }: { name: string, options: object }) => {
        console.log("RobotContainer Update", name, options)
        if (robots.current[name]) {
            robots.current[name] = {
                ...robots.current[name],
                ...options
            };
        }
        lastUpdatedTime.current = new Date().getTime();
    }
    const getRobots = (): Array<Robot> => { return Object.values(robots.current) }; // () : Array<Robot>
    const getLastUpdatedTime = () => { return lastUpdatedTime.current };

    return <RobotContext.Provider value={
        {
            getRobots, registerRobot, getLastUpdatedTime, update
        }
    }>
        {children}
    </RobotContext.Provider>
}