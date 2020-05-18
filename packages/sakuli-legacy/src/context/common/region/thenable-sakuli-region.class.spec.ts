import { createThenableRegionClass, ThenableRegion } from "../region";
import { createTestExecutionContextMock } from "../../__mocks__";
import { Project, TestExecutionContext } from "@sakuli/core";
import { Region } from "./region.interface";
import { mockPartial } from "sneer";
import { Type } from "@sakuli/commons";

describe("ThenableRegion", () => {
  const projectMock = new Project(".");
  let ctx: TestExecutionContext;
  let ThenableRegion: Type<ThenableRegion>;
  let regionMock: Region;

  beforeEach(() => {
    ctx = createTestExecutionContextMock();
    ThenableRegion = createThenableRegionClass(ctx, projectMock);
    regionMock = mockPartial<Region>({
      find: jest.fn(() => Promise.resolve(regionMock)),
      mouseMove: jest.fn(() => Promise.resolve(regionMock)),
      click: jest.fn(() => Promise.resolve(regionMock)),
    });
  });

  it("should invoke", async () => {
    const r = new ThenableRegion(0, 0, 0, 0, Promise.resolve(regionMock));
    const region = await r.find("test.jpg").mouseMove().click();

    expect(region.find).toHaveBeenCalledWith("test.jpg");
    expect(region.mouseMove).toHaveBeenCalled();
    expect(region.click).toHaveBeenCalled();
  });
});
