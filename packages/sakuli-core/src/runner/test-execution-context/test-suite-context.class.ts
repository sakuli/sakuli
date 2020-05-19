import { TestCaseContext } from "./test-case-context.class";
import {
  TestContextEntity,
  TestContextKindSuite,
} from "./test-context-entity.class";

export class TestSuiteContext extends TestContextEntity {
  kind: TestContextKindSuite = "suite";
  testCases: TestCaseContext[] = [];

  getChildren(): TestContextEntity[] {
    return this.testCases;
  }
}
