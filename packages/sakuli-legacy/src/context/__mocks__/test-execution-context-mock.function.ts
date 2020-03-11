import { mockPartial } from "sneer";
import { TestExecutionContext } from "@sakuli/core";
import { SimpleLogger } from "@sakuli/commons";

export function createTestExecutionContextMock() {
    return mockPartial<TestExecutionContext>({
        startTestSuite: jest.fn(),
        startTestCase: jest.fn(),
        startTestAction: jest.fn(),
        endTestAction: jest.fn(),
        getCurrentTestAction: jest.fn(),
        updateCurrentTestAction: jest.fn(),
        endTestSuite: jest.fn(),
        getCurrentTestCase: jest.fn(),
        updateCurrentTestCase: jest.fn(),
        logger: mockPartial<SimpleLogger>({
            info: jest.fn(),
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            trace: jest.fn()
        })
    });
}
