import { SakuliPresetRegistry } from "./sakuli-preset-registry.class";

export interface SakuliPresetProvider {
  (registry: SakuliPresetRegistry): void;
}
