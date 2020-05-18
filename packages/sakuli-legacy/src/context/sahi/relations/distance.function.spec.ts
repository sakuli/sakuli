import { Vector2 } from "./vector2.type";
import { distance } from "./distance.function";

describe("distance", () => {
  it.each(<[Vector2, Vector2, number][]>[
    [[7, 3], [3, 2], 4.124],
    [[6.2, 3.2], [3, 1.6], 3.578],
    [[-3, 5], [7, -1], 11.66],
    [[4, 0.6], [9.7, 1.4], 5.756],
  ])(
    "should calculate distance between points",
    (p1: Vector2, p2: Vector2, result: number) => {
      expect(distance(p1, p2)).toBeCloseTo(result);
    }
  );
});
