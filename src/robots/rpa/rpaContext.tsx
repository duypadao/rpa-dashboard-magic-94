import { createContext, useContext, useRef, useState, useEffect } from "react";
import { RobotContext } from "../robotContext";
import { RPA_SERVER } from "./common";
import { sleep, randomIntFromInterval } from "@/common";
const signalR = await import("@microsoft/signalr");

export const RPARobotContext = createContext<any>(null);

export const RPARobotContextProvider = ({ children }) => {
    console.log("RPARobotContextProvider");
    const { update } = useContext(RobotContext);
    const connection = useRef(null);
    const [connectionState, setConnectionState] = useState("Disconnected");
    useEffect(() => {
        console.log("LABRobotContextProvider useEffect");
        const hubUrl = `${RPA_SERVER}/rpahub?Group=WorkerCentral`;
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
            <RPARobotContext.Provider
                value={{
                    connection: connection.current,
                    update
                }}
            >
                {children}
            </RPARobotContext.Provider>
        );
    }
    return <></>;
};
