import {getSeleniumKeysFromComboString} from "./sahi-selenium-key-map.const";
import {Key} from 'selenium-webdriver'

describe('sahiSeleniumKeyMap', () => {
    it.each(<[string, string[]][]>[
        ["", []],
        ["CTRL", [Key.CONTROL]],
        ["CTRL|META", [Key.META, Key.CONTROL]],
        ["CTRL|unknown|META", [Key.META, Key.CONTROL]],
        ["ALT", [Key.ALT]],
        ["META|ALT", [Key.ALT, Key.META]],
    ])('should map', (combo: string, expected: string[]) => {
        expect(
            getSeleniumKeysFromComboString(combo)
        ).toEqual(expect.arrayContaining(expected))
    });
});