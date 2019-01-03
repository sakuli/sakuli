import {TestExecutionLifecycleHooks} from "./runner";
import {ProjectLoader} from "./loader";
import {Forwarder} from "./forwarder";
import {CommandModuleProvider} from "./command-module-provider.interface";

export class SakuliPresetRegistry {

    private _contextProviders: TestExecutionLifecycleHooks[] = [];
    private _projectLoader: ProjectLoader[] = [];
    private _forwarder: Forwarder[] = [];
    private _commandModules: CommandModuleProvider[] = [];

    get projectLoaders() {
        return this._projectLoader
    }

    get contextProviders() {
        return this._contextProviders
    }

    get forwarders() {
        return this._forwarder;
    }

    get commandModules() {
        return this._commandModules;
    }

    registerContextProvider(contextProvider: TestExecutionLifecycleHooks) {
        this._contextProviders.push(contextProvider)
    }

    registerProjectLoader(projectLoader: ProjectLoader) {
        this._projectLoader.push(projectLoader)
    }

    registerForwarder(forwarder: Forwarder) {
        this._forwarder.push(forwarder);
    }

    registerCommandModule(commandModule: CommandModuleProvider) {
        this._commandModules.push(commandModule);
    }

}