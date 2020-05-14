import { Algorithm } from "@nut-tree/secrets";

const createMasterkey = require("./create-masterkey-command.class");

describe("encrypt-command", () => {
  let mockExit: any;

  beforeEach(() => {
    mockExit = jest
      .spyOn(process, "exit")
      // @ts-ignore
      .mockImplementation((code?: number | undefined) => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create a new masterkey with aes-128-cbc", async () => {
    // GIVEN
    const SUT = createMasterkey.handler;

    // WHEN
    await SUT({
      algorithm: Algorithm.AES128CBC,
    });

    // THEN
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("should create a new masterkey with aes-256-cbc", async () => {
    // GIVEN
    const SUT = createMasterkey.handler;

    // WHEN
    await SUT({
      algorithm: Algorithm.AES256CBC,
    });

    // THEN
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});
