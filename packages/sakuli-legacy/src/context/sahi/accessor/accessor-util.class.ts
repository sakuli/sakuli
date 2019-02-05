import {Locator, ThenableWebDriver, until, WebElement} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";
import {types} from "util";
import {
    AccessorIdentifierAttributesWithSahiIndex,
    isAccessorIdentifierAttributesWithSahiIndex
} from "./accessor-model.interface";
import {RelationsResolver} from "../relations";
import {SahiElementQuery, sahiQueryToString} from "../sahi-element.interface";
import {ifPresent, Maybe} from "@sakuli/commons";
import {AccessorIdentifier} from "../api";

export class AccessorUtil {
    constructor(
        readonly webDriver: ThenableWebDriver,
        readonly testExecutionContext: TestExecutionContext,
        readonly relationResolver: RelationsResolver
    ) {
    }

    get logger() {
        return this.testExecutionContext.logger;
    }

    getElementBySahiIndex(elements: WebElement[], identifier: AccessorIdentifierAttributesWithSahiIndex) {
        return elements[identifier.sahiIndex];
    }

    /**
     * Reads values from potential identifier attributes of an element
     * this is used perform fuzzy string matching on element such as
     * <code>_div('some fuzzy buzzy')</code>
     *
     * The list is ordered by the relevance of the identifier (first match counts)
     *  - [aria-describedby]
     *  - [name]
     *  - [id]
     *  - className
     *  - textContent
     * @param element
     */
    async getStringIdentifiersForElement(element: WebElement) {
        return this.webDriver.executeScript<string[]>(`
            const e = arguments[0];
            return [
                e.getAttribute('aria-describedby'),
                e.getAttribute('name'),
                e.getAttribute('id'),
                e.className,
                e.textContent
            ];
        `, element);
    }

    async getByRegEx(elements: WebElement[], regEx: RegExp) {
        const eAndText: [WebElement, string[]][] = await Promise.all(elements
            .map(async (e): Promise<[WebElement, string[]]> => {
                const potentialMatches: string[] = await this.getStringIdentifiersForElement(e);
                return [e, potentialMatches]
            })
        );
        const e = eAndText.find(([e, potentialMatches]) => {
            const matches = potentialMatches.filter(x => x).map(text => {
                const match = text.match(regEx);
                return match ? match.length > 0 : false
            });
            return !!matches.find(m => !!m);
        });
        return e ? Promise.resolve(e[0]) : Promise.resolve(undefined);
    }

    async findElements(locator: Locator): Promise<WebElement[]> {
        const elements = await this.webDriver.wait(until.elementsLocated(locator), 300);
        const displayedElements: WebElement[] = [];
        for (let element of elements) {
            if(await element.isDisplayed()) {
                displayedElements.push(element);
            }
        }
        return displayedElements;
    }

    private async resolveByIdentifier(elements: WebElement[], identifier: AccessorIdentifier): Promise<Maybe<WebElement>> {
        if (typeof identifier === 'number') {
            return Promise.resolve(this.getElementBySahiIndex(elements, {sahiIndex: identifier}));
        }
        if (isAccessorIdentifierAttributesWithSahiIndex(identifier)) {
            return Promise.resolve(this.getElementBySahiIndex(elements, identifier));
        }
        if (types.isRegExp(identifier)) {
            return this.getByRegEx(elements, identifier);
        }
        if (typeof identifier === 'string') {
            return this.getByRegEx(elements, new RegExp(identifier));
        }
        return Promise.resolve(undefined);
    }

    async fetchElement(query: SahiElementQuery, retry: number = 10): Promise<WebElement> {
        try {
            const {locator, relations, identifier} = query;
            const elements = await this.findElements(locator);
            const elementsAfterRelations = await this.relationResolver.applyRelations(
                elements,
                relations
            );
            const element = await this.resolveByIdentifier(elementsAfterRelations, identifier);
            return ifPresent(element, e => e, () => {
                throw Error('Cannot find Element by query:\n' + sahiQueryToString(query))
            })
        } catch (e) {
            if (retry === 0) throw e;
            return this.fetchElement(query, retry - 1);
        }
    }

}