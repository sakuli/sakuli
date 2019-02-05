import {promise, WebElement} from "selenium-webdriver";
import {compose, fromPromises, intersect, map, toArray} from "@sakuli/commons";


export async function elementIntersection(a: WebElement[], b: WebElement[]): Promise<WebElement[]> {
    const toIdElementTuple = async (e: WebElement): Promise<[string, WebElement]> => [await e.getId(), e];
    return toArray(
        compose(
            intersect<[string, WebElement]>(
                fromPromises(a.map(toIdElementTuple)),
                (([idA],[idB]) => idA === idB)
            ),
            map(([_, e]) => e)
        )(fromPromises(b.map(toIdElementTuple)))
    );
}