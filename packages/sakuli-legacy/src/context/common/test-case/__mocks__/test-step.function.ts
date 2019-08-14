import {TestStepContext} from "@sakuli/core";

export const TestStep = (id: string, warningTime: number, criticalTime: number): TestStepContext => Object
    .assign(new TestStepContext(), {id, warningTime, criticalTime});
