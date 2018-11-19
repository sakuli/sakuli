import { TestExecutionContext } from "../runner/test-execution-context/test-execution-context.class";
import { Project } from "../loader";

export interface Forwarder {
    forward(ctx: TestExecutionContext, project: Project): Promise<any>
}