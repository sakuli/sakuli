import { Region } from "./region.interface";
import { Key } from "../key.class";
import { MouseButton } from "../button.class";

export interface NewableThenableRegion {
    new(left?: number, top?: number, width?: number, height?: number): ThenableRegion;
}

export interface ThenableRegion extends PromiseLike<Region> {
    _left?: number;
    _top?: number;
    _width?: number;
    _height?: number;
    readonly _region?: Promise<Region>;

    above(range: number): ThenableRegion;

    below(range: number): ThenableRegion;

    click(): ThenableRegion;

    deleteChars(amountOfChars: number): ThenableRegion;

    doubleClick(): ThenableRegion;

    dragAndDropTo(targetRegion: Region): ThenableRegion;

    exists(imageName: string, optWaitSeconds: number): ThenableRegion;

    extractText(): ThenableRegion;

    find(imageName: string): ThenableRegion;

    findRegion(): ThenableRegion;

    getH(): Promise<number | undefined>;

    getW(): Promise<number | undefined>;

    getX(): Promise<number | undefined>;

    getY(): Promise<number | undefined>;

    grow(range: number): ThenableRegion;

    highlight(seconds: number): ThenableRegion;

    keyDown(...keys: Key[]): ThenableRegion;

    keyUp(...keys: Key[]): ThenableRegion;

    left(range: number): ThenableRegion;

    mouseDown(mouseButton: MouseButton): ThenableRegion;

    mouseMove(): ThenableRegion;

    mouseUp(mouseButton: MouseButton): ThenableRegion;

    mouseWheelDown(steps: number): ThenableRegion;

    mouseWheelUp(steps: number): ThenableRegion;

    move(offsetX: number, offsetY: number): ThenableRegion;

    paste(text: string): ThenableRegion;

    pasteAndDecrypt(text: string): ThenableRegion;

    pasteMasked(text: string): ThenableRegion;

    right(range: number): ThenableRegion;

    rightClick(): ThenableRegion;

    setH(height: number): ThenableRegion;

    setW(width: number): ThenableRegion;

    setX(x: number): ThenableRegion;

    setY(y: number): ThenableRegion;

    sleep(seconds: number): ThenableRegion;

    sleepMs(milliseconds: number): ThenableRegion;

    takeScreenshot(filename: string): Promise<string>;

    takeScreenshotWithTimestamp(filename: string): Promise<string>;

    type(text: string | Key, ...optModifiers: Key[]): ThenableRegion;

    typeAndDecrypt(text: string, ...optModifiers: Key[]): ThenableRegion;

    typeMasked(text: string | Key, ...optModifiers: Key[]): ThenableRegion;

    waitForImage(imageName: string, seconds: number): ThenableRegion;

    write(text: string): ThenableRegion;
}