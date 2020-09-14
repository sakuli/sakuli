import { clipboard, Key as NutKey, keyboard } from "@nut-tree/nut-js";
import { pasteShortcut } from "./shortcut.function";
import { withEncryption } from "../secrets.function";
import { Key } from "../key.class";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";

export interface KeyboardApi {
  paste: (text: string) => Promise<void>;
  pasteAndDecrypt: (key: string, text: string) => any;
  type: (text: string | Key, ...optModifiers: Key[]) => any;
  typeAndDecrypt: (key: string, text: string, ...optModifiers: Key[]) => any;
  pressKey: (...keys: Key[]) => any;
  releaseKey: (...keys: Key[]) => Promise<void>;
}

export const createKeyboardApi = (
  props: LegacyProjectProperties
): KeyboardApi => {
  keyboard.config.autoDelayMs = props.typeDelay;
  return {
    async paste(text: string) {
      await clipboard.copy(text);
      await keyboard.pressKey(...(pasteShortcut() as NutKey[]));
      await keyboard.releaseKey(...(pasteShortcut() as NutKey[]));
    },
    async pasteAndDecrypt(key: string, text: string) {
      return withEncryption(key, text, async (decrypted) => {
        await this.paste(decrypted);
      });
    },
    async type(text: string | Key, ...optModifiers: Key[]) {
      await keyboard.pressKey(...(optModifiers as NutKey[]));
      if (typeof text === "string") {
        await keyboard.type(text);
      } else {
        await keyboard.type(text as NutKey);
      }
      await keyboard.releaseKey(...(optModifiers as NutKey[]));
    },
    async typeAndDecrypt(key: string, text: string, ...optModifiers: Key[]) {
      return withEncryption(key, text, async (decrypted) => {
        await this.type(decrypted, ...optModifiers);
      });
    },
    async pressKey(...keys: Key[]) {
      await keyboard.pressKey(...(keys as NutKey[]));
    },
    async releaseKey(...keys: Key[]) {
      await keyboard.releaseKey(...(keys as NutKey[]));
    },
  };
};
