import {Region as NutRegion, screen} from "@nut-tree/nut-js";
import {Region} from "../region.class";
import {FileType} from "@nut-tree/nut-js/dist/lib/file-type.enum";
import {parse} from "path";
import {cwd} from "process";

const getCoordinates = async (region: Region) => {
    return ({
        left: await region.getX() || 0,
        top: await region.getY() || 0,
        width: await region.getW() || await screen.width(),
        height: await region.getH() || await screen.height(),
    })
};

export const ScreenApi = {
    async find(filepath: string, similarity: number, searchRegion: Region): Promise<Region> {
        const { left, top, width, height } = await getCoordinates(searchRegion);
        return new Promise<Region>(async (resolve, reject) => {
            try {
                const result = await screen.find(filepath, {
                    confidence: similarity,
                    searchRegion: new NutRegion(
                        left,
                        top,
                        width,
                        height
                    )
                });
                resolve(new Region(result.left, result.top, result.width, result.height));
            } catch (e) {
                reject(e);
            }
        });
    },
    async waitForImage(filepath: string, timeoutMs: number, similarity: number, searchRegion: Region) {
        const { left, top, width, height } = await getCoordinates(searchRegion);
        return new Promise<Region>(async (resolve, reject) => {
            try {
                const result = await screen.waitFor(filepath, timeoutMs, {
                    confidence: similarity,
                    searchRegion: new NutRegion(
                        left,
                        top,
                        width,
                        height
                    )
                });
                resolve(new Region(result.left, result.top, result.width, result.height));
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
        return screen.capture(pathParts.name, FileType.PNG, outputDir, `${Date.now().toLocaleString()}_`, "");
    }
};