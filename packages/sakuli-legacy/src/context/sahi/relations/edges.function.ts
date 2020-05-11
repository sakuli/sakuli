import { PositionalInfo } from "./positional-info.function";
import { isInVector, Vector2 } from "./vector2.type";

export interface EdgeInfo {
  /**
   *  ----x----
   *  |       |
   *  |       |
   *  |       |
   *  ---------
   */
  top: Vector2;

  /**
   *  x--------
   *  |       |
   *  |       |
   *  |       |
   *  ---------
   */
  topLeft: Vector2;

  /**
   *  ---------
   *  |       |
   *  x       |
   *  |       |
   *  ---------
   */
  left: Vector2;

  /**
   *  ---------
   *  |       |
   *  |       |
   *  |       |
   *  x--------
   */
  bottomLeft: Vector2;

  /**
   *  ---------
   *  |       |
   *  |       |
   *  |       |
   *  ----x----
   */
  bottom: Vector2;

  /**
   *  ---------
   *  |       |
   *  |       |
   *  |       |
   *  --------x
   */
  bottomRight: Vector2;

  /**
   *  ---------
   *  |       |
   *  |       x
   *  |       |
   *  ---------
   */
  right: Vector2;

  /**
   *  --------x
   *  |       |
   *  |       |
   *  |       |
   *  ---------
   */
  topRight: Vector2;

  /**
   *  ---------
   *  |       |
   *  |   x   |
   *  |       |
   *  ---------
   */
  center: Vector2;
}

export interface Edge extends EdgeInfo {
  isUnder(b: EdgeInfo, anchor?: keyof EdgeInfo): boolean;

  isAbove(b: EdgeInfo, anchor?: keyof EdgeInfo): boolean;

  intersectsVertical(b: EdgeInfo): boolean;
}

export function edges(pos: PositionalInfo): Edge {
  const { width, height } = pos.size;
  const { x, y } = pos.location;
  const xc = width / 2 + x;
  const yc = height / 2 + y;
  const top: Vector2 = [xc, y];
  const bottom: Vector2 = [xc, y + height];
  const bottomLeft: Vector2 = [x, y + height];
  const bottomRight: Vector2 = [x + width, y + height];
  const left: Vector2 = [x, yc];
  const right: Vector2 = [x + width, yc];
  const topLeft: Vector2 = [x, y];
  const topRight: Vector2 = [x + width, y];
  const center: Vector2 = [xc, yc];
  const isUnder = (b: EdgeInfo, anchor: keyof EdgeInfo = "center") => {
    const [_, yb] = b[anchor];
    return yc > yb;
  };
  const isAbove = (b: EdgeInfo, anchor: keyof EdgeInfo = "center") => {
    const [_, yb] = b[anchor];
    return yc < yb;
  };
  const intersectsVertical = ({ left: [lx], right: [rx] }: EdgeInfo) => {
    const xRange: Vector2 = [x, x + width];
    return isInVector(lx, xRange) || isInVector(rx, xRange);
  };
  return {
    top,
    bottom,
    bottomLeft,
    bottomRight,
    left,
    right,
    topLeft,
    topRight,
    center,
    isUnder,
    isAbove,
    intersectsVertical,
  };
}
