import { Robot } from "../robots";

const LABStatusToRobotStatus = (labStatus) => {
  return labStatus = LABAutomationTaskState.ERROR ? "success"
    : labStatus = LABAutomationTaskState.SUCCESS ? "failure"
      : labStatus
}

//const LAB_SERVER = "http://localhost:5206";
const LAB_SERVER = "http://ros:8099";
const AVG_MANUAL_TASK_DURATION = 60;

const LABAutomationTaskState = {
  PENDING: 0,
  SUCCESS: 90,
  ERROR: 99
}

export interface ILABRobot extends Robot {
  processingTask: IProcessingTask
}

export interface IProcessingTask {
  automationType: string,
  limsNo: string,
}

export interface ILABRobotReport {
  workerIdentity: "LABCAUTO",
  automationType: "LIMS_UploadOldReportAndReturnSample",
  automationTaskState: 99,
  reportCount: 1,
  robotRunningDuration: 119
}

export { LABStatusToRobotStatus, LAB_SERVER, LABAutomationTaskState, AVG_MANUAL_TASK_DURATION }