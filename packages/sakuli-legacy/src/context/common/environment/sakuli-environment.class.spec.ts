import { createTestExecutionContextMock } from "../../__mocks__";
import { mockPartial } from "sneer";
import { Project } from "@sakuli/core";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";
import * as actions from "../actions";
import { createEnvironmentClass } from "./sakuli-environment.class";
import any = jasmine.any;

jest.mock("../actions");

describe("sakuli environment", () => {

    const testExecutionContextMock = createTestExecutionContextMock();
    const sakuliEnvironmentClass = createEnvironmentClass(
        testExecutionContextMock,
        mockPartial<Project>({
            objectFactory: jest.fn().mockReturnValue(new LegacyProjectProperties())
        }));
    const sakuliEnvironment = new sakuliEnvironmentClass();

    const mouseApi = actions.createMouseApi(new LegacyProjectProperties());

    let runAsActionSpy = jest.spyOn(actions, "runAsAction");

    it("should scroll down on mouseWheelDown", async () => {

        //GIVEN
        const numberOfSteps = 42;

        //WHEN
        const environment = await sakuliEnvironment.mouseWheelDown(numberOfSteps);

        //THEN
        expect(mouseApi.scrollDown).toBeCalledWith(numberOfSteps);
        expect(environment).toBeInstanceOf(sakuliEnvironmentClass);
        expect(runAsActionSpy).toBeCalledWith(testExecutionContextMock, "mouseWheelDown", any(Function));
    })

    it("should scroll up on mouseWheelUp", async () => {

        //GIVEN
        const numberOfSteps = 42;

        //WHEN
        const environment = await sakuliEnvironment.mouseWheelUp(numberOfSteps);

        //THEN
        expect(mouseApi.scrollUp).toBeCalledWith(numberOfSteps);
        expect(environment).toBeInstanceOf(sakuliEnvironmentClass);
        expect(runAsActionSpy).toBeCalledWith(testExecutionContextMock, "mouseWheelUp", any(Function));
    })
})