import { TestStepContext } from "@sakuli/core";

export class TestStepContextCacheMarshaller {
  constructor(private readonly delimiter: string = ";") {}

  marshall(testStep: TestStepContext) {
    return `${testStep.id}${this.delimiter}${testStep.warningTime || 0}${
      this.delimiter
    }${testStep.criticalTime || 0}`;
  }

  unMarshall(cacheEntry: string): Partial<TestStepContext> {
    const [id, warningTime, criticalTime] = cacheEntry
      .split(this.delimiter)
      .map((e) => e.trim());

    return {
      id: String(id),
      warningTime: Number(warningTime),
      criticalTime: Number(criticalTime),
    };
  }
}
