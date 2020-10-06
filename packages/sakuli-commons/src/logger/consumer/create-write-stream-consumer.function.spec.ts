import { createWriteStreamConsumer } from "./create-write-stream-consumer.function";
import { mockPartial } from "sneer";
import { SimpleLogger } from "../simple-logger.class";
import { LogEvent } from "../log-event.interface";

describe("create write stream consumer", () => {
  const sampleStringifier = (event: LogEvent) => event.message;

  it("should write to stream", () => {
    //GIVEN
    const writeStreamMock = mockPartial<NodeJS.WritableStream>({
      write: jest.fn(),
    });
    const logEventMessage = "test message";
    const logEvent = mockPartial<LogEvent>({ message: logEventMessage });
    const logger = mockPartial<SimpleLogger>({
      onEvent: jest.fn((eventConsumer) => {
        eventConsumer(logEvent);
        return () => {};
      }),
    });

    const writeStreamConsumer = createWriteStreamConsumer(writeStreamMock);

    //WHEN
    writeStreamConsumer(logger, sampleStringifier);

    //THEN
    expect(writeStreamMock.write).toBeCalledWith(logEventMessage);
  });

  it("should not write to stream if it was closed", () => {
    //GIVEN
    const writeStreamMock = mockPartial<NodeJS.WritableStream>({
      write: jest.fn(),
    });
    const logEventMessage = "test message";
    const logEvent = mockPartial<LogEvent>({ message: logEventMessage });

    let callback: (event: LogEvent) => void;
    const logger = mockPartial<SimpleLogger>({
      log: jest.fn((event) => callback(event)),
      onEvent: jest.fn((eventConsumer) => {
        callback = eventConsumer;
        return () => {};
      }),
    });

    const writeStreamConsumer = createWriteStreamConsumer(writeStreamMock);

    //WHEN
    const cleanup = writeStreamConsumer(logger, sampleStringifier);
    cleanup();
    logger.log(logEvent);

    //THEN
    expect(writeStreamMock.write).not.toBeCalled();
  });
});
