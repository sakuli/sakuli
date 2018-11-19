import { SakuliExecutionContextProvider } from "./sakuli-execution-context-provider.class";
import { TestExecutionContext } from "./test-execution-context.class";

describe('SakuliexecutionContextprovider', () => {
    it('should fail getContext if not teared up', () => {
        const ctxProvider = new SakuliExecutionContextProvider();
        expect(() => {
            ctxProvider.getContext()
        }).toThrow();
    });

    it('should fail tearDown if not teared up', () => {
        const ctxProvider = new SakuliExecutionContextProvider();
        expect(() => {
            ctxProvider.tearDown()
        }).toThrow();
    });

    it('should not throw with expected flow', () => {
        expect(() => {
            const ctxProvider = new SakuliExecutionContextProvider();
            ctxProvider.tearUp({} as any);
            ctxProvider.getContext();
            ctxProvider.tearDown();
        }).not.toThrow()
    })

    it('should start execution in TestExecutionContext', () => {
        const ctx = new TestExecutionContext();
        const startExecutionMock = spyOn(ctx, "startExecution")
        const endExecutionMock = spyOn(ctx, "endExecution")
        const mockCreator = jest.fn(() => ctx);
        const ctxProvider = new SakuliExecutionContextProvider(mockCreator);
        const testProject = {} as any; 
        ctxProvider.tearUp(testProject);
        expect(mockCreator).toHaveBeenCalled();
        expect(startExecutionMock).toHaveBeenCalled();
        const result = ctxProvider.getContext();
        expect(result.sakuliContext).toBe(ctx);
        ctxProvider.tearDown();
        expect(endExecutionMock).toHaveBeenCalled();
    })
});
