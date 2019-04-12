import {Vector2} from "./vector2.type";


export function distance([x1, y1]: Vector2, [x2, y2]: Vector2) {
    const a = (x1 - x2);
    const b = (y1 - y2);
    return Math.sqrt(a*a + b*b);
}