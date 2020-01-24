import { Project, TestExecutionContext } from "@sakuli/core";
import { mockPartial } from "sneer";
import { Application } from "./application.interface";
import { createThenableApplicationClass } from "./thenable-application.class";
import { createThenableRegionClass, Region, ThenableRegion } from "../region";
import { createTestExecutionContextMock } from "../../__mocks__";
import { Type } from "@sakuli/commons";

const defer = <T>(v: T) => Promise.resolve(v);
describe('ThenableApplication', () => {

    const projectMock = new Project(".");
    let ctx: TestExecutionContext;
    let ThenableRegion: Type<ThenableRegion>;
    let ThenableApplication: ReturnType<typeof createThenableApplicationClass>;
    let appMock: Application;
    let regionMock: Region;

    beforeEach(() => {
        ctx = createTestExecutionContextMock();
        ThenableRegion = createThenableRegionClass(ctx, projectMock);
        regionMock = mockPartial<Region>({
            find: jest.fn(() => defer(regionMock))
        });
        ThenableApplication = createThenableApplicationClass(ctx, projectMock);
        appMock = mockPartial<Application>({
            open: jest.fn(() => defer(appMock)),
            getRegion: jest.fn(() => defer(regionMock))
        });
    });

    it('should chain', async () => {
        const r = new ThenableApplication('sakuli', Promise.resolve(appMock));
        await r
            .open()
            .getRegion()
            .find('test');
        expect(appMock.open).toHaveBeenCalled();
        expect(appMock.getRegion).toHaveBeenCalled();
        expect(regionMock.find).toHaveBeenCalledWith('test');
    });
});