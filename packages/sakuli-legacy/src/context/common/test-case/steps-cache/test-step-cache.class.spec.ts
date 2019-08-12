import {promises as fs} from 'fs';
import {join} from "path";
import {tmpdir} from "os";
import {TestStepCache} from "./test-step-cache.class";
import {mockPartial} from "sneer";
import {TestStepContextCacheMarshaller} from "./test-step-context-cache-marshaller.class";
import {TestStepContext} from "@sakuli/core";
import {stripIndents} from "common-tags";
import {TestStep} from "../__mocks__/test-step.function";

describe('TestStepCache', () => {

    let tmpDir: string;
    let cache: TestStepCache;
    let marshallerMock = mockPartial<TestStepContextCacheMarshaller>({
        marshall: jest.fn(),
        unMarshall: jest.fn()
    });

    beforeEach(async () => {
        tmpDir = await fs.mkdtemp(join(tmpdir(), 'test-step-cache-'));
        cache = new TestStepCache(tmpDir, marshallerMock)
    });

    it('should identify cache as existing when file was written', async () => {
        await expect(cache.exists()).resolves.toBe(false);
        await cache.write([
            new TestStepContext(),
            new TestStepContext(),
            new TestStepContext(),
        ]);
        await expect(cache.exists()).resolves.toBe(true)
    });

    it('should call the marshaller for each teststep when writing', async () => {
        const steps = [
            TestStep('step-1', 100, 200),
            TestStep('step-2', 100, 200),
            TestStep('step-3', 100, 200),
        ];
        await cache.write(steps);
        expect(marshallerMock.marshall).toHaveBeenCalledWith(steps[0]);
        expect(marshallerMock.marshall).toHaveBeenCalledWith(steps[1]);
        expect(marshallerMock.marshall).toHaveBeenCalledWith(steps[2]);
        expect(marshallerMock.marshall).toHaveBeenCalledTimes(3);
    });

    it('should call unmarshaller foreach line in file', async () => {
        await fs.writeFile(cache.cacheFile, stripIndents`
        
        step-1;100;200
        step-2;100;200
        step-3;100;200
        
        `);

        const steps = await cache.read();
        expect(steps.length).toBe(3);
        expect(marshallerMock.unMarshall).toHaveBeenCalledWith('step-1;100;200');
        expect(marshallerMock.unMarshall).toHaveBeenCalledWith('step-2;100;200');
        expect(marshallerMock.unMarshall).toHaveBeenCalledWith('step-3;100;200');
        expect(marshallerMock.unMarshall).toHaveBeenCalledTimes(3);

    });

});