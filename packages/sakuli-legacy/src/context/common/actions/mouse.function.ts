import {
  Button as NutButton,
  centerOf,
  mouse,
  straightTo,
} from "@nut-tree/nut-js";
import { MouseButton } from "../button.class";
import { Region } from "../region";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";
import { toNutRegion } from "./converter.function";

export interface MouseApi {
  click: () => Promise<void>;
  doubleClick: () => Promise<void>;
  rightClick: () => Promise<void>;
  pressButton: (btn: MouseButton) => Promise<void>;
  releaseButton: (btn: MouseButton) => Promise<void>;
  dragAndDrop: (region: Region) => Promise<void>;
  move: (region: Region) => Promise<void>;
  scrollUp: (amount: number) => Promise<void>;
  scrollDown: (amount: number) => Promise<void>;
  scrollLeft: (amount: number) => Promise<void>;
  scrollRight: (amount: number) => Promise<void>;
}

export const createMouseApi = (props: LegacyProjectProperties): MouseApi => {
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
