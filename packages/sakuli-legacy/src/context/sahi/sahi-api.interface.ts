import { ActionApi } from "./action/action-api.interface";
import { AccessorApi } from "./accessor/accessor-api.interface";
import { RelationApi } from "./relations";
import { FetchApi } from "./fetch";
import { AssertionApi } from "./assertion";

export interface SahiApi extends ActionApi, AccessorApi, RelationApi, FetchApi, AssertionApi {

    /**
     * A relic from Sakuli v1, that was used load
     *
     * @deprecated
     *
     */
    _dynamicInclude(): Promise<void>;

}