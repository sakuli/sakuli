import { TestContextEntityState } from "./test-context-entity-state.class";
import { Maybe } from "@sakuli/commons/dist";
import { TestSuiteContext } from "./test-suite-context.class";
import { TestContextEntity } from "./test-context-entity.class";
import { TestCaseContext } from "./test-case-context.class";
import { TestStepContext } from "./test-step-context.class";

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
    testCases: SakuliContextTestCaseRaw[]
}

export interface SakuliContextTestCaseRaw extends SakuliContextEntityRaw {
    testSteps: SakuliContextTestStepRaw[]
}

export interface SakuliContextTestStepRaw extends SakuliContextEntityRaw {
    testActions: SakuliContextTestActionRaw[]
}

export interface SakuliContextTestActionRaw extends SakuliContextEntityRaw {    
}