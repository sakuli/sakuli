import { ButtonRegistry } from "../button-registry";

export const registerKeyboardPressKeys = jest.fn();
export const registerKeyboardReleaseKeys = jest.fn();
export const registerMouseDown = jest.fn();
export const registerMouseUp = jest.fn();
export const getActiveKeys = jest.fn(
  (): ButtonRegistry => {
    return {
      keyboard: [],
      mouse: [],
    };
  }
);
