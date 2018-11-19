import { ContextProvider } from "./runner";
import { ProjectLoader } from "./loader";
import { SakuliExecutionContextProvider } from "./runner/test-execution-context/sakuli-execution-context-provider.class";

export class SakuliPresetRegistry {

    private _contextProviders: ContextProvider[] = []
    private _projectLoader: ProjectLoader[] = []

    get projectLoaders() {
        return this._projectLoader
    }

    get contextProviders() {
        return this._contextProviders        
    }

    registerContextProvider(contextProvider: ContextProvider) {
        this._contextProviders.push(contextProvider)
    }    

    registerProjectLoader(projectLoader: ProjectLoader) {
        this._projectLoader.push(projectLoader)
    }

}