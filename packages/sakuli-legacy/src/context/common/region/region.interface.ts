import {MouseButton} from "../button.class";
import {Key} from "../key.class";

export interface Region {
    find(imageName: string): Promise<Region>;

    findRegion(): Promise<Region>;

    exists(imageName: string, optWaitSeconds: number): Promise<Region>;

    click(): Promise<Region>;

    doubleClick(): Promise<Region>;

    rightClick(): Promise<Region>;

    mouseMove(): Promise<Region>;

    mouseDown(mouseButton: MouseButton): Promise<Region>;

    mouseUp(mouseButton: MouseButton): Promise<Region>;

    dragAndDropTo(targetRegion: Region): Promise<Region>;

    waitForImage(imageName: string, seconds: number): Promise<Region>;

    paste(text: string): Promise<Region>;

    pasteMasked(text: string): Promise<Region>;

    pasteAndDecrypt(text: string): Promise<Region>;

    type(text: string, ...optModifiers: Key[]): Promise<Region>;

    typeMasked(text: string, ...optModifiers: Key[]): Promise<Region>;

    typeAndDecrypt(text: string, ...optModifiers: Key[]): Promise<Region>;

    keyDown(...keys: Key[]): Promise<Region>;

    keyUp(...keys: Key[]): Promise<Region>;

    write(text: string): Promise<Region>;

    deleteChars(amountOfChars: number): Promise<Region>;

    mouseWheelDown(steps: number): Promise<Region>;

    mouseWheelUp(steps: number): Promise<Region>;

    move(offsetX: number, offsetY: number): Promise<Region>;

    grow(range: number): Promise<Region>;

    above(range: number): Promise<Region>;

    below(range: number): Promise<Region>;

    left(range: number): Promise<Region>;

    right(range: number): Promise<Region>;

    setH(height: number): Promise<Region>;

    getH(): Promise<number | undefined>;

    setW(width: number): Promise<Region>;

    getW(): Promise<number | undefined>;

    setX(x: number): Promise<Region>;

    getX(): Promise<number | undefined>;

    setY(y: number): Promise<Region>;

    getY(): Promise<number | undefined>;

    highlight(seconds: number): Promise<Region>;

    takeScreenshot(filename: string): Promise<string>;

    takeScreenshotWithTimestamp(filename: string): Promise<string>;

    sleep(seconds: number): Promise<Region>;

    sleepMs(milliseconds: number): Promise<Region>;

    extractText(): Promise<Region>;
}