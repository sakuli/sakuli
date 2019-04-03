import {mouse, Point} from "@nut-tree/nut-js";
import {MouseApi} from "./mouse.function";
import {Region} from "../region.class";

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
        const source = new Region(0, 0, 100, 100);
        const target = new Point(50, 50);
        let capturedArgument: Promise<number[]> = Promise.resolve([]);
        mouse.drag = jest.fn((param: Promise<number[]>) => {
            capturedArgument = param;
        });

        // WHEN
        await MouseApi.dragAndDrop(source);

        // THEN
        expect((await capturedArgument).pop()).toEqual(target);
        expect(mouse.drag).toBeCalledTimes(1);
    });

    it("should move to the center of a target area", async () => {
        // GIVEN
        const source = new Region(0, 0, 100, 100);
        const target = new Point(50, 50);
        let capturedArgument: Promise<number[]> = Promise.resolve([]);
        mouse.move = jest.fn((param: Promise<number[]>) => {
            capturedArgument = param;
        });

        // WHEN
        await MouseApi.move(source);

        // THEN
        expect((await capturedArgument).pop()).toEqual(target);
        expect(mouse.move).toBeCalledTimes(1);
    });
});