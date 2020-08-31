import { Key } from "./key.class";
import { MouseButton } from "./button.class";

interface ButtonRegistry {
  keyboard: Key[];
  mouse: MouseButton[];
}
const buttonRegistry: ButtonRegistry = {
  keyboard: [],
  mouse: [],
};

export function registerKeyboardKeyDown(key: Key) {
  buttonRegistry.keyboard.push(key);
}

export function registerKeyboardKeyUp(key: Key) {
  removeFromArray(buttonRegistry.keyboard, key);
}

export function registerMouseDown(button: MouseButton) {
  buttonRegistry.mouse.push(button);
}

export function registerMouseUp(button: MouseButton) {
  removeFromArray(buttonRegistry.mouse, button);
}

export function getRegisteredKeys(): ButtonRegistry {
  return buttonRegistry;
}

function removeFromArray<T>(array: T[], key: T) {
  const index = array.indexOf(key);
  if (index > -1) {
    array.splice(index, 1);
  }
}
