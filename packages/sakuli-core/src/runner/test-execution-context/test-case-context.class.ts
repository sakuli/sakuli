import { Measurable } from "./measureable.interface";
import { IsDate, IsNumber } from "class-validator";
import { Maybe } from "@sakuli/commons";
import { TestContextEntity, TestContextEntityKind, TestContextKindCase } from "./test-context-entity.class";
import { TestStepContext } from "./test-step-context.class";

export class TestCaseContext extends TestContextEntity {
    kind: TestContextKindCase = "case";
    testSteps: TestStepContext[] = []
}