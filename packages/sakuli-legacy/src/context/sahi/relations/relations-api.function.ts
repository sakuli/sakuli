import {By, ILocation, ISize, ThenableWebDriver, WebElement} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";
import {RelationProducer, RelationProducerWithOffset, SahiRelation} from "./sahi-relation.interface";
import {ifPresent, mapAsync} from "@sakuli/commons";
import {edges} from "./edges.function";
import {isLeftOf, isRightOf} from "./vector2.type";
import {AccessorUtil} from "../accessor";
import {SahiElementQuery, SahiElementQueryOrWebElement} from "../sahi-element.interface";
import {isChildOf} from "../helper/is-child-of.function";
import {distanceBetween} from "../helper/distance-between.function";
import {getSiblingIndex} from "../helper/get-sibling-index.function";
import {getParent} from "../helper/get-parent.function";
import {parentApi} from "./parent-api.function";
import {PositionalInfo, positionalInfo} from "./positional-info.function";
import { RelationApi } from "./relations-api.interface";

export function relationsApi(
    driver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    testExecutionContext: TestExecutionContext,
): RelationApi {
    const NULL_QUERY = {locator: By.js(`return []`), relations: [], identifier: new RegExp('')};

    function webElementsToQuery(elements: WebElement[]) {
        return ({
            locator: By.js(`return arguments[0]`, elements),
            relations: [],
            identifier: RegExp('.*')
        })
    }

    function fetchWithoutRelations(query: SahiElementQuery) {
        return accessorUtil.fetchElements({
            locator: query.locator,
            identifier: query.identifier,
            relations: []
        });
    }

    const _in: RelationProducer = (parentQuery: SahiElementQueryOrWebElement) => {
        return async (elementsQuery: SahiElementQuery) => { // assume elements is as query
            const parentElement = await accessorUtil.fetchElement(parentQuery);
            const elementsInParent = await parentElement.findElements(elementsQuery.locator);
            const elementsByIdentifier = await accessorUtil.resolveByIdentifier(elementsInParent, elementsQuery.identifier)
            /*
            return (await Promise.all(elements.map(async e => isChildOf(e, parentElement) ? e : null)))
                .filter((e): e is WebElement => e != null)
                */
            return webElementsToQuery(elementsByIdentifier);
        }
    };

    const _near: RelationProducer = (query: SahiElementQueryOrWebElement) => {
        return async possibleElementsQuery => {
            const possibleElements = await fetchWithoutRelations(possibleElementsQuery);
            const anchor = await accessorUtil.fetchElement(query);
            const [
                ...elementDistances
            ] = await Promise
                .all(possibleElements.map(async element => ({
                    toRoot: await distanceBetween(anchor, element),
                    asSibling: await getSiblingIndex(element),
                    element
                })));
            const nearElements = elementDistances
                .sort((a, b) => {
                    return a.toRoot === b.toRoot
                        ? a.asSibling - b.asSibling
                        : a.toRoot - b.toRoot
                })
                .map(({element}) => element);
            return webElementsToQuery(nearElements);
        };
    };

    function createHorizontalRelation(query: SahiElementQueryOrWebElement, offset: number, predicate: (anchor: PositionalInfo, fittingElement: PositionalInfo) => boolean): SahiRelation {
        return async (elementsQuery) => {
            const element = await accessorUtil.fetchElement(query);
            const elements = await fetchWithoutRelations(elementsQuery);
            return ifPresent(await getParent(element),
                async p => {
                    const anchorSiblings: WebElement[] = [];
                    for (const e of elements) {
                        if (await isChildOf(e, p)) {
                            anchorSiblings.push(e);
                        }
                    }
                    const anchor = await positionalInfo(element);
                    const positionals = await mapAsync(positionalInfo)(anchorSiblings);
                    const relatedElements = positionals
                        .filter(pi => predicate(anchor, pi))
                        .slice(offset)
                        .map((p: PositionalInfo) => p.origin);
                    return webElementsToQuery(relatedElements);

                }, async () => Promise.resolve(NULL_QUERY))
        }
    }

    function createVerticalRelation(query: SahiElementQueryOrWebElement, offset: number, predicate: (anchor: PositionalInfo, fittingElement: PositionalInfo) => boolean): SahiRelation {
        return async (elementsQuery) => {
            const element = await accessorUtil.fetchElement(query);
            const elements = await fetchWithoutRelations(elementsQuery);
            const anchor = await positionalInfo(element);
            const positionals = await mapAsync(positionalInfo)(elements);
            const relatedElements = positionals
                .filter(pi => predicate(anchor, pi))
                .slice(offset)
                .map(({origin}) => origin);
            return webElementsToQuery(relatedElements);
        }
    }


    const _under: RelationProducerWithOffset = (query: SahiElementQueryOrWebElement, offset: number = 0) => {
        return createVerticalRelation(query, offset, (a, b) => {
            const edgesA = edges(a);
            const edgesB = edges(b);
            return edgesB.isUnder(edgesA) && (edgesB.intersectsVertical(edgesA) || edgesA.intersectsVertical(edgesB));
        })
    };

    const _above: RelationProducerWithOffset = (query: SahiElementQueryOrWebElement, offset: number = 0) => {
        return createVerticalRelation(query, offset, (a, b) => {
            const edgesA = edges(a);
            const edgesB = edges(b);
            return edgesB.isAbove(edgesA) && (edgesB.intersectsVertical(edgesA) || edgesA.intersectsVertical(edgesB));
        })
    };

    const _underOrAbove: RelationProducerWithOffset = (query: SahiElementQueryOrWebElement, offset: number = 0) => {
        return createVerticalRelation(query, offset, (a, b) => {
            const edgesA = edges(a);
            const edgesB = edges(b);
            return (edgesB.isAbove(edgesA) || edgesB.isUnder(edgesA)) && edgesB.intersectsVertical(edgesA);
        })
    }

    const _rightOf: RelationProducerWithOffset = (query: SahiElementQueryOrWebElement, offset = 0) => {
        return createHorizontalRelation(query, offset, (a, b) => isRightOf(edges(a).center, edges(b).center));
    };

    const _leftOf: RelationProducerWithOffset = (query: SahiElementQueryOrWebElement, offset = 0) => {
        return createHorizontalRelation(query, offset, (a, b) => isLeftOf(edges(a).center, edges(b).center));
    };

    const _leftOrRightOf: RelationProducerWithOffset = (query: SahiElementQueryOrWebElement, offset: number = 0) => {
        return createHorizontalRelation(
            query,
            offset,
            (a, b) => isRightOf(edges(a).center, edges(b).center) || isLeftOf(edges(a).center, edges(b).center)
        )
    };

    const {
        _parentNode,
        _parentCell,
        _parentRow,
        _parentTable
    } = parentApi(driver, accessorUtil, testExecutionContext);

    return ({
        _parentNode,
        _parentCell,
        _parentRow,
        _parentTable,
        _in,
        _near,
        _rightOf,
        _leftOf,
        _leftOrRightOf,
        _under,
        _above,
        _underOrAbove
    })
}
