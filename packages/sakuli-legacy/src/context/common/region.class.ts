import {Button} from "./button.class";
import {Key} from "./key.class";
import {keyboard, Key as NutKey, mouse,} from "@nut-tree/nut-js";
import {MouseApi} from "./actions/mouse.functions";
import {KeyboardApi} from "./actions/keyboard.functions";
import {ScreenApi} from "./actions/screen.functions";

export class Region {
    constructor(private _left?: number, private _top?: number, private _width?: number, private _height?: number) {
    }

    public async find(imageName: string): Promise<Region> {
        return ScreenApi.find(imageName, 0.99, this);
    }

    public async findRegion(): Promise<Region> {
        return this;
    }

    public async exists(imageName: string, optWaitSeconds: number): Promise<Region> {
        return this;
    }

    public async click(): Promise<Region> {
        await this.center();
        await mouse.leftClick();
        return this;
    }

    public async doubleClick(): Promise<Region> {
        await this.center();
        await mouse.leftClick();
        await mouse.leftClick();
        return this;
    }

    public async rightClick(): Promise<Region> {
        await this.center();
        await mouse.rightClick();
        return this;
    }

    public async mouseMove(): Promise<Region> {
        await MouseApi.move(this);
        return this;
    }

    public async mouseDown(mouseButton: Button): Promise<Region> {
        return this;
    }

    public async mouseUp(mouseButton: Button): Promise<Region> {
        return this;
    }

    public async dragAndDropTo(targetRegion: Region): Promise<Region> {
        await MouseApi.dragAndDrop(targetRegion);
        return this;
    }

    public async waitForImage(imageName: string, seconds: number): Promise<Region> {
        return new Promise<Region>(resolve => setTimeout(() => {
            resolve(ScreenApi.find(imageName, 0.99, this));
        }, seconds * 1000));
    }

    public async paste(text: string): Promise<Region> {
        await KeyboardApi.paste(text);
        return this;
    }

    public async pasteMasked(text: string): Promise<Region> {
        // TODO Do not log text
        return this.paste(text);
    }

    public async pasteAndDecrypt(text: string): Promise<Region> {
        await KeyboardApi.pasteAndDecrypt(text);
        return this;
    }

    public async type(text: string, ...optModifiers: Key[]): Promise<Region> {
        await KeyboardApi.type(text, ...optModifiers as NutKey[]);
        return this;
    }

    public async typeMasked(text: string, ...optModifiers: Key[]): Promise<Region> {
        // TODO Do not log text
        return this.paste(text);
    }

    public async typeAndDecrypt(text: string, ...optModifiers: Key[]): Promise<Region> {
        await KeyboardApi.typeAndDecrypt(text, ...optModifiers as NutKey[]);
        return this;
    }

    public async keyDown(...keys: Key[]): Promise<Region> {
        await KeyboardApi.pressKey(...keys as NutKey[]);
        return this;
    }

    public async keyUp(...keys: Key[]): Promise<Region> {
        await KeyboardApi.releaseKey(...keys as NutKey[]);
        return this;
    }

    public async write(text: string): Promise<Region> {
        await keyboard.type(text);
        return this;
    }

    public async deleteChars(amountOfChars: number): Promise<Region> {
        const keys = new Array(amountOfChars).fill(Key.BACKSPACE);
        await keyboard.type(...keys as NutKey[]);
        return this;
    }

    public async mouseWheelDown(steps: number): Promise<Region> {
        await MouseApi.scrollDown(steps);
        return this;
    }

    public async mouseWheelUp(steps: number): Promise<Region> {
        await MouseApi.scrollUp(steps);
        return this;
    }

    public async move(offsetX: number, offsetY: number): Promise<Region> {
        return this;
    }

    public async grow(range: number): Promise<Region> {
        return this;
    }

    public async above(range: number): Promise<Region> {
        return this;
    }

    public async below(range: number): Promise<Region> {
        return this;
    }

    public async left(range: number): Promise<Region> {
        return this;
    }

    public async right(range: number): Promise<Region> {
        return this;
    }

    public async setH(height: number): Promise<Region> {
        this._height = height;
        return this;
    }

    public async getH(): Promise<number> {
        if (this._height) {
            return Promise.resolve(this._height);
        }
        return await ScreenApi.width();
    }

    public async setW(width: number): Promise<Region> {
        this._width = width;
        return this;
    }

    public async getW(): Promise<number> {
        if (this._width) {
            return Promise.resolve(this._width);
        }
        return await ScreenApi.width();
    }

    public async setX(x: number): Promise<Region> {
        this._left = x;
        return this;
    }

    public async getX(): Promise<number> {
        if (this._left) {
            return Promise.resolve(this._left);
        }
        return 0;
    }

    public async setY(y: number): Promise<Region> {
        this._top = y;
        return this;
    }

    public async getY(): Promise<number> {
        if (this._top) {
            return Promise.resolve(this._top);
        }
        return 0;
    }

    public async highlight(seconds: number): Promise<Region> {
        // TODO
        return this;
    }

    public async takeScreenshot(filename: string): Promise<Region> {
        return this;
    }

    public async takeScreenshotWithTimestamp(filenamePostfix: string, optFolderPath?: string, optFormat?: string): Promise<Region> {
        return this;
    }

    public async sleep(seconds: number): Promise<Region> {
        return this;
    }

    public async sleepMs(milliseconds: number): Promise<Region> {
        return this;
    }

    public async extractText(): Promise<Region> {
        // TODO
        return this;
    }

    private async center() {
        await this.moveTo();
    }

    private async moveTo(dest?: Region) {
        const target = dest ? dest : this;
        await MouseApi.move(target);
    }
}