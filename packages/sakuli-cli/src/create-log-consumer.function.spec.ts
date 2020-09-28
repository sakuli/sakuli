import { SakuliCoreProperties } from "@sakuli/core";

let createCombinedLogConsumerMock = jest.fn();
let fileLogConsumerMock = jest.fn();
let createCiLogConsumerMock = jest.fn();

jest.mock("@sakuli/commons", () => {
  return {
    ...jest.requireActual("@sakuli/commons"),
    createFileLogConsumer: fileLogConsumerMock,
    createCombinedLogConsumer: createCombinedLogConsumerMock,
    createCiLogConsumer: createCiLogConsumerMock,
  };
});

import { createLogConsumer } from "./create-log-consumer.function";
import { mockPartial } from "sneer";
import {
  createCiLogConsumer,
  createFileLogConsumer,
  SimpleLogger,
} from "@sakuli/commons";

describe("create log consumer function", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create file logger by default", () => {
    //GIVEN
    const simpleLogger = mockPartial<SimpleLogger>({});
    const path = "/path/to/log/file";

    const logConsumerMock = jest.fn();
    createCombinedLogConsumerMock.mockImplementation(() => {
      return logConsumerMock;
    });

    //WHEN
    createLogConsumer(simpleLogger, path, mockPartial({}));

    //THEN
    expect(createFileLogConsumer).toBeCalledWith({ path });
    expect(logConsumerMock).toBeCalledWith(simpleLogger);
  });

  it("should create file logger by config", () => {
    //GIVEN
    const simpleLogger = mockPartial<SimpleLogger>({});
    const path = "/path/to/log/file";
    const properties = mockPartial<SakuliCoreProperties>({
      logMode: "logfile",
    });

    const logConsumerMock = jest.fn();
    createCombinedLogConsumerMock.mockImplementation(() => {
      return logConsumerMock;
    });

    //WHEN
    createLogConsumer(simpleLogger, path, properties);

    //THEN
    expect(createFileLogConsumer).toBeCalledWith({ path });
    expect(logConsumerMock).toBeCalledWith(simpleLogger);
  });

  it("should create cli logger by config", () => {
    //GIVEN
    const simpleLogger = mockPartial<SimpleLogger>({});
    const path = "/path/to/log/file";
    const properties = mockPartial<SakuliCoreProperties>({
      logMode: "ci",
    });

    const logConsumerMock = jest.fn();
    createCombinedLogConsumerMock.mockImplementation(() => {
      return logConsumerMock;
    });

    //WHEN
    createLogConsumer(simpleLogger, path, properties);

    //THEN
    expect(createFileLogConsumer).not.toBeCalledWith({ path });
    expect(createCiLogConsumer).toBeCalled();
    expect(logConsumerMock).toBeCalledWith(simpleLogger);
  });
});
