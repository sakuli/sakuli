import {MouseButton} from "./mouse-button.enum";
import {Key} from "./key.class";

export class Region {
    public find(imageName: string) {

    }

    public findRegion() {

    }

    public exists(imageName: string, optWaitSeconds: number) {

    }

    public click() {

    }

    public doubleClick() {

    }

    public rightClick() {

    }

    public mouseMove() {

    }

    public mouseDown(mouseButton: MouseButton) {

    }

    public mouseUp(mouseButton: MouseButton) {

    }

    public dragAndDropTo(targetRegion: Region) {

    }

    public waitForImage(imageName: string, seconds: number) {

    }

    public paste(text: string) {

    }

    public pasteMasked(text: string) {

    }

    public pasteAndDecrypt(text: string) {

    }

    public type(text: string, optModifiers: any) {

    }

    public typeMasked(text: string, optModifiers: any) {

    }

    public typeAndDecrypt(text: string, optModifiers: any) {

    }

    public keyDown(...keys: Key[]) {

    }

    public keyUp(...keys: Key[]) {

    }

    public write(text: string) {

    }

    public deleteChars(amountOfChars: number) {

    }

    public mouseWheelDown(steps: number) {

    }

    public mouseWheelUp(steps: number) {

    }

    public move(offsetX: number, offsetY: number) {

    }

    public grow(range: number) {

    }

    public above(range: number) {

    }

    public below(range: number) {

    }

    public left(range: number) {

    }

    public right(range: number) {

    }

    public setH(height: number) {

    }

    public getH() {

    }

    public setW(width: number) {

    }

    public getW() {

    }

    public setX(x: number) {

    }

    public getX() {

    }

    public setY(y: number) {

    }

    public getY() {

    }

    public highlight(seconds: number) {

    }

    public takeScreenshot(filename: string) {

    }

    public takeScreenshotWithTimestamp(filenamePostfix: string, optFolderPath?: string, optFormat?: string) {

    }

    public sleep(seconds: number) {

    }

    public sleepMs(milliseconds: number) {

    }

    public extractText() {

    }
}