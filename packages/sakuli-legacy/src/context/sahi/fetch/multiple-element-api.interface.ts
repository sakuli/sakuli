import {AccessorFunctions} from "../accessor";
import {AccessorIdentifier} from "../api";
import {SahiRelation} from "../relations/sahi-relation.interface";
import {WebElement} from "selenium-webdriver";

export interface MultipleElementApi {
    _collect(
        accessorApiMethod: AccessorFunctions,
        identifier: AccessorIdentifier,
        ...relations: SahiRelation[]
    ): Promise<WebElement[]>

    _count(
        accessorApiMethod: AccessorFunctions,
        identifier: AccessorIdentifier,
        ...relations: SahiRelation[]
    ): Promise<number>
}