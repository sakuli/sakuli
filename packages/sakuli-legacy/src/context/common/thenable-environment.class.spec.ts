import {createThenableRegionClass, ThenableRegion} from "./thenable-sakuli-region.class";
import {createTestExecutionContextMock} from "../sahi/__mocks__";
import {Project, TestExecutionContext} from "@sakuli/core";
import {Region} from "./region.interface";
import {mockPartial} from "sneer";
import {createThenableEnvironmentClass} from "./thenable-environment.class";
import {Environment} from "./environment.interface";

describe('ThenableEnvironment', () => {

    let ctx: TestExecutionContext;
    let ThenableRegion: ThenableRegion;
    let ThenableEnvironment: ReturnType<typeof createThenableEnvironmentClass>;
    let envMock: Environment;
    let regionMock: Region;

    beforeEach(() => {
        ctx = createTestExecutionContextMock();
        ThenableRegion = createThenableRegionClass(ctx);
        regionMock = mockPartial<Region>({
            find: jest.fn(() => Promise.resolve(regionMock))
        });
        ThenableEnvironment = createThenableEnvironmentClass(ctx, mockPartial<Project>({}));
        envMock = mockPartial<Environment>({
            getRegionFromFocusedWindow: jest.fn(() => Promise.resolve(regionMock))

        });
    });

    it('should invoke', async () => {
        const r = new ThenableEnvironment(Promise.resolve(envMock));
        await r
            .getRegionFromFocusedWindow()
            .find('test')

        expect(envMock.getRegionFromFocusedWindow).toHaveBeenCalled();
        expect(regionMock.find).toHaveBeenCalledWith('test');

    });


});