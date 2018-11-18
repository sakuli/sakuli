import { TestContextEntity, TestCaseEntityKind } from "./test-context-entity.class";

export class TestStepContext extends TestContextEntity {
    kind: TestCaseEntityKind = 'step';
}