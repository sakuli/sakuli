import {By, ILocation, ISize, WebDriver, WebElement} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";
import {RelationProducer, RelationProducerWithOffset} from "./sahi-relation.interface";
import {elementIntersection, isEqual} from "../selenium-utils.function";
import {filterAsync, fromArray, ifPresent, mapAsync, switchFilter, toArray} from "@sakuli/commons";
import {edges} from "./edges.function";
import {isLeftOf, isRightOf} from "./vector2.type";

export async function getParent(element: WebElement) {
    try {
        return await element.findElement(By.xpath('..'));
    } catch (e) {
        return null;
    }
}

export async function isChildOf(child: WebElement, potentialParent: WebElement): Promise<boolean> {
    return ifPresent(await getParent(child), async parent => {
            if (await isEqual(potentialParent, parent)) {
                return true;
            } else {
                return isChildOf(parent, potentialParent);
            }
        },
        () => Promise.resolve(false)
    )
}


export async function getSiblings(element: WebElement): Promise<WebElement[]> {
    return element.findElements(By.xpath('../*'));
}

interface PositionalInfo {
    location: ILocation,
    size: ISize,
    origin: WebElement
}

async function positionalInfo(origin: WebElement): Promise<PositionalInfo> {
    // Somehow types are not updated: But getRect is the correct
    // way to get the dimension and position of an element
    // https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebElement.html#getRect
    const {width, height, x, y} = await (origin as any).getRect();
    return ({location: {x, y}, size: {width, height}, origin});
}

export function relationsApi(
    driver: WebDriver,
    testExecutionContext: TestExecutionContext
) {

    const _in: RelationProducer = (parent: WebElement) => {
        const filterChildOf = filterAsync<WebElement>((e: WebElement) => isChildOf(e, parent));
        return async (elements: WebElement[]) => {
            return filterChildOf(elements);
        }
    };

    const _near: RelationProducer = (parent: WebElement) => {
        return async e => {
            return Promise.resolve(e);
        };
    };


    const _rightOf: RelationProducerWithOffset = (element, offset = 0) => {
        return async elements => {
            return ifPresent(await getParent(element),
                async p => {
                    const anchorSiblings: WebElement[] = await toArray(
                        switchFilter<WebElement>(async (e: WebElement) => await isChildOf(e, p))(fromArray(elements))
                    );
                    const anchor = await positionalInfo(element);
                    const positionals = await mapAsync(positionalInfo)(anchorSiblings);
                    return positionals
                        .filter((e: PositionalInfo) => isRightOf(edges(anchor).center, edges(e).center))
                        .slice(offset)
                        .map((p: PositionalInfo) => p.origin);

                }, async () => Promise.resolve([]))
        }
    };

    const _leftOf: RelationProducerWithOffset = (element, offset = 0) => {
        return async elements => {
            return ifPresent(await getParent(element),
                async p => {
                    const anchorSiblings: WebElement[] = await toArray(
                        switchFilter<WebElement>(async (e: WebElement) => await isChildOf(e, p))(fromArray(elements))
                    );
                    const anchor = await positionalInfo(element);
                    const positionals = await mapAsync(positionalInfo)(anchorSiblings);
                    return positionals
                        .filter((e: PositionalInfo) => isLeftOf(edges(anchor).center, edges(e).center))
                        .slice(offset)
                        .map((p: PositionalInfo) => p.origin);

                }, async () => Promise.resolve([]))
        }
    };


    return ({
        _in,
        _near,
        _rightOf,
        _leftOf
    })
}