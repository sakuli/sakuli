export interface SakuliBootstrapOptions {
  /**
   * List of importable modules
   * This could be an local module like <code>'./module-to-import'</code>
   * as well as an (globally) installed module lik <code>'module-from-npm'</code>
   *
   * All modules must export a function which implements {@link SakuliPresetProvider} as <strong>default</strong>
   */
  presetProvider: string[];
}

export const SakuliBootstrapDefaults = {
  presetProvider: ["@sakuli/legacy"],
};
