import { ButtonRegistry } from "./button-registry";
import { KeyboardApi, MouseApi } from "./actions";

export async function releaseKeys(
  registry: ButtonRegistry,
  mouseApi: MouseApi,
  keyboardApi: KeyboardApi
) {
  await keyboardApi.releaseKey(registry.keyboard);
  registry.mouse.forEach((key) => mouseApi.releaseButton(key));
}
