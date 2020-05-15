import { Maybe } from "@sakuli/commons";

export interface Measurable {
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
}

export interface StartedMeasurable {
  startDate: Date;
  endDate: Maybe<Date>;
}

export interface FinishedMeasurable {
  startDate: Date;
  endDate: Date;
}

export function isStarted(m: Measurable): m is StartedMeasurable {
  return !!m.startDate;
}

export function isFinished(m: StartedMeasurable): m is FinishedMeasurable {
  return !!m.endDate;
}

export function getDuration(m: FinishedMeasurable) {
  return (m.endDate.getTime() - m.startDate.getTime()) / 1000;
}
