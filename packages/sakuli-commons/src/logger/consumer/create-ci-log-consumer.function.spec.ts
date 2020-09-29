import { createCiLogConsumer } from "./create-ci-log-consumer.function";
import { SimpleLogger } from "../simple-logger.class";
import { mockPartial } from "sneer";
import { LogEvent } from "../log-event.interface";

global.console = mockPartial<Console>({ log: jest.fn() });

describe("create-ci-log-consumer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should subscribe ci logger on log events", () => {
    //GIVEN
    const logger = mockPartial<SimpleLogger>({
      onEvent: jest.fn(),
    });
    const logConsumer = createCiLogConsumer();

    //WHEN
    logConsumer(logger);

    //THEN
    expect(logger.onEvent).toHaveBeenCalled();
  });

  it("should log stringified log-events to console", () => {
    //GIVEN
    const ciLogConsumer = createCiLogConsumer();

    const logEvent = mockPartial<LogEvent>({ message: "test message" });
    const logger = mockPartial<SimpleLogger>({
      onEvent: jest.fn((eventConsumer) => {
        eventConsumer(logEvent);
        return () => {};
      }),
    });

    const expectedLogOutput = "mest tessage";
    const stringifier = jest.fn(() => expectedLogOutput);

    //WHEN
    ciLogConsumer(logger, stringifier);

    //THEN
    expect(stringifier).toHaveBeenCalledWith(logEvent);
    expect(console.log).toBeCalledWith(expectedLogOutput);
  });
});
