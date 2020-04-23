import { createRegionClass } from "./sakuli-region.class";
import { createTestExecutionContextMock } from "../../__mocks__";
import { mockPartial } from "sneer";
import { Project } from "@sakuli/core";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";
import * as actions from "../actions";
import any = jasmine.any;

jest.mock("../actions");

describe("sakuli region class", () => {

    const testExecutionContextMock = createTestExecutionContextMock();
    const sakuliRegionClass = createRegionClass(
        testExecutionContextMock,
        mockPartial<Project>({
            objectFactory: jest.fn().mockReturnValue(new LegacyProjectProperties())
        }));
    const sakuliRegion = new sakuliRegionClass();

    const mouseApi = actions.createMouseApi(new LegacyProjectProperties());

    it("should forward clicks to mouse api", async () =>{

        //GIVEN
        const runAsActionSpy = jest.spyOn(actions, "runAsAction");

        //WHEN
        const region = await sakuliRegion.click();

        //THEN
        expect(mouseApi.click).toBeCalled();
        expect(mouseApi.move).toBeCalledWith(sakuliRegion);
        expect(runAsActionSpy).toBeCalledWith(testExecutionContextMock, "click", any(Function));
        expect(region).toBeInstanceOf(sakuliRegionClass);
    })
})