import { TestContextEntity, TestContextEntityKind } from "./test-context-entity.class";
import { TestActionContext } from "./test-action-context.class";

export class TestStepContext extends TestContextEntity {
    kind: TestContextEntityKind = 'step';
    testActions: TestActionContext[] = []
}