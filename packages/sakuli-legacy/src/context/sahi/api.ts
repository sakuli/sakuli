import {ThenableWebDriver} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";
import {AccessorApi, accessorApi, AccessorIdentifierAttributes, AccessorUtil} from "./accessor";
import {SahiRelation} from "./relations/sahi-relation.interface";
import {RelationApi, relationsApi, RelationsResolver} from "./relations";
import {SahiElementQuery} from "./sahi-element.interface";
import {ActionApiFunction, actionApi} from "./action";
import {fetchApi, FetchApi} from "./fetch/fetch-api.function";

//type SahiElement = WebElement;
type pr_i_AB = [number, number];

export type AccessorIdentifier = number | string | AccessorIdentifierAttributes | RegExp;
export type AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => SahiElementQuery;

export type SahiApi = ActionApiFunction
    & AccessorApi
    & RelationApi
    & FetchApi
    & {_dynamicInclude: () => Promise<void>};

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