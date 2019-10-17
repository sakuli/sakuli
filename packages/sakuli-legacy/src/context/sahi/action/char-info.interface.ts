/**
 * A CharInfo can be:
 * - a character (eg. `'b'`)
 * - charCode of a character (eg. `98`)
 * - an array of `[keyCode, charCode]` (eg. `[13,13]` for pressing ENTER key)
 */
export type CharInfo = string | number | [number, number];

export function charInfoToKey(charInfo: CharInfo): string {
    if (typeof charInfo === 'string') {
        return charInfo;
    }
    if (typeof charInfo === 'number') {
        return String.fromCodePoint(charInfo)
    }
    if (Array.isArray(charInfo)) {
        return String.fromCharCode(charInfo[0]);
    }
    throw TypeError('charInfo parameter must be string, number or tuple of numbers');
}
