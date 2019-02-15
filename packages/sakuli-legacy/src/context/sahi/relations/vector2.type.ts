export type Vector2 = [number, number];

export function vectorAdd([x1, y1]: Vector2, [x2, y2]: Vector2): Vector2 {
    return [x1 + x2, y1 + y2];
}

/**
 * Return true if v2 is left of v1
 * @param v1 Vector2
 * @param v2 Vector2
 */
export function isLeftOf([x1]: Vector2, [x2]: Vector2) {
    return x1 >= x2;
}

/**
 * Return true if v2 is right of v1
 * @param v1 Vector2
 * @param v2 Vector2
 */
export function isRightOf([x1]: Vector2, [x2]: Vector2) {
    return x1 < x2;
}

export function isInVector(x: number, [left, right]:Vector2) {
    return x >= left && x <= right;
}

