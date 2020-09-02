import { MouseButton } from "../button.class";
import { Key } from "../key.class";
import {
  createKeyboardApi,
  createMouseApi,
  runAsAction,
  ScreenApi,
} from "../actions";
import { Project, TestExecutionContext } from "@sakuli/core";

import nutConfig from "../nut-global-config.class";
import { existsSync } from "fs";
import { join } from "path";
import { Region } from "./region.interface";
import { getEncryptionKey } from "../secrets.function";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";
import {
  registerKeyboardPressKeys,
  registerKeyboardReleaseKeys,
} from "../button-registry";

const determineResourcePath = (imageName: string) => {
  for (let idx = 0; idx < nutConfig.imagePaths.length; ++idx) {
    const path = nutConfig.imagePaths[nutConfig.imagePaths.length - 1 - idx];
    if (existsSync(join(path, imageName))) {
      return path;
    }
  }
  throw new Error(
    `Failed to locate ${imageName} in directories [${nutConfig.imagePaths}]`
  );
};

export function createRegionClass(ctx: TestExecutionContext, project: Project) {
  const props = project.objectFactory(LegacyProjectProperties);
  const keyboardApi = createKeyboardApi(props);
  const mouseApi = createMouseApi(props);

  return class SakuliRegion implements Region {
    constructor(
      public _left?: number,
      public _top?: number,
      public _width?: number,
      public _height?: number
    ) {}

    public async find(imageName: string): Promise<Region> {
      return runAsAction(ctx, "find", () => {
        ctx.logger.debug(`Trying to locate image ${imageName}`);
        return new Promise<Region>(async (resolve, reject) => {
          try {
            const resourcePath = determineResourcePath(imageName);
            ctx.logger.debug(
              `Loading '${imageName}' from path '${resourcePath}'`
            );
            const result = await ScreenApi.find(
              imageName,
              resourcePath,
              nutConfig.confidence,
              this
            );
            ctx.logger.info(
              `Located at: (${result.left},${result.top},${result.width},${result.height})`
            );
            resolve(
              new SakuliRegion(
                result.left,
                result.top,
                result.width,
                result.height
              )
            );
          } catch (e) {
            ctx.logger.error(`Failed to locate ${imageName}. Reason: ${e}`);
            reject(e);
          }
        });
      })();
    }

    public async findRegion(): Promise<Region> {
      return runAsAction(ctx, "findRegion", () => this)();
    }

    public async exists(
      imageName: string,
      optWaitSeconds: number = 0
    ): Promise<Region> {
      return runAsAction(ctx, "exists", () => {
        ctx.logger.debug(`Image '${imageName} exists in region?`);
        return new Promise<Region>(async (resolve, reject) => {
          try {
            const resourcePath = determineResourcePath(imageName);
            ctx.logger.debug(
              `Loading '${imageName}' from path '${resourcePath}'`
            );
            const result = await ScreenApi.waitForImage(
              imageName,
              resourcePath,
              nutConfig.confidence,
              optWaitSeconds * 1000,
              this
            );
            ctx.logger.info(`Image exists in region`);
            resolve(
              new SakuliRegion(
                result.left,
                result.top,
                result.width,
                result.height
              )
            );
          } catch (e) {
            ctx.logger.error(`Failed to detect image in region. Reason: ${e}`);
            reject(e);
          }
        });
      })();
    }

    public async click(): Promise<Region> {
      return runAsAction(ctx, "click", async () => {
        ctx.logger.debug(`Executing native click.`);
        await this.center();
        await mouseApi.click();
        return this;
      })();
    }

    public async doubleClick(): Promise<Region> {
      return runAsAction(ctx, "doubleClick", async () => {
        ctx.logger.debug(`Executing native double click.`);
        await this.center();
        await mouseApi.doubleClick();
        return this;
      })();
    }

    public async rightClick(): Promise<Region> {
      return runAsAction(ctx, "rightClick", async () => {
        ctx.logger.debug(`Executing native right click.`);
        await this.center();
        await mouseApi.rightClick();
        return this;
      })();
    }

    public async mouseMove(): Promise<Region> {
      return runAsAction(ctx, "mouseMove", async () => {
        ctx.logger.debug(
          `Moving mouse to: (${this._left},${this._top},${this._width},${this._height})`
        );
        await this.center();
        return this;
      })();
    }

    public async mouseDown(mouseButton: MouseButton): Promise<Region> {
      return runAsAction(ctx, "mouseDown", async () => {
        ctx.logger.debug("Mouse down");
        await mouseApi.pressButton(mouseButton);
        return this;
      })();
    }

    public async mouseUp(mouseButton: MouseButton): Promise<Region> {
      return runAsAction(ctx, "mouseUp", async () => {
        ctx.logger.debug("Mouse up");
        await mouseApi.releaseButton(mouseButton);
        return this;
      })();
    }

    public async dragAndDropTo(targetRegion: Region): Promise<Region> {
      return runAsAction(ctx, "dragAndDropTo", async () => {
        ctx.logger.debug(
          `Dragging mouse to: (${await targetRegion.getX()},${await targetRegion.getY()},${await targetRegion.getW()},${await targetRegion.getH()})`
        );
        await mouseApi.dragAndDrop(targetRegion);
        return this;
      })();
    }

    public async waitForImage(
      imageName: string,
      seconds: number
    ): Promise<Region> {
      return runAsAction(ctx, "waitForImage", () => {
        ctx.logger.debug(`Waiting ${seconds} for image ${imageName}`);
        return new Promise<Region>(async (resolve, reject) => {
          try {
            const resourcePath = determineResourcePath(imageName);
            ctx.logger.debug(
              `Loading '${imageName}' from path '${resourcePath}'`
            );
            const result = await ScreenApi.waitForImage(
              imageName,
              resourcePath,
              nutConfig.confidence,
              seconds * 1000,
              this
            );
            resolve(
              new SakuliRegion(
                result.left,
                result.top,
                result.width,
                result.height
              )
            );
          } catch (e) {
            ctx.logger.error(`waitForImage failed: ${e}`);
            reject(e);
          }
        });
      })();
    }

    public async paste(text: string): Promise<Region> {
      return runAsAction(ctx, "paste", async () => {
        ctx.logger.debug(`Pasting '${text}' via native clipboard`);
        await keyboardApi.paste(text);
        return this;
      })();
    }

    public async pasteMasked(text: string): Promise<Region> {
      return runAsAction(ctx, "pasteMasked", async () => {
        ctx.logger.debug(`Pasting '****' via native clipboard`);
        await keyboardApi.paste(text);
        return this;
      })();
    }

    public async pasteAndDecrypt(text: string): Promise<Region> {
      return runAsAction(ctx, "pasteAndDecrypt", async () => {
        ctx.logger.debug(
          `Pasting encrypted text '${text}' via native clipboard`
        );
        const key = getEncryptionKey(project);
        await keyboardApi.pasteAndDecrypt(key, text);
        return this;
      })();
    }

    public async type(
      text: string | Key,
      ...optModifiers: Key[]
    ): Promise<Region> {
      return runAsAction(ctx, "type", async () => {
        ctx.logger.debug(`Typing text '${text}' via native keyboard`);
        await keyboardApi.type(text, ...optModifiers);
        return this;
      })();
    }

    public async typeMasked(
      text: string | Key,
      ...optModifiers: Key[]
    ): Promise<Region> {
      return runAsAction(ctx, "typeMasked", async () => {
        ctx.logger.debug(`Typing text '****' via native keyboard`);
        await keyboardApi.type(text, ...optModifiers);
        return this;
      })();
    }

    public async typeAndDecrypt(
      text: string,
      ...optModifiers: Key[]
    ): Promise<Region> {
      return runAsAction(ctx, "typeAndDecrypt", async () => {
        ctx.logger.debug(`Typing encrypted text '${text}' via native keyboard`);
        const key = getEncryptionKey(project);
        await keyboardApi.typeAndDecrypt(key, text, ...optModifiers);
        return this;
      })();
    }

    public async keyDown(...keys: Key[]): Promise<Region> {
      return runAsAction(ctx, "keyDown", async () => {
        ctx.logger.debug(
          `Pressing keys '${keys
            .map((key) => key)
            .join(",")}' via native keyboard`
        );
        await keyboardApi.pressKey(...keys);
        registerKeyboardPressKeys(...keys);
        return this;
      })();
    }

    public async keyUp(...keys: Key[]): Promise<Region> {
      return runAsAction(ctx, "keyUp", async () => {
        ctx.logger.debug(
          `Releasing keys '${keys
            .map((key) => key)
            .join(",")}' via native keyboard`
        );
        await keyboardApi.releaseKey(...keys);
        registerKeyboardReleaseKeys(...keys);
        return this;
      })();
    }

    public async write(text: string): Promise<Region> {
      return runAsAction(ctx, "write", async () => {
        ctx.logger.debug(`Writing text '${text}' via native keyboard`);
        await keyboardApi.type(text);
        return this;
      })();
    }

    public async deleteChars(amountOfChars: number): Promise<Region> {
      return runAsAction(ctx, "deleteChars", async () => {
        ctx.logger.debug(`Deleting ${amountOfChars} characters`);
        const keys = new Array(amountOfChars).fill(Key.BACKSPACE);
        await keyboardApi.pressKey(keys);
        return this;
      })();
    }

    public async mouseWheelDown(steps: number): Promise<Region> {
      return runAsAction(ctx, "mouseWheelDown", async () => {
        ctx.logger.debug(`Scrolling down ${steps} steps`);
        await mouseApi.scrollDown(steps);
        return this;
      })();
    }

    public async mouseWheelUp(steps: number): Promise<Region> {
      return runAsAction(ctx, "mouseWheelUp", async () => {
        ctx.logger.debug(`Scrolling up ${steps} steps`);
        await mouseApi.scrollUp(steps);
        return this;
      })();
    }

    public async move(offsetX: number, offsetY: number): Promise<Region> {
      return runAsAction(ctx, "move", async () => {
        const region = new SakuliRegion(
          (this._left || 0) + offsetX,
          (this._top || 0) + offsetY,
          this._width,
          this._height
        );
        ctx.logger.debug(`Moved region. New dimensions: ${region.toString()}`);
        return region;
      })();
    }

    public async grow(range: number): Promise<Region> {
      return runAsAction(ctx, "grow", async () => {
        const region = new SakuliRegion(
          (this._left || 0) - range,
          (this._top || 0) - range,
          (this._width || 0) + 2 * range,
          (this._height || 0) + 2 * range
        );
        ctx.logger.debug(`Grew region. New dimensions: ${region.toString()}`);
        return region;
      })();
    }

    public async above(range: number): Promise<Region> {
      return runAsAction(ctx, "above", async () => {
        const region = new SakuliRegion(
          this._left,
          (this._top || 0) - range,
          this._width,
          range
        );
        ctx.logger.debug(
          `Created new region above. New dimensions: ${region.toString()}`
        );
        return region;
      })();
    }

    public async below(range: number): Promise<Region> {
      return runAsAction(ctx, "below", async () => {
        const region = new SakuliRegion(
          this._left,
          (this._top || 0) + (this._height || 0),
          this._width,
          range
        );
        ctx.logger.debug(
          `Created new region below. New dimensions: ${region.toString()}`
        );
        return region;
      })();
    }

    public async left(range: number): Promise<Region> {
      return runAsAction(ctx, "left", async () => {
        const region = new SakuliRegion(
          (this._left || 0) - range,
          this._top,
          range,
          this._height
        );
        ctx.logger.debug(
          `Created new region to the left. New dimensions: ${region.toString()}`
        );
        return region;
      })();
    }

    public async right(range: number): Promise<Region> {
      return runAsAction(ctx, "right", async () => {
        const region = new SakuliRegion(
          (this._left || 0) + (this._width || 0),
          this._top,
          range,
          this._height
        );
        ctx.logger.debug(
          `Created new region to the right. New dimensions: ${region.toString()}`
        );
        return region;
      })();
    }

    public async setH(height: number): Promise<Region> {
      this._height = height;
      return this;
    }

    public async getH(): Promise<number | undefined> {
      return this._height;
    }

    public async setW(width: number): Promise<Region> {
      this._width = width;
      return this;
    }

    public async getW(): Promise<number | undefined> {
      return this._width;
    }

    public async setX(x: number): Promise<Region> {
      this._left = x;
      return this;
    }

    public async getX(): Promise<number | undefined> {
      return this._left;
    }

    public async setY(y: number): Promise<Region> {
      this._top = y;
      return this;
    }

    public async getY(): Promise<number | undefined> {
      return this._top;
    }

    public async highlight(seconds: number): Promise<Region> {
      return runAsAction(ctx, "highlight", () => {
        ctx.logger.debug(`Highlighting for ${seconds} seconds`);
        return ScreenApi.highlight(this, seconds);
      })();
    }

    public async takeScreenshot(filename: string): Promise<string> {
      return runAsAction(ctx, "takeScreenshot", () => {
        ctx.logger.debug(`Taking screenshot with filename '${filename}'`);
        return ScreenApi.takeScreenshot(filename);
      })();
    }

    public async takeScreenshotWithTimestamp(
      filename: string
    ): Promise<string> {
      return runAsAction(ctx, "takeScreenshotWithTimestamp", () => {
        ctx.logger.debug(
          `Taking screenshot with filename '${filename}' and timestamp`
        );
        return ScreenApi.takeScreenshotWithTimestamp(filename);
      })();
    }

    public async sleep(seconds: number): Promise<Region> {
      return runAsAction(ctx, "sleep", () => {
        ctx.logger.debug(`Sleeping for ${seconds} seconds`);
        return new Promise<Region>((resolve) =>
          setTimeout(() => resolve(this), seconds * 1000)
        );
      })();
    }

    public async sleepMs(milliseconds: number): Promise<Region> {
      return runAsAction(ctx, "sleepMs", () => {
        ctx.logger.debug(`Sleeping for ${milliseconds} milliseconds`);
        return new Promise<Region>((resolve) =>
          setTimeout(() => resolve(this), milliseconds)
        );
      })();
    }

    public async extractText(): Promise<Region> {
      throw new Error("Not Implemented");
    }

    public async center() {
      await this.moveTo();
    }

    public async moveTo(dest?: Region) {
      const target = dest ? dest : this;
      await mouseApi.move(target);
    }

    public toString(): string {
      return `(${this._left},${this._top},${this._width},${this._height})`;
    }
  };
}
