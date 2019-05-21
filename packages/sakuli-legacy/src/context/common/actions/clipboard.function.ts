import {clipboard, Key as NutKey, keyboard} from "@nut-tree/nut-js";
import {copyShortcut, pasteShortcut} from "./shortcut.function";

export const ClipboardApi = {
    async paste(): Promise<string> {
        return clipboard.paste();
    },
    async getClipboard(): Promise<string> {
        return clipboard.paste();
    },
    async setClipboard(text: string) {
        await clipboard.copy(text);
    },
    async pasteClipboard() {
        await keyboard.pressKey(...pasteShortcut() as NutKey[]);
        await keyboard.releaseKey(...pasteShortcut() as NutKey[]);
    },
    async copyIntoClipboard() {
        await keyboard.pressKey(...copyShortcut() as NutKey[]);
        await keyboard.releaseKey(...copyShortcut() as NutKey[]);
    },
    async cleanClipboard() {
        // TODO
    }
};