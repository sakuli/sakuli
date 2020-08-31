import { MouseButton } from "./button.class";
import { releaseKeys } from "./release-keys.function";
import { mockPartial } from "sneer";
import { Key, KeyboardApi, MouseApi } from ".";

describe("release key function", () => {
  const releaseButtonMock = jest.fn();
  const releaseKeyboardKeysMock = jest.fn();

  const mouseApi = mockPartial<MouseApi>({
    releaseButton: releaseButtonMock,
  });

  const keyboardApi = mockPartial<KeyboardApi>({
    releaseKey: releaseKeyboardKeysMock,
  });

  it("should release all mouse keys", async () => {
    //GIVEN
    const downedKeys = {
      keyboard: [],
      mouse: [MouseButton.MIDDLE, MouseButton.LEFT, MouseButton.RIGHT],
    };

    //WHEN
    await releaseKeys(downedKeys, mouseApi, keyboardApi);

    //THEN
    expect(releaseButtonMock).toBeCalledTimes(3);
    downedKeys.mouse.forEach((key) =>
      expect(releaseButtonMock).toBeCalledWith(key)
    );
  });

  it("should release all keyboard keys", async () => {
    //GIVEN
    const downedKeys = {
      keyboard: [Key.SHIFT, Key.CTRL, Key.ALT],
      mouse: [],
    };

    //WHEN
    await releaseKeys(downedKeys, mouseApi, keyboardApi);

    //THEN
    expect(releaseKeyboardKeysMock).toBeCalledWith(downedKeys.keyboard);
  });
});
