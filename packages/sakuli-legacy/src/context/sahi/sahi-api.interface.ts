import {ActionApi} from "./action/action-api.interface";
import {AccessorApi} from "./accessor/accessor-api.interface";
import {RelationApi} from "./relations";
import {FetchApi} from "./fetch";

export interface SahiApi extends ActionApi, AccessorApi, RelationApi, FetchApi {

    _dynamicInclude(): Promise<void>;

}