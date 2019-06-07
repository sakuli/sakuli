import {mouse, Point, Button as NutButton} from "@nut-tree/nut-js";
import {MouseApi} from "./mouse.function";
import {SakuliRegion} from "./__mocks__/sakuli-region.class";
import {Mouse} from "@nut-tree/nut-js/dist/lib/mouse.class";
import {Button} from "../button.class";

beforeEach(() => {
    jest.resetAllMocks();
});

describe("MouseApi", () => {
    it("should call mouse once on click", async () => {
        // GIVEN
        mouse.leftClick = jest.fn();

        // WHEN
        await MouseApi.click();

        // THEN
        expect(mouse.leftClick).toHaveBeenCalledTimes(1);
    });

    it("should call mouse twice on doubleClick", async () => {
        // GIVEN
        mouse.leftClick = jest.fn();

        // WHEN
        await MouseApi.doubleClick();

        // THEN
        expect(mouse.leftClick).toHaveBeenCalledTimes(2);
    });

    it("should call mouse once on rightClick", async () => {
        // GIVEN
        mouse.rightClick = jest.fn();

        // WHEN
        await MouseApi.rightClick();

        // THEN
        expect(mouse.rightClick).toHaveBeenCalledTimes(1);
    });

    it.each([
        [Button.LEFT, NutButton.LEFT],
        [Button.MIDDLE, NutButton.MIDDLE],
        [Button.RIGHT, NutButton.RIGHT]
    ] as Array<[Button, NutButton]>)("should press and release", async (actual: Button, expected: NutButton) => {
        // GIVEN
        mouse.pressButton = jest.fn();
        mouse.releaseButton = jest.fn();

        // WHEN
        await MouseApi.pressButton(actual);
        await MouseApi.releaseButton(actual);

        // THEN
        expect(mouse.pressButton).toHaveBeenCalledTimes(1);
        expect(mouse.pressButton).toHaveBeenCalledWith(expected);
        expect(mouse.releaseButton).toHaveBeenCalledTimes(1);
        expect(mouse.releaseButton).toHaveBeenCalledWith(expected);
    });

    it("should call mouse once on scrollUp", async () => {
        // GIVEN
        mouse.scrollUp = jest.fn();

        // WHEN
        await MouseApi.scrollUp(50);

        // THEN
        expect(mouse.scrollUp).toHaveBeenCalledTimes(1);
    });

    it("should call mouse once on scrollDown", async () => {
        // GIVEN
        mouse.scrollDown = jest.fn();

        // WHEN
        await MouseApi.scrollDown(50);

        // THEN
        expect(mouse.scrollDown).toHaveBeenCalledTimes(1);
    });

    it("should call mouse once on scrollLeft", async () => {
        // GIVEN
        mouse.scrollLeft = jest.fn();

        // WHEN
        await MouseApi.scrollLeft(50);

        // THEN
        expect(mouse.scrollLeft).toHaveBeenCalledTimes(1);
    });

    it("should call mouse once on scrollRight", async () => {
        // GIVEN
        mouse.scrollRight = jest.fn();

        // WHEN
        await MouseApi.scrollRight(50);

        // THEN
        expect(mouse.scrollRight).toHaveBeenCalledTimes(1);
    });

    it("should drag to the center of a target area", async () => {
        // GIVEN
        const source = new SakuliRegion(0, 0, 100, 100);
        const target = new Point(50, 50);
        let capturedArgument: Promise<Point[]> = Promise.resolve([]);
        mouse.drag = jest.fn((param: Promise<Point[]>): Promise<Mouse> => {
            capturedArgument = param;
            return Promise.resolve(mouse);
        });

        // WHEN
        await MouseApi.dragAndDrop(source);

        // THEN
        expect((await capturedArgument).pop()).toEqual(target);
        expect(mouse.drag).toBeCalledTimes(1);
    });

    it("should move to the center of a target area", async () => {
        // GIVEN
        const source = new SakuliRegion(0, 0, 100, 100);
        const target = new Point(50, 50);
        let capturedArgument: Promise<Point[]> = Promise.resolve([]);
        mouse.move = jest.fn((param: Promise<Point[]>): Promise<Mouse> => {
            capturedArgument = param;
            return Promise.resolve(mouse);
        });

        // WHEN
        await MouseApi.move(source);

        // THEN
        expect((await capturedArgument).pop()).toEqual(target);
        expect(mouse.move).toBeCalledTimes(1);
    });
});
