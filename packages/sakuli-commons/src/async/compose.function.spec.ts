import {compose} from "./compose.function";

describe('compose', () => {
    it('should compose to a new function', () => {
        const composed = compose(
            (a: number) => `${a}`,
            a => Number(`1${a}`),
            a => a * 2
        );

        expect(composed(4)).toBe(28);
    });

    it('should compose async', async done => {
        const composed = compose(
            async (x: string) => Promise.resolve(`Hello ${x}`),
            async (x) => (await x).replace(`Sakuli`, `Sakuli V2`)
        );

        expect(composed('Sakuli'))
            .resolves
            .toBe('Hello Sakuli V2')
            .then(done)
    });
});