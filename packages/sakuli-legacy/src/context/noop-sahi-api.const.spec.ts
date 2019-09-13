import {NoopSahiApi} from "./noop-sahi-api.const";
import {SahiApi} from "./sahi/sahi-api.interface";

describe('NoopSahiApi', () => {
    it.each([
            ...Object.keys(NoopSahiApi)
        ]
    )('should throw an error containing methodname %s', (key: string) => {
        expect(() => {
            (NoopSahiApi[key as keyof SahiApi] as any)();
        }).toThrowError(new RegExp(`${key}`));
    })
});
