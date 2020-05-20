import { createRegionClass } from "../region";
import { screen, Region as NutRegion } from "@nut-tree/nut-js";
import { Project, TestExecutionContext } from "@sakuli/core";
import { createTestExecutionContextMock } from "../../__mocks__";
import { toNutRegion } from "./converter.function";

let ctx: TestExecutionContext;
let project: Project;

beforeEach(() => {
  ctx = createTestExecutionContextMock();
  project = new Project("");
});
describe("toNutRegion", () => {
  it("should convert Sakuli regions to nut.js regions", async () => {
    // GIVEN
    const SakuliRegion = createRegionClass(ctx, project);
    const left = 10;
    const top = 20;
    const width = 30;
    const height = 40;
    const sakuliRegion = new SakuliRegion(left, top, width, height);
    const nutRegion = new NutRegion(left, top, width, height);

    // WHEN
    const convertedRegion = await toNutRegion(sakuliRegion);

    // THEN
    expect(convertedRegion).toEqual(nutRegion);
  });

  it("should use screen bounds as defaults for nut.js regions", async () => {
    // GIVEN
    const SakuliRegion = createRegionClass(ctx, project);
    const sakuliRegion = new SakuliRegion();
    const nutRegion = new NutRegion(
      0,
      0,
      await screen.width(),
      await screen.height()
    );

    // WHEN
    const convertedRegion = await toNutRegion(sakuliRegion);

    // THEN
    expect(convertedRegion).toEqual(nutRegion);
  });
});
