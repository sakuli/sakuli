import { TestExecutionLifecycleHooks } from "../context-provider.interface";
import { Sakuli } from "../../sakuli.class";

export interface SakuliExecutionContext {
  Sakuli: typeof Sakuli;
}

export function isSakuliExecutionContext(
  ctx: any
): ctx is SakuliExecutionContext {
  return "Sakuli" in ctx && ctx.Sakuli === Sakuli;
}

export class SakuliExecutionContextProvider
  implements TestExecutionLifecycleHooks<SakuliExecutionContext> {
  async requestContext(): Promise<SakuliExecutionContext> {
    return Promise.resolve({ Sakuli: Sakuli });
  }
}
