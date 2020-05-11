export type TestContextEntityStateOk = 0;
export type TestContextEntityStateWarning = 1;
export type TestContextEntityStateCritical = 2;
export type TestContextEntityStateUnknown = 3;
export type TestContextEntityStateError = 4;
export type TestContextEntityState =
  | TestContextEntityStateOk
  | TestContextEntityStateWarning
  | TestContextEntityStateCritical
  | TestContextEntityStateUnknown
  | TestContextEntityStateError;

export class TestContextEntityStates {
  static readonly OK: TestContextEntityStateOk = 0;
  static readonly WARNING: TestContextEntityStateWarning = 1;
  static readonly CRITICAL: TestContextEntityStateCritical = 2;
  static readonly UNKNOWN: TestContextEntityStateUnknown = 3;
  static readonly ERROR: TestContextEntityStateError = 4;
}

export function getReadableStateName(state: TestContextEntityState): string {
  function keys<T>(o: T): (keyof T)[] {
    return Object.keys(o) as (keyof T)[];
  }
  return (
    keys(TestContextEntityStates).find(
      (key) => TestContextEntityStates[key] === state
    ) || ""
  );
}
