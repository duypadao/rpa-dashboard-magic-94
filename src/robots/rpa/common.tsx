const RPA_SERVER = "http://ros:5089";

export interface RobotConnection {
    "workerId": "da51542c-7dc8-4b44-b134-a2a711b84055",
    "baseType": 0,
    "connectionId": "OgpFcQYcj3mbBsVyMYOovQ",
    "connectionUnit": "WorkerGroup",
    "state": "Executing",
    "name": "CutMachineMonitors",
    "version": "1.0.0.99",
    "device": "GERBER-FACTA-10",
    "nextRunTime": null,
    "lastRunResult": null,
    "lastRunDuration": number,
    "lastRunTime": "2025-04-16T16:33:02.653272+07:00",
    "exception": null,
    "entity": null,
    "jsonData": null,
    "groups": [
        "WorkerCentral",
        "VNA|BLK-A1"
    ]
}

const getConnections = async () => {
    return (await (await fetch(`${RPA_SERVER}/Hub/GetWorkers`)).json()) as RobotConnection[]
}

export { RPA_SERVER, getConnections }