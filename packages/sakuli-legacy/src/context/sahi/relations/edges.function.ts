import {PositionalInfo} from "./positional-info.function";
import {Vector2} from "./vector2.type";

export interface EdgeInfo {

    /**
     *  ----x----
     *  |       |
     *  |       |
     *  |       |
     *  ---------
     */
    top: Vector2,

    /**
     *  x--------
     *  |       |
     *  |       |
     *  |       |
     *  ---------
     */
    topLeft: Vector2,

    /**
     *  ---------
     *  |       |
     *  x       |
     *  |       |
     *  ---------
     */
    left: Vector2,

    /**
     *  ---------
     *  |       |
     *  |       |
     *  |       |
     *  x--------
     */
    bottomLeft: Vector2,

    /**
     *  ---------
     *  |       |
     *  |       |
     *  |       |
     *  ----x----
     */
    bottom: Vector2,

    /**
     *  ---------
     *  |       |
     *  |       |
     *  |       |
     *  --------x
     */
    bottomRight: Vector2,

    /**
     *  ---------
     *  |       |
     *  |       x
     *  |       |
     *  ---------
     */
    right: Vector2,

    /**
     *  --------x
     *  |       |
     *  |       |
     *  |       |
     *  ---------
     */
    topRight: Vector2

    /**
     *  ---------
     *  |       |
     *  |   x   |
     *  |       |
     *  ---------
     */
    center: Vector2
}

export function edges(pos: PositionalInfo): EdgeInfo {
    const {width, height} = pos.size;
    const {x,y} = pos.location;
    const xc = (width / 2) + x;
    const yc = (height / 2) + y;
    return ({
        top: [xc, y],
        bottom: [xc, y + height],
        bottomLeft: [x, y + height],
        bottomRight: [x + width, y + height],
        left: [x, yc],
        right: [x + width, yc],
        topLeft: [x, y],
        topRight: [x + width, y],
        center: [xc, yc],
    })
}