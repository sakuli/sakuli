let createCombinedLogConsumerMock = jest.fn();
let fileLogConsumerMock = jest.fn();
let createCiLogConsumerMock = jest.fn();

jest.mock("@sakuli/commons", () => {
  const originalModule = jest.requireActual("@sakuli/commons");

  return {
    __esModule: true,
    ...originalModule,
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

  it("should create cli and file logger on log mode ci", () => {
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
    expect(createFileLogConsumer).toBeCalledWith({
      path: `${properties.sakuliLogFolder}/sakuli.log`,
    });
    expect(createCiLogConsumer).toBeCalled();
    expect(logConsumerMock).toBeCalledWith(simpleLogger);
  });
});
