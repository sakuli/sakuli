import { ParentApi } from "./parent-api.interface";
import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { SahiRelation } from "./sahi-relation.interface";

export interface RelationApi extends ParentApi {

    _in(anchor: SahiElementQueryOrWebElement): SahiRelation;
    _near(anchor: SahiElementQueryOrWebElement): SahiRelation;
    _under(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;
    _above(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;
    _underOrAbove(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;
    _rightOf(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;
    _leftOf(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;
    _leftOrRightOf(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;

}
