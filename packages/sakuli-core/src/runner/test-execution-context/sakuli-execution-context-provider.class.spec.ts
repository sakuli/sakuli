import { SakuliExecutionContextProvider } from "./sakuli-execution-context-provider.class";
import { TestExecutionContext } from "./test-execution-context.class";
import {Sakuli} from "../../sakuli.class";

describe('SakuliExecutionContextProvider', () => {
    it('should inject Sakuli factory function', () => {
        const secp = new SakuliExecutionContextProvider();
        expect(secp.requestContext()).toEqual(expect.objectContaining({
            Sakuli
        }))
    });
});
