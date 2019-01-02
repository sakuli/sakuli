import {SakuliContextTestSuiteRaw} from "./test-context-entity-raw.interface";
import {Maybe} from "@sakuli/commons";

export interface TestExecutionContextRaw {
    duration: number;
    startDate: Maybe<Date>,
    endDate: Maybe<Date>,
    testSuites: SakuliContextTestSuiteRaw[]
}