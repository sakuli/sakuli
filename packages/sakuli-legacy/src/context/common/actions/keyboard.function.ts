import {clipboard, Key as NutKey, keyboard} from "@nut-tree/nut-js";
import {pasteShortcut} from "./shortcut.function";
import {withEncryption} from "../secrets.function";
import {Key} from "../key.class";

export const KeyboardApi = {
    async paste(text: string) {
        await clipboard.copy(text);
        await keyboard.pressKey(...pasteShortcut() as NutKey[]);
        await keyboard.releaseKey(...pasteShortcut() as NutKey[]);
    },
    async pasteAndDecrypt(key: string, text: string) {
        return withEncryption(key, text, async (decrypted) => {
            await this.paste(decrypted);
        });
    },
    async type(text: string, ...optModifiers: Key[]) {
        await keyboard.pressKey(...optModifiers as NutKey[]);
        await keyboard.type(text);
        await keyboard.releaseKey(...optModifiers as NutKey[]);
    },
    async typeAndDecrypt(key: string, text: string, ...optModifiers: Key[]) {
        return withEncryption(key, text, async (decrypted) => {
            await this.type(decrypted, ...optModifiers);
        });
    },
    async pressKey(...keys: Key[]) {
        await keyboard.pressKey(...keys as NutKey[])
    },
    async releaseKey(...keys: Key[]) {
        await keyboard.releaseKey(...keys as NutKey[])
    }
};
