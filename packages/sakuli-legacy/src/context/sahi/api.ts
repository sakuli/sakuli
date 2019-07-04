import {ThenableWebDriver} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";
import {accessorApi, AccessorIdentifierAttributes, AccessorUtil} from "./accessor";
import {SahiRelation} from "./relations/sahi-relation.interface";
import {relationsApi, RelationsResolver} from "./relations";
import {SahiElementQueryOrWebElement} from "./sahi-element.interface";
import {actionApi} from "./action";
import {fetchApi} from "./fetch";
import {SahiApi} from "./sahi-api.interface";

export type AccessorIdentifier = number | string | AccessorIdentifierAttributes | RegExp;
export type AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => SahiElementQueryOrWebElement;

export function sahiApi(
    driver: ThenableWebDriver,
    testExecutionContext: TestExecutionContext
): SahiApi {
    const relationResolver = new RelationsResolver(driver, testExecutionContext);
    const accessorUtil = new AccessorUtil(driver, testExecutionContext, relationResolver);
    const action = actionApi(driver, accessorUtil, testExecutionContext);
    const accessor = accessorApi();
    const relations = relationsApi(driver, accessorUtil, testExecutionContext);
    const fetch = fetchApi(driver, accessorUtil, testExecutionContext);
    return ({
        ...action,
        ...accessor,
        ...relations,
        ...fetch,
        _dynamicInclude: (): Promise<void> => Promise.resolve()
    })
}