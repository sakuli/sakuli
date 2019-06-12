import {MouseActionApi} from "./mouse-action";
import {KeyboardActionsApi} from "./keyboard-action";
import {FocusActionApi} from "./focus-action";
import {CommonActionsApi} from "./common-action";

export interface ActionApi extends MouseActionApi, KeyboardActionsApi, FocusActionApi, CommonActionsApi {

}