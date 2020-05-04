import { LegacyProjectProperties } from "../../../../loader/legacy-project-properties.class";
import { mockPartial } from "sneer";
import { createKeyboardApi as createKeyboardImpl } from "../keyboard.function";

export const createKeyboardApi = (_: LegacyProjectProperties) => {
    return mockPartial<ReturnType<typeof createKeyboardImpl>>({});
}