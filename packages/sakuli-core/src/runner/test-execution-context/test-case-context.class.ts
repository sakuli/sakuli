import { Measurable } from "./measureable.interface";
import { IsDate, IsNumber } from "class-validator";
import { Maybe } from "@sakuli/commons";
import { TestContextEntity, TestCaseEntityKind } from "./test-context-entity.class";
import { TestStepContext } from "./test-step-context.class";

export class TestCaseContext extends TestContextEntity {
    kind: TestCaseEntityKind = "case";
    testSteps: TestStepContext[] = []
}