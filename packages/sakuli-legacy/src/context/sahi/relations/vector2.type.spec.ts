import { isInVector, isLeftOf, isRightOf, Vector2 } from "./vector2.type";

describe("vector2", () => {
  const v1: Vector2 = [1, 2];
  const v2: Vector2 = [3, 4];
  describe("isLeftOf", () => {
    it("should indicate, that v1 is left of v2", () => {
      expect(isLeftOf(v2, v1)).toBe(true);
    });
    it("should indicate, that v2 is not left of v1", () => {
      expect(isLeftOf(v1, v2)).toBe(false);
    });
  });
  describe("isRightOf", () => {
    it("should indicate, that v1 is not right of v2", () => {
      expect(isRightOf(v2, v1)).toBe(false);
    });
    it("should indicate, that v2 is right of v1", () => {
      expect(isRightOf(v1, v2)).toBe(true);
    });
  });
  describe("isInVector", () => {
    const range: Vector2 = [2, 4];
    it("should indicate, that 3 is in vector range", () => {
      expect(isInVector(3, range)).toBe(true);
    });
    it("should indicate, that 5 is not in vector range", () => {
      expect(isInVector(5, range)).toBe(false);
    });
    it("should indicate, that 1 is not in vector range", () => {
      expect(isInVector(1, range)).toBe(false);
    });
  });
});
