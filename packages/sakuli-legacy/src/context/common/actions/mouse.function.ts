import {
  Button as NutButton,
  centerOf,
  mouse,
  Region as NutRegion,
  straightTo,
} from "@nut-tree/nut-js";
import { ScreenApi } from "./screen.function";
import { MouseButton } from "../button.class";
import { Region } from "../region";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";

const toNutRegion = async (region: Region): Promise<NutRegion> => {
  return new NutRegion(
    (await region.getX()) || 0,
    (await region.getY()) || 0,
    (await region.getW()) || (await ScreenApi.width()),
    (await region.getH()) || (await ScreenApi.height())
  );
};

export const createMouseApi = (props: LegacyProjectProperties) => {
  mouse.config.autoDelayMs = props.mouseActionDelay;
  mouse.config.mouseSpeed = props.mouseSpeed;
  return {
    async click() {
      await mouse.leftClick();
    },
    async doubleClick() {
      await mouse.leftClick();
      await mouse.leftClick();
    },
    async rightClick() {
      await mouse.rightClick();
    },
    async pressButton(btn: MouseButton) {
      await mouse.pressButton(btn as NutButton);
    },
    async releaseButton(btn: MouseButton) {
      await mouse.releaseButton(btn as NutButton);
    },
    async dragAndDrop(region: Region) {
      await mouse.drag(straightTo(centerOf(await toNutRegion(region))));
    },
    async move(region: Region) {
      await mouse.move(straightTo(centerOf(await toNutRegion(region))));
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
};
