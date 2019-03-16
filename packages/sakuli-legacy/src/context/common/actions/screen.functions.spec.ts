import {ScreenApi} from "./screen.functions";
import {Region} from "../region.class";
import {Location, mouse, movement, Region as NutRegion} from "@nut-tree/nut-js";

describe("screen", () => {
    it("should find images", async () => {
        const result = await ScreenApi.find("mac.png", 0.99, new Region(0, 0, await ScreenApi.width(), await ScreenApi.height()));
        await mouse.move(await movement.straightTo(Location.centerOf(new NutRegion(await result.getX(), await result.getY(), await result.getW(), await result.getH()))));
        console.log(result);
    });
});