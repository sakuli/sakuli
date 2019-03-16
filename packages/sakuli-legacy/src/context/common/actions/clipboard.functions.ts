import {clipboard, Key, keyboard} from "@nut-tree/nut-js";
import {copyShortcut, pasteShortcut} from "./shortcut.functions";

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
        await keyboard.type(...pasteShortcut());
    },
    async copyIntoClipboard() {
        await keyboard.type(...copyShortcut());
    },
    async cleanClipboard() {
        // TODO
    }
};