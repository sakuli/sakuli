import { wrap } from "./wrap.function";

describe('wrap', () => {

    let add: (a:number, b:number) => number;

    beforeEach(() => {
        add = jest.fn();
    })

    it('should invoke original in wrapped fn', () => {
        const wrapped = wrap(add, (org, a,b) => {
            return org(a,b);
        })
        wrapped(4,2);
        expect(add).toBeCalledWith(4,2);
    })
})
