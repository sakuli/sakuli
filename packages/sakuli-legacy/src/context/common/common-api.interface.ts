import { Type } from "@sakuli/commons";
import { TestCase } from "./test-case";
import { ThenableApplication } from "./application";
import { Key } from "./key.class";
import { MouseButton } from "./button.class";
import { ThenableEnvironment } from "./environment";
import { ThenableRegion } from "./region";
import { Logger } from "./logger";

export interface CommonApi {
  TestCase: Type<TestCase>;
  Application: Type<ThenableApplication>;
  Key: typeof Key;
  MouseButton: typeof MouseButton;
  Environment: Type<ThenableEnvironment>;
  Region: Type<ThenableRegion>;
  Logger: Logger;
}
