import { ContextProvider } from "./runner";
import { ProjectLoader } from "./loader";
import { SakuliExecutionContextProvider } from "./runner/test-execution-context/sakuli-execution-context-provider.class";
import { Forwarder } from "./forwarder/forwarder.interface";

export class SakuliPresetRegistry {

    private _contextProviders: ContextProvider[] = []
    private _projectLoader: ProjectLoader[] = []
    private _forwarder: Forwarder[] = []

    get projectLoaders() {
        return this._projectLoader
    }

    get contextProviders() {
        return this._contextProviders        
    }

    get forwarders() {
        return this._forwarder;
    }

    registerContextProvider(contextProvider: ContextProvider) {
        this._contextProviders.push(contextProvider)
    }    

    registerProjectLoader(projectLoader: ProjectLoader) {
        this._projectLoader.push(projectLoader)
    }

    registerForwarder(forwarder: Forwarder) {
        this._forwarder.push(forwarder);
    }

}