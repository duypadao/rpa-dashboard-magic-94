
export type ScheduleType = "everyDayAt";

export type RepeatType = "None" | "Monthly" | "Daily" | "Hourly" | "Weekly" | "EveryXMinutes";
export interface ScheduleOptions {
  id: number,
  automationID: number,
  saveNextRunTime: Date,
  year: number,
  month: number,
  day: number,
  dayOfWeek: number,
  hour: number,
  minute: number,
  repeatType: RepeatType,
  startDateTime: Date,
  endDateTime: Date,
  minuteInterval: number
}

export interface ShortenScheduleOptions {
  value: string,
  type: ScheduleType,
}

export interface HumanizeScheduleOptions {
  type: ScheduleType,
  value: string[]
}


const transformEveryDayAt = (hour: number, minute: number) => {
  return {
    id: 0,
    automationID: 0,
    saveNextRunTime: new Date(),
    year: 0,
    month: 0,
    day: 0,
    dayOfWeek: 0,
    repeatType: "Daily",
    hour: hour,
    minute: minute,
    startDateTime: new Date("2000-01-01"),
    endDateTime: new Date("2050-01-01"),
    minuteInterval: 0
  } as ScheduleOptions
}

const simpleScheduleOptions = (so: ScheduleOptions) => {
  if (so.repeatType === "Daily") {
    return {
      type: "everyDayAt",
      value: `${so.hour.toString().padStart(2, "0")}:${so.minute.toString().padStart(2, "0")}`
    } as ShortenScheduleOptions
  }
}

const humanizeScheduleOptions = (sos: ScheduleOptions[]) => {
  const simpleSO = sos.map(z => simpleScheduleOptions(z));
  const types = simpleSO.map(z => z.type).filter((v, i, a) => a.indexOf(v) === i);
  return types.map((t) => {
    return {
      type: t,
      value: simpleSO.filter(z => z.type === t).map(z => z.value)
    } as HumanizeScheduleOptions
  })
}


export { transformEveryDayAt, humanizeScheduleOptions, simpleScheduleOptions };