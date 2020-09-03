import { LegacyProjectProperties } from "../../../../loader/legacy-project-properties.class";
import { mockPartial } from "sneer";
import { KeyboardApi } from "../keyboard.function";

const pressKeyMock = jest.fn();
const releaseKeyMock = jest.fn();
export const createKeyboardApi = (_: LegacyProjectProperties) => {
  return mockPartial<KeyboardApi>({
    pressKey: pressKeyMock,
    releaseKey: releaseKeyMock,
  });
};
