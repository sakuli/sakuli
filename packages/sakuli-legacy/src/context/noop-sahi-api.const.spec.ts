import { NoopSahiApi } from "./noop-sahi-api.const";

describe('NoopSahiApi', () => {

    it('should throw an error containing the name of the method', () => {
        expect(() => {
            NoopSahiApi._navigateTo('')
        }).toThrowError(/_navigateTo/);
    })

});
