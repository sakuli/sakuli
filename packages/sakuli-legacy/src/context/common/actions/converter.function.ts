import { Region } from "../region";
import { Region as NutRegion } from "@nut-tree/nut-js/dist/lib/region.class";
import { ScreenApi } from "./screen.function";

export const toNutRegion = async (region: Region): Promise<NutRegion> => {
  return new NutRegion(
    (await region.getX()) || 0,
    (await region.getY()) || 0,
    (await region.getW()) || (await ScreenApi.width()),
    (await region.getH()) || (await ScreenApi.height())
  );
};
