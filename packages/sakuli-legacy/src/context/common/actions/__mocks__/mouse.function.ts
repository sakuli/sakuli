import { LegacyProjectProperties } from "../../../../loader/legacy-project-properties.class";
import { mockPartial } from "sneer";
import { MouseApi } from "../mouse.function";

const clickMock = jest.fn();
const doubleClickMock = jest.fn();
const rightClickMock = jest.fn();
const moveMock = jest.fn();
const pressButtonMock = jest.fn();
const releaseButtonMock = jest.fn();
const dragAndDropMock = jest.fn();
const scrollDownMock = jest.fn();
const scrollUpMock = jest.fn();

export const createMouseApi = (_: LegacyProjectProperties) => {
  return mockPartial<MouseApi>({
    click: clickMock,
    doubleClick: doubleClickMock,
    rightClick: rightClickMock,
    move: moveMock,
    pressButton: pressButtonMock,
    releaseButton: releaseButtonMock,
    dragAndDrop: dragAndDropMock,
    scrollDown: scrollDownMock,
    scrollUp: scrollUpMock,
  });
};
