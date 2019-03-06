import {ThenableWebDriver, WebElement} from "selenium-webdriver";
import {accessorApi as createAccessorApi, AccessorFunctions, AccessorUtil} from "../accessor";
import {TestExecutionContext} from "@sakuli/core";
import {SahiRelation} from "../relations/sahi-relation.interface";
import {AccessorIdentifier} from "../api";

export type MultipleElementApi = ReturnType<typeof multipleElementApi>;

export function multipleElementApi(
    driver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
) {

    const accessorApi = createAccessorApi();

    async function _collect(
        accessorApiMethod: AccessorFunctions,
        identifier: AccessorIdentifier,
        ...relations: SahiRelation[]
    ): Promise<WebElement[]> {
        const method = accessorApi[accessorApiMethod];
        const query = method(identifier, ...relations);
        ctx.logger.info('Fetching for query', query);
        return accessorUtil.fetchElements(query);
    }

    async function _count(
        accessorApiMethod: AccessorFunctions,
        identifier: AccessorIdentifier,
        ...relations: SahiRelation[]
    ) {
        const {length} = await _collect(accessorApiMethod, identifier, ...relations);
        return length;
    }

    return ({
        _collect,
        _count
    })
}