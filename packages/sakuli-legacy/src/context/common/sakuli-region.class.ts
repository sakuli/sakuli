import {Button} from "./button.class";
import {Key} from "./key.class";
import {MouseApi} from "./actions/mouse.function";
import {KeyboardApi} from "./actions/keyboard.function";
import {ScreenApi} from "./actions/screen.function";
import {TestExecutionContext} from "@sakuli/core";

import nutConfig from "./nut-global-config.class";
import {existsSync} from "fs";
import {join} from "path";
import {Region} from "./region.interface";

const determineResourcePath = (imageName: string) => {
    for (let idx = 0; idx < nutConfig.imagePaths.length; ++idx) {
        const path = nutConfig.imagePaths[(nutConfig.imagePaths.length - 1) - idx];
        if (existsSync(join(path, imageName))) {
            return path;
        }
    }
    throw new Error(`Failed to locate ${imageName} in directories [${nutConfig.imagePaths}]`);
};

export function createRegionClass(ctx: TestExecutionContext) {
    return class SakuliRegion implements Region {
        constructor(public _left?: number, public _top?: number, public _width?: number, public _height?: number) {
        }

        public async find(imageName: string): Promise<Region> {
            ctx.logger.info(`Trying to locate image ${imageName}`);
            return new Promise<Region>(async (resolve, reject) => {
                try {
                    const resourcePath = determineResourcePath(imageName);
                    ctx.logger.info(`Loading '${imageName}' from path '${resourcePath}'`);
                    const result = await ScreenApi.find(imageName, resourcePath, nutConfig.confidence, this);
                    ctx.logger.info(`Located at: (${result.left},${result.top},${result.width},${result.height})`);
                    resolve(new SakuliRegion(result.left, result.top, result.width, result.height));
                } catch (e) {
                    ctx.logger.info(`Failed to locate ${imageName}. Reason: ${e}`);
                    reject(e);
                }
            });
        }

        public async findRegion(): Promise<Region> {
            return Promise.resolve(this);
        }

        public async exists(imageName: string, optWaitSeconds: number = 0): Promise<Region> {
            ctx.logger.info(`Image '${imageName} exists in region?`);
            return new Promise<Region>(async (resolve, reject) => {
                try {
                    const resourcePath = determineResourcePath(imageName);
                    ctx.logger.info(`Loading '${imageName}' from path '${resourcePath}'`);
                    const result = await ScreenApi.waitForImage(imageName, resourcePath, nutConfig.confidence, optWaitSeconds * 1000, this);
                    resolve(new SakuliRegion(result.left, result.top, result.width, result.height));
                } catch (e) {
                    ctx.logger.error(e);
                    reject(e);
                }
            });
        }

        public async click(): Promise<Region> {
            ctx.logger.info(`Executing native click.`);
            await this.center();
            await MouseApi.click();
            return this;
        }

        public async doubleClick(): Promise<Region> {
            ctx.logger.info(`Executing native double click.`);
            await this.center();
            await MouseApi.doubleClick();
            return this;
        }

        public async rightClick(): Promise<Region> {
            ctx.logger.info(`Executing native right click.`);
            await this.center();
            await MouseApi.rightClick();
            return this;
        }

        public async mouseMove(): Promise<Region> {
            ctx.logger.info(`Moving mouse to: (${this._left},${this._top},${this._width},${this._height})`);
            await this.center();
            return this;
        }

        public async mouseDown(mouseButton: Button): Promise<Region> {
            ctx.logger.info("Mouse down, NOP");
            return this;
        }

        public async mouseUp(mouseButton: Button): Promise<Region> {
            ctx.logger.info("Mouse up, NOP");
            return this;
        }

        public async dragAndDropTo(targetRegion: Region): Promise<Region> {
            ctx.logger.info(`Dragging mouse to: (${await targetRegion.getX()},${await targetRegion.getY()},${await targetRegion.getW()},${await targetRegion.getH()})`);
            await MouseApi.dragAndDrop(targetRegion);
            return this;
        }

        public async waitForImage(imageName: string, seconds: number): Promise<Region> {
            ctx.logger.info(`Waiting ${seconds} for image ${imageName}`);
            return new Promise<Region>(async (resolve, reject) => {
                try {
                    const resourcePath = determineResourcePath(imageName);
                    ctx.logger.info(`Loading '${imageName}' from path '${resourcePath}'`);
                    const result = await ScreenApi.waitForImage(imageName, resourcePath, nutConfig.confidence, seconds * 1000, this);
                    resolve(new SakuliRegion(result.left, result.top, result.width, result.height));
                } catch (e) {
                    ctx.logger.error(`waitForImage failed: ${e}`);
                    reject(e);
                }
            });
        }

        public async paste(text: string): Promise<Region> {
            ctx.logger.info(`Pasting '${text}' via native clipboard`);
            await KeyboardApi.paste(text);
            return this;
        }

        public async pasteMasked(text: string): Promise<Region> {
            ctx.logger.info(`Pasting '****' via native clipboard`);
            await KeyboardApi.paste(text);
            return this;
        }

        public async pasteAndDecrypt(text: string): Promise<Region> {
            ctx.logger.info(`Pasting encrypted text '${text}' via native clipboard`);
            await KeyboardApi.pasteAndDecrypt(text);
            return this;
        }

        public async type(text: string, ...optModifiers: Key[]): Promise<Region> {
            ctx.logger.info(`Typing text '${text}' via native keyboard`);
            await KeyboardApi.type(text, ...optModifiers);
            return this;
        }

        public async typeMasked(text: string, ...optModifiers: Key[]): Promise<Region> {
            ctx.logger.info(`Typing text '****' via native keyboard`);
            await KeyboardApi.type(text, ...optModifiers);
            return this;
        }

        public async typeAndDecrypt(text: string, ...optModifiers: Key[]): Promise<Region> {
            ctx.logger.info(`Typing encrypted text '${text}' via native keyboard`);
            await KeyboardApi.typeAndDecrypt(text, ...optModifiers);
            return this;
        }

        public async keyDown(...keys: Key[]): Promise<Region> {
            ctx.logger.info(`Pressing keys '${keys.map(key => key).join(",")}' via native keyboard`);
            await KeyboardApi.pressKey(...keys);
            return this;
        }

        public async keyUp(...keys: Key[]): Promise<Region> {
            ctx.logger.info(`Releasing keys '${keys.map(key => key).join(",")}' via native keyboard`);
            await KeyboardApi.releaseKey(...keys);
            return this;
        }

        public async write(text: string): Promise<Region> {
            ctx.logger.info(`Writing text '${text}' via native keyboard`);
            await KeyboardApi.type(text);
            return this;
        }

        public async deleteChars(amountOfChars: number): Promise<Region> {
            ctx.logger.info(`Deleting ${amountOfChars} characters`);
            const keys = new Array(amountOfChars).fill(Key.BACKSPACE);
            await KeyboardApi.pressKey(keys);
            return this;
        }

        public async mouseWheelDown(steps: number): Promise<Region> {
            ctx.logger.info(`Scrolling down ${steps} steps`);
            await MouseApi.scrollDown(steps);
            return this;
        }

        public async mouseWheelUp(steps: number): Promise<Region> {
            ctx.logger.info(`Scrolling up ${steps} steps`);
            await MouseApi.scrollUp(steps);
            return this;
        }

        public async move(offsetX: number, offsetY: number): Promise<Region> {
            const region = new SakuliRegion((this._left || 0) + offsetX, (this._top || 0) + offsetY, this._width, this._height);
            ctx.logger.info(`Moved region. New dimensions: ${region.toString()}`);
            return region;
        }

        public async grow(range: number): Promise<Region> {
            const region = new SakuliRegion((this._left || 0) - range, (this._top || 0) - range, (this._width || 0) + range, (this._height || 0) + range);
            ctx.logger.info(`Grew region. New dimensions: ${region.toString()}`);
            return region;
        }

        public async above(range: number): Promise<Region> {
            const region = new SakuliRegion(this._left, (this._top || 0) - range, this._width, range);
            ctx.logger.info(`Created new region above. New dimensions: ${region.toString()}`);
            return region;
        }

        public async below(range: number): Promise<Region> {
            const region = new SakuliRegion(this._left, (this._top || 0) + (this._height || 0), this._width, range);
            ctx.logger.info(`Created new region below. New dimensions: ${region.toString()}`);
            return region;
        }

        public async left(range: number): Promise<Region> {
            const region = new SakuliRegion((this._left || 0) - range, this._top, range, this._height);
            ctx.logger.info(`Created new region to the left. New dimensions: ${region.toString()}`);
            return region;
        }

        public async right(range: number): Promise<Region> {
            const region = new SakuliRegion((this._left || 0) + (this._width || 0), this._top, range, this._height);
            ctx.logger.info(`Created new region to the right. New dimensions: ${region.toString()}`);
            return region;
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
            throw new Error("Not Implemented");
        }

        public async takeScreenshot(filename: string): Promise<string> {
            ctx.logger.info(`Taking screenshot with filename '${filename}'`);
            return ScreenApi.takeScreenshot(filename);
        }

        public async takeScreenshotWithTimestamp(filename: string): Promise<string> {
            ctx.logger.info(`Taking screenshot with filename '${filename}' and timestamp`);
            return ScreenApi.takeScreenshotWithTimestamp(filename);
        }

        public async sleep(seconds: number): Promise<Region> {
            ctx.logger.info(`Sleeping for ${seconds} seconds`);
            return new Promise<Region>(resolve => setTimeout(() => resolve(this), seconds * 1000));
        }

        public async sleepMs(milliseconds: number): Promise<Region> {
            ctx.logger.info(`Sleeping for ${milliseconds} milliseconds`);
            return new Promise<Region>(resolve => setTimeout(() => resolve(this), milliseconds));
        }

        public async extractText(): Promise<Region> {
            throw new Error("Not Implemented");
        }

        public async center() {
            await this.moveTo();
        }

        public async moveTo(dest?: Region) {
            const target = dest ? dest : this;
            await MouseApi.move(target);
        }

        public toString(): string {
            return `(${this._left},${this._top},${this._width},${this._height})`;
        }
    }
}
