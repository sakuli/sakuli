import {ActionApi} from "./action/action-api.interface";
import {AccessorApi} from "./accessor/accessor-api.interface";
import {RelationApi} from "./relations";
import {FetchApi} from "./fetch";

export interface SahiApi extends ActionApi, AccessorApi, RelationApi, FetchApi {

    /**
     * A relic from Sakuli v1, that was used load
     *
     * @deprecated
     *
     */
    _dynamicInclude(): Promise<void>;

}