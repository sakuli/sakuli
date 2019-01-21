import {ILocation, ISize, WebElement} from "selenium-webdriver";
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
        ['top',[200, 50]],
        ['topRight',[300, 50]],
        ['topLeft',[100, 50]],
        ['bottom',[200, 150]],
        ['bottomRight',[300, 150]],
        ['bottomLeft',[100, 150]],
        ['left',[100, 100]],
        ['right',[300, 100]],
    ])('should calculate %s as %j', (prop: keyof EdgeInfo, expected: Vector2) => {
        expect(e[prop]).toEqual(expected);
    });
});