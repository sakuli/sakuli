import {Key} from "../../key.class";
import {MouseButton} from "../../button.class";
import {Region} from "../../region";

export class SakuliRegion implements Region {
    constructor(private _left: number, private _top: number, private _width: number, private _height: number) {

    }

    async above(range: number): Promise<Region> {
        return this;
    }

    async below(range: number): Promise<Region> {
        return this;
    }

    async click(): Promise<Region> {
        return this;
    }

    async deleteChars(amountOfChars: number): Promise<Region> {
        return this;
    }

    async doubleClick(): Promise<Region> {
        return this;
    }

    async dragAndDropTo(targetRegion: Region): Promise<Region> {
        return this;
    }

    async exists(imageName: string, optWaitSeconds: number): Promise<Region> {
        return this;
    }

    async extractText(): Promise<Region> {
        return this;
    }

    async find(imageName: string): Promise<Region> {
        return this;
    }

    async findRegion(): Promise<Region> {
        return this;
    }

    async getH(): Promise<number | undefined> {
        return this._height;
    }

    async getW(): Promise<number | undefined> {
        return this._width;
    }

    async getX(): Promise<number | undefined> {
        return this._left;
    }

    async getY(): Promise<number | undefined> {
        return this._top;
    }

    async grow(range: number): Promise<Region> {
        return this;
    }

    async highlight(seconds: number): Promise<Region> {
        return this;
    }

    async keyDown(...keys: Key[]): Promise<Region> {
        return this;
    }

    async keyUp(...keys: Key[]): Promise<Region> {
        return this;
    }

    async left(range: number): Promise<Region> {
        return this;
    }

    async mouseDown(mouseButton: MouseButton): Promise<Region> {
        return this;
    }

    async mouseMove(): Promise<Region> {
        return this;
    }

    async mouseUp(mouseButton: MouseButton): Promise<Region> {
        return this;
    }

    async mouseWheelDown(steps: number): Promise<Region> {
        return this;
    }

    async mouseWheelUp(steps: number): Promise<Region> {
        return this;
    }

    async move(offsetX: number, offsetY: number): Promise<Region> {
        return this;
    }

    async paste(text: string): Promise<Region> {
        return this;
    }

    async pasteAndDecrypt(text: string): Promise<Region> {
        return this;
    }

    async pasteMasked(text: string): Promise<Region> {
        return this;
    }

    async right(range: number): Promise<Region> {
        return this;
    }

    async rightClick(): Promise<Region> {
        return this;
    }

    async setH(height: number): Promise<Region> {
        return this;
    }

    async setW(width: number): Promise<Region> {
        return this;
    }

    async setX(x: number): Promise<Region> {
        return this;
    }

    async setY(y: number): Promise<Region> {
        return this;
    }

    async sleep(seconds: number): Promise<Region> {
        return this;
    }

    async sleepMs(milliseconds: number): Promise<Region> {
        return this;
    }

    async takeScreenshot(filename: string): Promise<string> {
        return "";
    }

    async takeScreenshotWithTimestamp(filename: string): Promise<string> {
        return "";
    }

    async type(text: string, ...optModifiers: Key[]): Promise<Region> {
        return this;
    }

    async typeAndDecrypt(text: string, ...optModifiers: Key[]): Promise<Region> {
        return this;
    }

    async typeMasked(text: string, ...optModifiers: Key[]): Promise<Region> {
        return this;
    }

    async waitForImage(imageName: string, seconds: number): Promise<Region> {
        return this;
    }

    async write(text: string): Promise<Region> {
        return this;
    }
}