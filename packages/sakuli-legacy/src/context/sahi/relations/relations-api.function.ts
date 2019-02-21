import {ILocation, ISize, ThenableWebDriver, WebElement} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";
import {RelationProducer, RelationProducerWithOffset} from "./sahi-relation.interface";
import {filterAsync, ifPresent, mapAsync} from "@sakuli/commons";
import {edges} from "./edges.function";
import {isLeftOf, isRightOf} from "./vector2.type";
import {AccessorUtil} from "../accessor";
import {SahiElementQuery} from "../sahi-element.interface";
import {isChildOf} from "../helper/is-child-of.function";
import {distanceBetween} from "../helper/distance-between.function";
import {getSiblingIndex} from "../helper/get-sibling-index.function";
import {getParent} from "../helper/get-parent.function";
import {parentApi} from "./parent-api.function";


interface PositionalInfo {
    location: ILocation,
    size: ISize,
    origin: WebElement
}

export async function positionalInfo(origin: WebElement): Promise<PositionalInfo> {
    const [location, size] = await Promise.all([
        origin.getLocation(),
        origin.getSize()
    ]);
    return ({location, size, origin});
}

export type RelationApi = ReturnType<typeof relationsApi>;

export function relationsApi(
    driver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    testExecutionContext: TestExecutionContext,
) {

    const _in: RelationProducer = (query: SahiElementQuery) => {
        return async (elements: WebElement[]) => {
            const element = await accessorUtil.fetchElement(query);
            const filterChildOf = filterAsync<WebElement>((e: WebElement) => isChildOf(e, element));
            return filterChildOf(elements);
        }
    };

    const _near: RelationProducer = (query: SahiElementQuery) => {
        return async possibleElements => {
            const anchor = await accessorUtil.fetchElement(query,);
            const [
                ...elementDistances
            ] = await Promise
            // For all elements including the anchor it calculates:
            // - the distance to the root (.toRoot)
            // - the index within its own parent (.asSibling)
                .all(possibleElements.map(async element => ({
                    toRoot: await distanceBetween(anchor, element),
                    asSibling: await getSiblingIndex(element),
                    element
                })));
            return elementDistances
                .sort((a, b) => {
                    return a.toRoot === b.toRoot
                        ? a.asSibling - b.asSibling
                        : a.toRoot - b.toRoot
                })
                .map(({element}) => element)
        };
    };

    function createHorizontalRelation(query: SahiElementQuery, offset: number, predicate: (anchor: PositionalInfo, fittingElement: PositionalInfo) => boolean) {
        return async (elements: WebElement[]) => {
            const element = await accessorUtil.fetchElement(query);
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
                    return positionals
                        .filter(pi => predicate(anchor, pi))
                        .slice(offset)
                        .map((p: PositionalInfo) => p.origin);

                }, async () => Promise.resolve([]))
        }
    }

    function createVerticalRelation(query: SahiElementQuery, offset: number, predicate: (anchor: PositionalInfo, fittingElement: PositionalInfo) => boolean) {
        return async (elements: WebElement[]) => {
            const element = await accessorUtil.fetchElement(query);
            const anchor = await positionalInfo(element);
            const positionals = await mapAsync(positionalInfo)(elements);
            return positionals
                .filter(pi => predicate(anchor, pi))
                .slice(offset)
                .map(({origin}) => origin)
        }
    }


    const _under: RelationProducerWithOffset = (query: SahiElementQuery, offset: number = 0) => {
        return createVerticalRelation(query, offset, (a, b) => {
            const edgesA = edges(a);
            const edgesB = edges(b);
            return edgesB.isUnder(edgesA) && edgesB.intersectsVertical(edgesA);
        })
    };

    const _above: RelationProducerWithOffset = (query: SahiElementQuery, offset: number = 0) => {
        return createVerticalRelation(query, offset, (a, b) => {
            const edgesA = edges(a);
            const edgesB = edges(b);
            return edgesB.isAbove(edgesA) && edgesB.intersectsVertical(edgesA);
        })
    };

    const _underOrAbove: RelationProducerWithOffset = (query: SahiElementQuery, offset: number = 0) => {
        return createVerticalRelation(query, offset, (a, b) => {
            const edgesA = edges(a);
            const edgesB = edges(b);
            return (edgesB.isAbove(edgesA) || edgesB.isUnder(edgesA)) && edgesB.intersectsVertical(edgesA);
        })
    }

    const _rightOf: RelationProducerWithOffset = (query: SahiElementQuery, offset = 0) => {
        return createHorizontalRelation(query, offset, (a, b) => isRightOf(edges(a).center, edges(b).center));
    };

    const _leftOf: RelationProducerWithOffset = (query: SahiElementQuery, offset = 0) => {
        return createHorizontalRelation(query, offset, (a, b) => isLeftOf(edges(a).center, edges(b).center));
    };

    const _leftOrRightOf: RelationProducerWithOffset = (query: SahiElementQuery, offset: number = 0) => {
        return createHorizontalRelation(
            query,
            offset,
            (a, b) => isRightOf(edges(a).center, edges(b).center) || isLeftOf(edges(a).center, edges(b).center)
        )
    };

    const {
        _parentNode
    } = parentApi(driver, accessorUtil, testExecutionContext);

    return ({
        _parentNode,
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