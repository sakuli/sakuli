import {Button} from "./button.class";
import {Key} from "./key.class";
import {Key as NutKey, keyboard, mouse,} from "@nut-tree/nut-js";
import {MouseApi} from "./actions/mouse.functions";
import {KeyboardApi} from "./actions/keyboard.functions";
import {ScreenApi} from "./actions/screen.functions";
import {TestExecutionContext} from "@sakuli/core";

export function createRegionClass(ctx: TestExecutionContext) {
    return class LoggingRegion extends Region {
        constructor(public _left?: number, public _top?: number, public _width?: number, public _height?: number) {
            super(_left, _top, _width, _height);
        }

        public async find(imageName: string): Promise<LoggingRegion> {
            ctx.logger.info(`Trying to locate image ${imageName}`);
            return new Promise<LoggingRegion>(async (resolve, reject) => {
                try {
                    const result = await super.find(imageName);
                    ctx.logger.info(`Located at: (${result._left},${result._top},${result._width},${result._height})`);
                    resolve(result as LoggingRegion);
                } catch (e) {
                    ctx.logger.error(e);
                    reject(e);
                }
            });
        }

        public async findRegion(): Promise<LoggingRegion> {
            return this;
        }

        public async exists(imageName: string, optWaitSeconds: number): Promise<LoggingRegion> {
            return this;
        }

        public async click(): Promise<LoggingRegion> {
            ctx.logger.info(`Executing native click.`);
            await super.click();
            return this;
        }

        public async doubleClick(): Promise<LoggingRegion> {
            ctx.logger.info(`Executing native double click.`);
            await super.doubleClick();
            return this;
        }

        public async rightClick(): Promise<LoggingRegion> {
            ctx.logger.info(`Executing native right click.`);
            await super.rightClick();
            return this;
        }

        public async mouseMove(): Promise<LoggingRegion> {
            ctx.logger.info(`Moving mouse to: (${this._left},${this._top},${this._width},${this._height}`);
            await super.mouseMove();
            return this;
        }

        public async mouseDown(mouseButton: Button): Promise<LoggingRegion> {
            return this;
        }

        public async mouseUp(mouseButton: Button): Promise<LoggingRegion> {
            return this;
        }

        public async dragAndDropTo(targetRegion: LoggingRegion): Promise<LoggingRegion> {
            ctx.logger.info(`Dragging mouse to: (${targetRegion._left},${targetRegion._top},${targetRegion._width},${targetRegion._height}`);
            await super.dragAndDropTo(targetRegion);
            return this;
        }

        public async waitForImage(imageName: string, seconds: number): Promise<LoggingRegion> {
            ctx.logger.info(`Waiting ${seconds} for image ${imageName}`);
            return new Promise<LoggingRegion>(resolve => setTimeout(() => {
                resolve(ScreenApi.find(imageName, 0.99, this));
            }, seconds * 1000));
        }

        public async paste(text: string): Promise<LoggingRegion> {
            ctx.logger.info(`Pasting '${text}' via native clipboard`);
            await super.paste(text);
            return this;
        }

        public async pasteMasked(text: string): Promise<LoggingRegion> {
            ctx.logger.info(`Pasting '****' via native clipboard`);
            await super.paste(text);
            return this;
        }

        public async pasteAndDecrypt(text: string): Promise<LoggingRegion> {
            ctx.logger.info(`Pasting encrypted text '${text}' via native clipboard`);
            await super.pasteAndDecrypt(text);
            return this;
        }

        public async type(text: string, ...optModifiers: Key[]): Promise<LoggingRegion> {
            ctx.logger.info(`Typing '${text}' via native keyboard`);
            await super.type(text, ...optModifiers);
            return this;
        }

        public async typeMasked(text: string, ...optModifiers: Key[]): Promise<LoggingRegion> {
            ctx.logger.info(`Typing '****' via native keyboard`);
            await super.type(text, ...optModifiers);
            return this;
        }

        public async typeAndDecrypt(text: string, ...optModifiers: Key[]): Promise<LoggingRegion> {
            ctx.logger.info(`Typing encrypted text '${text}' via native keyboard`);
            await super.typeAndDecrypt(text, ...optModifiers);
            return this;
        }

        public async keyDown(...keys: Key[]): Promise<LoggingRegion> {
            ctx.logger.info(`Pressing keys '${keys.map(key => key).join(",")}' via native keyboard`);
            await super.keyDown(...keys);
            return this;
        }

        public async keyUp(...keys: Key[]): Promise<LoggingRegion> {
            ctx.logger.info(`Releasing keys '${keys.map(key => key).join(",")}' via native keyboard`);
            await super.keyUp(...keys);
            return this;
        }

        public async write(text: string): Promise<LoggingRegion> {
            ctx.logger.info(`Writing text '${text}' via native keyboard`);
            await super.write(text);
            return this;
        }

        public async deleteChars(amountOfChars: number): Promise<LoggingRegion> {
            ctx.logger.info(`Deleting ${amountOfChars} characters`);
            await super.deleteChars(amountOfChars);
            return this;
        }

        public async mouseWheelDown(steps: number): Promise<LoggingRegion> {
            ctx.logger.info(`Scrolling down ${steps} steps`);
            await super.mouseWheelDown(steps);
            return this;
        }

        public async mouseWheelUp(steps: number): Promise<LoggingRegion> {
            ctx.logger.info(`Scrolling up ${steps} steps`);
            await super.mouseWheelUp(steps);
            return this;
        }

        public async move(offsetX: number, offsetY: number): Promise<LoggingRegion> {
            return this;
        }

        public async grow(range: number): Promise<LoggingRegion> {
            return this;
        }

        public async above(range: number): Promise<LoggingRegion> {
            return this;
        }

        public async below(range: number): Promise<LoggingRegion> {
            return this;
        }

        public async left(range: number): Promise<LoggingRegion> {
            return this;
        }

        public async right(range: number): Promise<LoggingRegion> {
            return this;
        }

        public async setH(height: number): Promise<LoggingRegion> {
            this._height = height;
            return this;
        }

        public async getH(): Promise<number | undefined> {
            return Promise.resolve(this._height);
        }

        public async setW(width: number): Promise<LoggingRegion> {
            this._width = width;
            return this;
        }

        public async getW(): Promise<number | undefined> {
            return Promise.resolve(this._width);
        }

        public async setX(x: number): Promise<LoggingRegion> {
            this._left = x;
            return this;
        }

        public async getX(): Promise<number | undefined> {
            return Promise.resolve(this._left);
        }

        public async setY(y: number): Promise<LoggingRegion> {
            this._top = y;
            return this;
        }

        public async getY(): Promise<number | undefined> {
            return Promise.resolve(this._top);
        }

        public async highlight(seconds: number): Promise<LoggingRegion> {
            // TODO
            return this;
        }

        public async takeScreenshot(filename: string): Promise<LoggingRegion> {
            return this;
        }

        public async takeScreenshotWithTimestamp(filenamePostfix: string, optFolderPath?: string, optFormat?: string): Promise<LoggingRegion> {
            return this;
        }

        public async sleep(seconds: number): Promise<LoggingRegion> {
            return this;
        }

        public async sleepMs(milliseconds: number): Promise<LoggingRegion> {
            return this;
        }

        public async extractText(): Promise<LoggingRegion> {
            // TODO
            return this;
        }
    }

}

export class Region {
    constructor(public _left?: number, public _top?: number, public _width?: number, public _height?: number) {
    }

    public async find(imageName: string): Promise<Region> {
        return new Promise<Region>(async (resolve, reject) => {
            try {
                resolve(ScreenApi.find(imageName, 0.99, this));
            } catch (e) {
                reject(e);
            }
        });
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

    public async getH(): Promise<number | undefined> {
        return Promise.resolve(this._height);
    }

    public async setW(width: number): Promise<Region> {
        this._width = width;
        return this;
    }

    public async getW(): Promise<number | undefined> {
        return Promise.resolve(this._width);
    }

    public async setX(x: number): Promise<Region> {
        this._left = x;
        return this;
    }

    public async getX(): Promise<number | undefined> {
        return Promise.resolve(this._left);
    }

    public async setY(y: number): Promise<Region> {
        this._top = y;
        return this;
    }

    public async getY(): Promise<number | undefined> {
        return Promise.resolve(this._top);
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

    public async center() {
        await this.moveTo();
    }

    public async moveTo(dest?: Region) {
        const target = dest ? dest : this;
        await MouseApi.move(target);
    }
}