import {mockPartial} from "sneer";
import {TestExecutionContext} from "@sakuli/core";
import {SimpleLogger} from "@sakuli/commons";

export function createTestExecutionContextMock() {
    return mockPartial<TestExecutionContext>({
        startTestAction: jest.fn(),
        endTestAction: jest.fn(),
        getCurrentTestAction: jest.fn(),
        logger: mockPartial<SimpleLogger>({
            info: jest.fn(),
            log: jest.fn()
        })
    });
}