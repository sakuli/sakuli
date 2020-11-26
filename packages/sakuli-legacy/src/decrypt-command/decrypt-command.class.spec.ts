import { mockPartial } from "sneer";
import { SakuliClass } from "@sakuli/core/dist/sakuli.class";
import { decryptCommand } from "./decrypt-command.class";

describe("decrypt-command", () => {
  let mockExit: any;
  const mockLogger: any = jest.spyOn(console, "log");

  beforeEach(() => {
    mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation((code?: number | undefined) => {
        return undefined as never;
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw on missing masterkey", async () => {
    // GIVEN
    const sakuliMock = mockPartial<SakuliClass>({});
    const SUT = decryptCommand(sakuliMock);

    // WHEN
    await SUT.handler({
      _: ["foo"],
      $0: "test",
    });

    // THEN
    expect(mockExit).toHaveBeenCalledWith(-1);
  });

  it("should decrypt input", async () => {
    // GIVEN
    const sakuliMock = mockPartial<SakuliClass>({});
    const SUT = decryptCommand(sakuliMock);

    // WHEN
    await SUT.handler({
      _: ["foo"],
      $0: "test",
      masterkey: "bFGbIZu8AeCN8pPPPd+HDw==",
      secret: "4OzgVwsCcdHCRZrOqo4tCc1OXfAuIZbgWHbLm3DBouk=",
    });

    // THEN
    expect(mockLogger).toHaveBeenCalledWith(
      expect.stringContaining("testSecret")
    );
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});
