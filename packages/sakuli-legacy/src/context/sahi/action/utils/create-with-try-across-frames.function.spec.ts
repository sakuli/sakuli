import {createWithTryAcrossFrames} from "./create-with-try-across-frames.function"
import {error as SeleniumErrors, TargetLocator, ThenableWebDriver} from "selenium-webdriver"
import {mockPartial} from "sneer";
import {TestExecutionContext} from "@sakuli/core";
import {createTestExecutionContextMock} from "../../../__mocks__";

describe('createTryAcrossFrames', () => {

    let driverMock: ThenableWebDriver;
    let targetLocatorMock: TargetLocator;
    let frameLocatorMock: jest.Mock;
    let defaultContentLocatorMock: jest.Mock;
    let findElementsMock: jest.Mock;
    let action: jest.Mock;
    let actionResult = Symbol('action-success');
    let pseudoFrames = [
        Symbol('frame1'),
        Symbol('frame2'),
        Symbol('frame3'),
    ];
    let contextMock: TestExecutionContext;
    let withTryAcrossFrames: <ARGS extends any[], R>(fn: (...args: ARGS) => Promise<R>) => ((...args: ARGS) => Promise<R>);

    beforeEach(async () => {
        action = jest.fn().mockResolvedValue(actionResult);
        frameLocatorMock = jest.fn().mockResolvedValue(void 0);
        defaultContentLocatorMock = jest.fn().mockResolvedValue(void 0);
        findElementsMock = jest.fn().mockResolvedValue([]);
        targetLocatorMock = mockPartial<TargetLocator>({
            frame: frameLocatorMock,
            defaultContent: defaultContentLocatorMock
        });
        contextMock = createTestExecutionContextMock();

        driverMock = mockPartial<ThenableWebDriver>({
            findElements: findElementsMock,
            switchTo: jest.fn().mockReturnValue(targetLocatorMock)
        });

        withTryAcrossFrames = createWithTryAcrossFrames(driverMock, contextMock);
    });

    it('should not invoke frame switches on instant success', async () => {
        findElementsMock.mockResolvedValueOnce(pseudoFrames);
        const actionAcrossFrames = withTryAcrossFrames(action);
        await expect(actionAcrossFrames(1, 2, 3)).resolves.toBe(actionResult);
        expect(frameLocatorMock).toHaveBeenCalledTimes(0);
        expect(defaultContentLocatorMock).toHaveBeenCalledTimes(0);
        expect(action).toHaveBeenCalledTimes(1);

    });

    it('should try an action in each frame until success', async () => {
        action.mockRejectedValueOnce("Error in default");
        action.mockRejectedValueOnce("Error in frame 0");
        findElementsMock.mockResolvedValueOnce(pseudoFrames);
        const actionAcrossFrames = withTryAcrossFrames(action);

        await expect(actionAcrossFrames(1, 2, 3)).resolves.toBe(actionResult);
        expect(frameLocatorMock).toHaveBeenCalledTimes(2);
        expect(frameLocatorMock).toHaveBeenNthCalledWith(1, pseudoFrames[0]);
        expect(frameLocatorMock).toHaveBeenNthCalledWith(2, pseudoFrames[1]);
        expect(defaultContentLocatorMock).toHaveBeenCalledTimes(2);
        expect(action).toHaveBeenCalledTimes(3);
    });

    it('should rethrow latest error when failing in every frame', async () => {
        action.mockRejectedValueOnce("Error in default");
        action.mockRejectedValueOnce("Error in frame 0");
        action.mockRejectedValueOnce("Error in frame 1");
        action.mockRejectedValueOnce("Error in frame 2");
        findElementsMock.mockResolvedValueOnce(pseudoFrames);

        const actionAcrossFrames = withTryAcrossFrames(action);
        await expect(actionAcrossFrames(1, 2, 3)).rejects.toEqual("Error in frame 2");

        expect(frameLocatorMock).toHaveBeenCalledTimes(3);
        expect(frameLocatorMock).toHaveBeenNthCalledWith(1, pseudoFrames[0]);
        expect(frameLocatorMock).toHaveBeenNthCalledWith(2, pseudoFrames[1]);
        expect(frameLocatorMock).toHaveBeenNthCalledWith(3, pseudoFrames[2]);
        expect(defaultContentLocatorMock).toHaveBeenCalledTimes(3);
        expect(action).toHaveBeenCalledTimes(4);
    });

    it('should throw initial error if only TimeoutErrors follow', async () => {
        action.mockRejectedValueOnce("Error in default");
        action.mockRejectedValueOnce(new SeleniumErrors.TimeoutError("Error in frame 0"));
        action.mockRejectedValueOnce(new SeleniumErrors.TimeoutError("Error in frame 1"));
        action.mockRejectedValueOnce(new SeleniumErrors.TimeoutError("Error in frame 2"));
        findElementsMock.mockResolvedValueOnce(pseudoFrames);

        const actionAcrossFrames = withTryAcrossFrames(action);
        await expect(actionAcrossFrames(1, 2, 3)).rejects.toEqual("Error in default");

        expect(frameLocatorMock).toHaveBeenCalledTimes(3);
        expect(frameLocatorMock).toHaveBeenNthCalledWith(1, pseudoFrames[0]);
        expect(frameLocatorMock).toHaveBeenNthCalledWith(2, pseudoFrames[1]);
        expect(frameLocatorMock).toHaveBeenNthCalledWith(3, pseudoFrames[2]);
        expect(defaultContentLocatorMock).toHaveBeenCalledTimes(3);
        expect(action).toHaveBeenCalledTimes(4);
    });

    it('should error history if a non TimeoutError follows', async () => {
        action.mockRejectedValueOnce("Error in default");
        action.mockRejectedValueOnce(new SeleniumErrors.TimeoutError("Error in frame 0"));
        action.mockRejectedValueOnce("Error in frame 1");
        action.mockRejectedValueOnce(new SeleniumErrors.TimeoutError("Error in frame 2"));
        findElementsMock.mockResolvedValueOnce(pseudoFrames);

        const actionAcrossFrames = withTryAcrossFrames(action);
        await expect(actionAcrossFrames(1, 2, 3)).rejects.toEqual("Error in frame 1");

        expect(frameLocatorMock).toHaveBeenCalledTimes(3);
        expect(frameLocatorMock).toHaveBeenNthCalledWith(1, pseudoFrames[0]);
        expect(frameLocatorMock).toHaveBeenNthCalledWith(2, pseudoFrames[1]);
        expect(frameLocatorMock).toHaveBeenNthCalledWith(3, pseudoFrames[2]);
        expect(defaultContentLocatorMock).toHaveBeenCalledTimes(3);
        expect(action).toHaveBeenCalledTimes(4);
    });
});
