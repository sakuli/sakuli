import {Region as NutRegion, screen} from "@nut-tree/nut-js";
import {Region} from "../region.class";

export const ScreenApi = {
    async find(filepath: string, similarity: number, searchRegion: Region): Promise<Region> {
        const left = await searchRegion.getX() || 0;
        const top = await searchRegion.getY() || 0;
        const width = await searchRegion.getW() || await screen.width();
        const height = await searchRegion.getH() || await screen.height();
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
    async height(): Promise<number> {
        return screen.height();
    },
    async width(): Promise<number> {
        return screen.width();
    },
};