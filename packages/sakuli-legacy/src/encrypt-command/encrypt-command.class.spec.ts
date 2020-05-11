import { encryptCommand } from "./encrypt-command.class";
import { mockPartial } from "sneer";
import { SakuliClass } from "@sakuli/core/dist/sakuli.class";

describe("encrypt-command", () => {
  let mockExit: any;

  beforeEach(() => {
    // @ts-ignore
    mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation((code?: number | undefined) => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw on missing masterkey", async () => {
    // GIVEN
    const sakuliMock = mockPartial<SakuliClass>({});
    const SUT = encryptCommand(sakuliMock);

    // WHEN
    await SUT.handler({
      _: ["foo"],
      $0: "test",
    });

    // THEN
    expect(mockExit).toHaveBeenCalledWith(-1);
  });

  it("should encrypt input", async () => {
    // GIVEN
    const sakuliMock = mockPartial<SakuliClass>({});
    const SUT = encryptCommand(sakuliMock);

    // WHEN
    await SUT.handler({
      _: ["foo"],
      $0: "test",
      masterkey: "bFGbIZu8AeCN8pPPPd+HDw==",
      secret: "testSecret",
    });

    // THEN
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});
