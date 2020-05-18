import {
  TestContextEntity,
  TestContextEntityKind,
} from "./test-context-entity.class";

export class TestActionContext extends TestContextEntity {
  kind: TestContextEntityKind = "action";

  getChildren(): TestContextEntity[] {
    return [];
  }
}
