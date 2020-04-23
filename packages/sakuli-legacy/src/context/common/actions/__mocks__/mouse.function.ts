import { LegacyProjectProperties } from "../../../../loader/legacy-project-properties.class";
import { mockPartial } from "sneer";
import { createMouseApi as createMouseApiImpl } from "../mouse.function";

const clickMock = jest.fn();
const moveMock = jest.fn();

export const createMouseApi = (_: LegacyProjectProperties) => {
    return mockPartial<ReturnType<typeof createMouseApiImpl>>({
        click: clickMock,
        move: moveMock
    });
}