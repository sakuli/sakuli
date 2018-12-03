import { IsString, IsDate, IsNumber } from "class-validator";
import { Maybe } from "@sakuli/commons";
import { Measurable } from "./measureable.interface";
import { TestCaseContext } from "./test-case-context.class";
import { TestContextEntity, TestContextEntityKind, TestContextKindSuite } from "./test-context-entity.class";

export class TestSuiteContext extends TestContextEntity {
    kind: TestContextKindSuite = 'suite';
    testCases: TestCaseContext[] = [];
}
