import { Key } from "./key.class";
import { MouseButton } from "./button.class";

export interface ButtonRegistry {
  keyboard: Key[];
  mouse: MouseButton[];
}
const buttonRegistry: ButtonRegistry = {
  keyboard: [],
  mouse: [],
};

export function registerKeyboardPressKeys(...keys: Key[]) {
  buttonRegistry.keyboard.push(...keys);
}

export function registerKeyboardReleaseKeys(...keys: Key[]) {
  keys.forEach((key) => {
    removeFromArray(buttonRegistry.keyboard, key);
  });
}

export function registerMouseDown(button: MouseButton) {
  buttonRegistry.mouse.push(button);
}

export function registerMouseUp(button: MouseButton) {
  removeFromArray(buttonRegistry.mouse, button);
}

export function getActiveKeys(): ButtonRegistry {
  return buttonRegistry;
}

function removeFromArray<T>(array: T[], key: T) {
  const index = array.indexOf(key);
  if (index > -1) {
    array.splice(index, 1);
  }
}
