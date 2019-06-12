import {createThenableRegionClass, ThenableRegion} from "./thenable-sakuli-region.class";
import {createTestExecutionContextMock} from "../sahi/__mocks__";
import {Project, TestExecutionContext} from "@sakuli/core";
import {Region} from "./region.interface";
import {mockPartial} from "sneer";
import {createThenableEnvironmentClass} from "./thenable-environment.class";
import {Environment} from "./environment.interface";
import {Application} from "./application.interface";
import {createThenableApplicationClass} from "./thenable-application.class";

type Resolve<T> = ((v:T)=> Promise<T>);
const defer:Resolve<any> = Promise.resolve.bind(Promise);
describe('ThenableApplication', () => {

    let ctx: TestExecutionContext;
    let ThenableRegion: ThenableRegion;
    let ThenableApplication: ReturnType<typeof createThenableApplicationClass>;
    let appMock: Application;
    let regionMock: Region;

    beforeEach(() => {
        ctx = createTestExecutionContextMock();
        ThenableRegion = createThenableRegionClass(ctx);
        regionMock = mockPartial<Region>({
            find: jest.fn(() => defer(regionMock))
        });
        ThenableApplication = createThenableApplicationClass(ctx);
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
            .find('test')
        expect(appMock.open).toHaveBeenCalled();
        expect(appMock.getRegion).toHaveBeenCalled();
        expect(regionMock.find).toHaveBeenCalledWith('test');
    });

});