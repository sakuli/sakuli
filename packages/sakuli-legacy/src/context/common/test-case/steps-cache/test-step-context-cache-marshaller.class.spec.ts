import {TestStepContextCacheMarshaller} from "./test-step-context-cache-marshaller.class";
import {TestStepContext} from "@sakuli/core";

describe('TestStepContextCacheMarshaller', () => {

    let marshaller: TestStepContextCacheMarshaller;
    beforeEach(() => {
        marshaller = new TestStepContextCacheMarshaller();
    });

    it('should marshall', () => {
        const step  =new TestStepContext();
        step.id = 'Test';
        step.warningTime = 100;
        step.criticalTime = 200;
        const marshaled = marshaller.marshall(step);
        expect(marshaled).toEqual("Test;100;200");
    });

    it('should unmarshall', () => {
        const unMarshaled = marshaller.unMarshall("Test;100;200");
        expect(unMarshaled).toEqual({
            id: 'Test',
            warningTime: 100,
            criticalTime: 200
        })
    });

});