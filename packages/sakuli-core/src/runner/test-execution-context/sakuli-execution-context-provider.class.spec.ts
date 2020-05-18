import { SakuliExecutionContextProvider } from "./sakuli-execution-context-provider.class";
import { Sakuli } from "../../sakuli.class";

describe("SakuliExecutionContextProvider", () => {
  it("should inject Sakuli factory function", async () => {
    const secp = new SakuliExecutionContextProvider();
    return expect(secp.requestContext()).resolves.toEqual(
      expect.objectContaining({
        Sakuli,
      })
    );
  });
});
