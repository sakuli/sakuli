import {MouseActionApi} from "./mouse-action";
import {KeyboardActionsApi} from "./keyboard-action";
import {FocusActionApi} from "./focus-action";
import {CommonActionsApi} from "./common-action";

/**
 * Collection of different user-input related actions that can be invoked within a web page during the test.
 *
 * The action API consists of:
 *
 * - {@link MouseActionApi}
 * - {@link KeyboardActionsApi}
 * - {@link FocusActionApi}
 * - {@link CommonActionsApi}
 *
 * All methods of this interface are available as global functions in Sakuli tests.
 *
 */
export interface ActionApi extends MouseActionApi, KeyboardActionsApi, FocusActionApi, CommonActionsApi {

}
