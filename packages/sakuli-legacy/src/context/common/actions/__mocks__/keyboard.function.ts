import { LegacyProjectProperties } from "../../../../loader/legacy-project-properties.class";
import { mockPartial } from "sneer";
import { createKeyboardApi as createKeyboardImpl } from "../keyboard.function";

const pressKeyMock = jest.fn();
const releaseKeyMock = jest.fn();
export const createKeyboardApi = (_: LegacyProjectProperties) => {
  return mockPartial<ReturnType<typeof createKeyboardImpl>>({
    pressKey: pressKeyMock,
    releaseKey: releaseKeyMock,
  });
};
