import {Region as NutRegion, screen} from "@nut-tree/nut-js";
import {FileType} from "@nut-tree/nut-js/dist/lib/file-type.enum";
import {parse} from "path";
import {cwd} from "process";
import {Region} from "../region";

const getCoordinates = async (region: Region) => {
    return ({
        left: await region.getX() || 0,
        top: await region.getY() || 0,
        width: await region.getW() || await screen.width(),
        height: await region.getH() || await screen.height(),
    })
};

/**
 * getTimezoneOffset returns the timezone offset to UTC in milliseconds
 */
const getTimezoneOffset = (): number => {
    return new Date().getTimezoneOffset() * 60_000;
};

/**
 * getTimestamp returns the local time in format YYYY-MM-ddTHH:mm:ss
 * @param when Timestamp in milliseconds
 * @param offset Timezone offset in milliseconds
 */
export const getTimestamp = (when: number = Date.now(), offset: number = 0): string => {
    const timestamp = new Date(when - offset).toISOString();
    const sliceIndex = timestamp.indexOf('.');
    return (sliceIndex > -1) ? timestamp.slice(0, sliceIndex) : timestamp;
};

export type SearchResult = {left: number, top: number, width: number, height: number};

export const ScreenApi = {
    async find(filename: string, path: string, confidence: number, searchRegion: Region): Promise<SearchResult> {
        const {left, top, width, height} = await getCoordinates(searchRegion);
        return new Promise<SearchResult>(async (resolve, reject) => {
            try {
                screen.config.resourceDirectory = path;
                const result = await screen.find(filename, {
                    confidence,
                    searchRegion: new NutRegion(
                        left,
                        top,
                        width,
                        height
                    )
                });
                resolve({
                    left: result.left,
                    top: result.top,
                    width: result.width,
                    height: result.height
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    async waitForImage(filepath: string, path: string, confidence: number, timeoutMs: number, searchRegion: Region): Promise<SearchResult> {
        const {left, top, width, height} = await getCoordinates(searchRegion);
        return new Promise<SearchResult>(async (resolve, reject) => {
            try {
                screen.config.resourceDirectory = path;
                const result = await screen.waitFor(filepath, timeoutMs, {
                    confidence,
                    searchRegion: new NutRegion(
                        left,
                        top,
                        width,
                        height
                    )
                });
                resolve({
                    left: result.left,
                    top: result.top,
                    width: result.width,
                    height: result.height
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    async height(): Promise<number> {
        return screen.height();
    },
    async width(): Promise<number> {
        return screen.width();
    },
    async takeScreenshot(filename: string): Promise<string> {
        const pathParts = parse(filename);
        const outputDir = (pathParts.dir && pathParts.dir.length > 0) ? pathParts.dir : cwd();
        return screen.capture(pathParts.name, FileType.PNG, outputDir);
    },
    async takeScreenshotWithTimestamp(filename: string): Promise<string> {
        const pathParts = parse(filename);
        const outputDir = (pathParts.dir && pathParts.dir.length > 0) ? pathParts.dir : cwd();
        return screen.capture(pathParts.name, FileType.PNG, outputDir, `${getTimestamp(Date.now(), getTimezoneOffset())}_`, "");
    }
};