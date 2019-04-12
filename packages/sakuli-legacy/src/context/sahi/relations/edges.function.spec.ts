import {WebElement} from "selenium-webdriver";
import {EdgeInfo, edges} from "./edges.function";
import {mockPartial} from "sneer";
import {Vector2} from "./vector2.type";

describe('edges()', () => {
    const e = edges({
        origin: mockPartial<WebElement>({}),
        location: {
            x: 100,
            y: 50
        },
        size: {
            width: 200,
            height: 100
        }
    });

    it.each([
        ['top', [200, 50]],
        ['topRight', [300, 50]],
        ['topLeft', [100, 50]],
        ['bottom', [200, 150]],
        ['bottomRight', [300, 150]],
        ['bottomLeft', [100, 150]],
        ['left', [100, 100]],
        ['right', [300, 100]],
    ])('should calculate %s as %j', (prop: keyof EdgeInfo, expected: Vector2) => {
        expect(e[prop]).toEqual(expected);
    });

    describe('isUnder', () => {
        /**
         * -------------> x
         * |   +--+
         * |   |A |
         * |   +--+
         * |
         * | +--+
         * | |B |
         * | +--+
         * |
         * |          +--+
         * |          |D |
         * |          +--+
         * |
         * v
         * y
         *
         */
        const A = edges({
            origin: mockPartial({}),
            location: {
                x: 4,
                y: 3
            },
            size: {
                width: 4,
                height: 3
            }
        });

        const B = edges({
            origin: mockPartial({}),
            location: {
                x: 2,
                y: 7
            },
            size: {
                width: 4,
                height: 3
            }
        });

        const D = edges({
            origin: mockPartial({}),
            location: {
                x: 10,
                y: 11
            },
            size: {
                width: 4,
                height: 3
            }
        });

        it('should be B under A', () => {
            expect(B.isUnder(A)).toBeTruthy();
        });

        it('should be A not under B', () => {
            expect(A.isUnder(B)).toBeFalsy();
        });

        it('should be D not intersects A', () => {
            expect(D.intersectsVertical(A)).toBeFalsy();
        });

        it('should be B intersects A', () => {
            expect(B.intersectsVertical(A)).toBeTruthy();
        });

        it('should be A above B', () => {
            expect(A.isAbove(B)).toBeTruthy()
        });

        it('should be B not above A', () => {
            expect(B.isAbove(A)).toBeFalsy();
        });

    });
});