import { TestContextEntityState } from "./test-context-entity-state.class";
import { Maybe } from "@sakuli/commons/dist";

export interface SakuliContextEntityRaw {
  id: string;
  state: TestContextEntityState;
  startDate: Date;
  endDate: Date;
  criticalTime: number;
  warningTime: number;
  error: Maybe<Error>;
}

export interface SakuliContextTestSuiteRaw extends SakuliContextEntityRaw {
  testCases: SakuliContextTestCaseRaw[];
}

export interface SakuliContextTestCaseRaw extends SakuliContextEntityRaw {
  testSteps: SakuliContextTestStepRaw[];
}

export interface SakuliContextTestStepRaw extends SakuliContextEntityRaw {
  testActions: SakuliContextTestActionRaw[];
}

export interface SakuliContextTestActionRaw extends SakuliContextEntityRaw {}
