import { Key } from "./key.class";
import { MouseButton } from "./button.class";

export interface ButtonRegistry {
  keyboard: Key[];
  mouse: MouseButton[];
}
const buttonRegistry = {
  keyboard: new Set<Key>(),
  mouse: new Set<MouseButton>(),
};

export function registerKeyboardPressKeys(...keys: Key[]) {
  keys.forEach((key) => buttonRegistry.keyboard.add(key));
}

export function registerKeyboardReleaseKeys(...keys: Key[]) {
  keys.forEach((key) => buttonRegistry.keyboard.delete(key));
}

export function registerMouseDown(button: MouseButton) {
  buttonRegistry.mouse.add(button);
}

export function registerMouseUp(button: MouseButton) {
  buttonRegistry.mouse.delete(button);
}

export function getActiveKeys(): ButtonRegistry {
  return {
    keyboard: [...buttonRegistry.keyboard],
    mouse: [...buttonRegistry.mouse],
  };
}
