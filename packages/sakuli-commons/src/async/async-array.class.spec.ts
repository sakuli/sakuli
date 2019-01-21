import {filter, toPromise, fromPromises, intersect, map, Operator} from "./async-array.class";
import {compose} from "./compose.function";

describe('asyncIterator', () => {
    const numbers = [1, 2, 3].map(toPromise);

    const iteratorValue = <T>(v: T) => expect.objectContaining({value: v, done: false});
    const iteratorDone = expect.objectContaining({done: true});

    it('should compose and apply filter and map operator', async done => {
        const doubleEvensToString = compose(
            filter<number>(n => n % 2 === 0),
            map(n => n * 2),
            map(n => `Result: ${n}`)
        );
        const iterator: any = doubleEvensToString(numbers);
        await expect(iterator.next()).resolves.toEqual(iteratorValue("Result: 4"));
        await expect(iterator.next()).resolves.toEqual(iteratorDone);
        done();
    });

    it('should create an intersection ', async done => {
        const p = (x: number,y:number): [number, number] => [x,y];
        const n1 = [p(2,3), p(3,2), p(3,3)].map(toPromise);
        const n2 = [p(2,2), p(2,3), p(2,4)].map(toPromise);

        const operator = intersect(fromPromises(n2), ([x1,y1], [x2,y2]) => x1 === x2 && y2 === y1);
        const iterator: any = operator(n1);
        await expect(iterator.next()).resolves.toEqual(iteratorValue(expect.arrayContaining([2,3])));
        await expect(iterator.next()).resolves.toEqual(iteratorDone);
        done();
    });

    describe('fromPromises', () => {
        it('should convert array of promises to async iterator', async done => {
            const iterator: any = fromPromises(numbers);
            await expect(iterator.next()).resolves.toEqual(iteratorValue(1));
            await expect(iterator.next()).resolves.toEqual(iteratorValue(2));
            await expect(iterator.next()).resolves.toEqual(iteratorValue(3));
            await expect(iterator.next()).resolves.toEqual(iteratorDone);
            done();
        });
    });


});