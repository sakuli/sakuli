import {createThenableRegionClass, ThenableRegion} from "./thenable-sakuli-region.class";
import {createTestExecutionContextMock} from "../sahi/__mocks__";
import {TestExecutionContext} from "@sakuli/core";
import {Region} from "./region.interface";
import {mockPartial} from "sneer";

describe('ThenableRegion', () => {

    let ctx: TestExecutionContext;
    let ThenableRegion: ThenableRegion;
    let regionMock: Region;

    beforeEach(() => {
        ctx = createTestExecutionContextMock();
        ThenableRegion = createThenableRegionClass(ctx);
        regionMock = mockPartial<Region>({
            find: jest.fn(() => Promise.resolve(regionMock)),
            mouseMove: jest.fn(() => Promise.resolve(regionMock)),
            click: jest.fn(() => Promise.resolve(regionMock)),
        });
    });

    it('should invoke', async () => {
        const r = new ThenableRegion(0,0,0,0, Promise.resolve(regionMock));
        const region = await r
            .find('test.jpg')
            .mouseMove()
            .click();

        expect(region.find).toHaveBeenCalledWith('test.jpg');
        expect(region.mouseMove).toHaveBeenCalled();
        expect(region.click).toHaveBeenCalled();
    });


});