import { isSakuliPreset } from "./is-sakuli-preset.function";

describe("is-sakuli-preset", () => {
  it("should return false when keywords does not exist", () => {
    const info = ["foo", "bar"];

    expect(isSakuliPreset(info)).toBeFalsy();
  });

  it("should return false when keywords is not an array", () => {
    const info = {
      keywords: "notAnArray",
    };

    expect(isSakuliPreset(info)).toBeFalsy();
  });

  it("should return false when keywords does not contain sakuliPreset", () => {
    const info = {
      keywords: ["foo", "bar"],
    };

    expect(isSakuliPreset(info)).toBeFalsy();
  });

  it("should return true when keywords contains sakuliPreset", () => {
    const info = {
      keywords: ["foo", "sakuliPreset", "bar"],
    };

    expect(isSakuliPreset(info)).toBeFalsy();
  });
});
