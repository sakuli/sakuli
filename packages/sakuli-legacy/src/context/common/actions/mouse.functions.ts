import {Location, mouse, movement, Region as NutRegion} from "@nut-tree/nut-js";
import {Region} from "../region.class";
import {ScreenApi} from "./screen.functions";

const toNutRegion = async (region: Region): Promise<NutRegion> => {
    return new NutRegion(
        await region.getX() || 0,
        await region.getY() || 0,
        await region.getW() || await ScreenApi.width(),
        await region.getH() || await ScreenApi.height()
    );
};

export const MouseApi = {
    async dragAndDrop(region: Region) {
        await mouse.drag(
            await movement.straightTo(
                Location.centerOf(
                    await toNutRegion(region)
                )
            )
        );
    },
    async move(region: Region) {
        await mouse.move(
            await movement.straightTo(
                Location.centerOf(
                    await toNutRegion(region)
                )
            )
        )
    },
    async scrollUp(amount: number) {
        await mouse.scrollUp(amount);
    },
    async scrollDown(amount: number) {
        await mouse.scrollDown(amount);
    },
    async scrollLeft(amount: number) {
        await mouse.scrollLeft(amount);
    },
    async scrollRight(amount: number) {
        await mouse.scrollRight(amount);
    },
};