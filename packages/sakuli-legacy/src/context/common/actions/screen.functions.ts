import {Region as NutRegion, screen} from "@nut-tree/nut-js";
import {Region} from "../region.class";

export const ScreenApi = {
    async find(filepath: string, similarity: number, searchRegion: Region) {
        const result = await screen.find(filepath, {
            confidence: similarity,
            searchRegion: new NutRegion(
                await searchRegion.getX(),
                await searchRegion.getY(),
                await searchRegion.getW(),
                await searchRegion.getH()
            )
        });
        if (result) {
            return new Region(result.left, result.top, result.width, result.height);
        }
        return new Region(0, 0, 0, 0);
    },
    async height(): Promise<number> {
        return screen.height();
    },
    async width(): Promise<number> {
        return screen.width();
    },
};