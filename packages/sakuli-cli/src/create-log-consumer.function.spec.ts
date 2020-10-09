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

import { LogMode, SakuliCoreProperties } from "@sakuli/core";
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
    const coreProperties = mockPartial<SakuliCoreProperties>({
      sakuliLogFolder: "/path/to/log",
      getLogMode: () => LogMode.LOG_FILE,
    });

    const logConsumerMock = jest.fn();
    createCombinedLogConsumerMock.mockImplementation(() => {
      return logConsumerMock;
    });

    //WHEN
    createLogConsumer(simpleLogger, coreProperties);

    //THEN
    expect(createFileLogConsumer).toBeCalledWith({
      path: `${coreProperties.sakuliLogFolder}/sakuli.log`,
    });
    expect(logConsumerMock).toBeCalledWith(simpleLogger);
  });

  it("should create file logger by config", () => {
    //GIVEN
    const simpleLogger = mockPartial<SimpleLogger>({});
    const coreProperties = mockPartial<SakuliCoreProperties>({
      sakuliLogFolder: "/path/to/log",
      getLogMode: () => LogMode.LOG_FILE,
    });

    const logConsumerMock = jest.fn();
    createCombinedLogConsumerMock.mockImplementation(() => {
      return logConsumerMock;
    });

    //WHEN
    createLogConsumer(simpleLogger, coreProperties);

    //THEN
    expect(createFileLogConsumer).toBeCalledWith({
      path: `${coreProperties.sakuliLogFolder}/sakuli.log`,
    });
    expect(logConsumerMock).toBeCalledWith(simpleLogger);
  });

  it("should create cli logger by config", () => {
    //GIVEN
    const simpleLogger = mockPartial<SimpleLogger>({});
    const properties = mockPartial<SakuliCoreProperties>({
      sakuliLogFolder: "/path/to/log",
      getLogMode: () => LogMode.CI,
    });

    const logConsumerMock = jest.fn();
    createCombinedLogConsumerMock.mockImplementation(() => {
      return logConsumerMock;
    });

    //WHEN
    createLogConsumer(simpleLogger, properties);

    //THEN
    expect(createFileLogConsumer).not.toBeCalled();
    expect(createCiLogConsumer).toBeCalled();
    expect(logConsumerMock).toBeCalledWith(simpleLogger);
  });
});
