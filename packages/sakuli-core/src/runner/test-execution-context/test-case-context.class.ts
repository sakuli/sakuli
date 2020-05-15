import { TestContextEntity, TestContextKindCase, } from "./test-context-entity.class";
import { TestStepContext } from "./test-step-context.class";

export class TestCaseContext extends TestContextEntity {
  kind: TestContextKindCase = "case";
  testSteps: TestStepContext[] = [];

  getChildren(): TestContextEntity[] {
    return this.testSteps;
  }
}
