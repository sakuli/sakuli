import {Locator, ThenableWebDriver, until, WebElement} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";
import {types} from "util";
import {
    AccessorIdentifierAttributes,
    AccessorIdentifierAttributesWithClassName,
    AccessorIdentifierAttributesWithSahiIndex,
    isAccessorIdentifierAttributes,
    isAccessorIdentifierAttributesWithClassName,
    isAccessorIdentifierAttributesWithSahiIndex,
    isAccessorIdentifierAttributesWithText
} from "./accessor-model.interface";
import {RelationsResolver} from "../relations";
import {
    isSahiElementQuery,
    SahiElementQuery,
    SahiElementQueryOrWebElement,
    sahiQueryToString
} from "../sahi-element.interface";
import {ifPresent} from "@sakuli/commons";
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

    private allValuesInArray(values: string[], hayStack: string[]): boolean {
        const matches: WebElement[] = [];
        return values.every(v => hayStack.includes(v));
    }

    async getElementBySahiClassName(elements: WebElement[], {className}: AccessorIdentifierAttributesWithClassName) {
        const matches: WebElement[] = [];
        for (let element of elements) {
            const elementClasses = ((await element.getAttribute("class")) || "").split(" ");
            const identifierClasses = className.split(" ");
            if (this.allValuesInArray(identifierClasses, elementClasses)) {
                matches.push(element)
            }
        }
        return matches;
    }

    /**
     * Reads values from potential identifier attributes of an element
     * this is used to perform fuzzy string matching on element such as
     * <code>_div('some fuzzy buzzy')</code>
     *
     * The list is ordered by the relevance of the identifier (first match counts)
     *  - [aria-describedby]
     *  - [name]
     *  - [id]
     *  - className
     *  - innerText
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
                e.innerText
            ];
        `, element);
    }

    async getByRegEx(elements: WebElement[], regEx: RegExp): Promise<WebElement[]> {
        const eAndText: [WebElement, string[]][] = await Promise.all(elements
            .map(async (e): Promise<[WebElement, string[]]> => {
                const potentialMatches: string[] = await this.getStringIdentifiersForElement(e);
                return [e, potentialMatches]
            })
        );
        return eAndText.filter(([e, potentialMatches]) => {
            const matches = potentialMatches.filter(x => x).map(text => {
                const match = text.match(regEx);
                return match ? match.length > 0 : false
            });
            return !!matches.find(m => !!m);
        }).map(([element]) => element);
    }

    async findElements(locator: Locator): Promise<WebElement[]> {
        try {
            return await this.webDriver.wait(until.elementsLocated(locator), 3000);
        } catch (e) {
            return Promise.resolve([]);
        }
    }

    async resolveByIdentifier(elements: WebElement[], identifier: AccessorIdentifier): Promise<WebElement[]> {
        if (isAccessorIdentifierAttributes(identifier)) {
            return await this.getElementsByAccessorIdentifier(elements, identifier);
        }
        if (typeof identifier === 'number') {
            return Promise.resolve([this.getElementBySahiIndex(elements, {sahiIndex: identifier})]);
        }
        if (types.isRegExp(identifier)) {
            return this.getByRegEx(elements, identifier);
        }
        if (typeof identifier === 'string') {
            return this.getByString(elements, identifier);
        }
        return Promise.resolve([]);
    }

    async fetchElements(query: SahiElementQuery, retry: number = 10): Promise<WebElement[]> {
        try {
            /*
            const {locator, relations, identifier} = query;
            const elements = await this.findElements(locator);
            this.logger.info(`Found ${elements.length} in fetchElements`);
            this.logger.info(`Apply ${relations.length} relations`);
            const elementsAfterIdentifier = await this.resolveByIdentifier(elements, identifier);
            const element= await this.relationResolver.applyRelations(
                elementsAfterIdentifier,
                [
                    ...relations
                ]
            );
            return ifPresent(element, e => e, () => {
                throw Error('Cannot find Element by query:\n' + sahiQueryToString(query))
            })
            */
            const queryAfterRelation = await this.relationResolver.applyRelations(query);
            const elements = await this.findElements(queryAfterRelation.locator);
            const elementsAfterIdentifier = this.resolveByIdentifier(elements, queryAfterRelation.identifier);
            return ifPresent(elementsAfterIdentifier, e => e, () => {
                throw Error('Cannot find Element by query:\n' + sahiQueryToString(query))
            })

        } catch (e) {
            if (retry === 0) throw e;
            return this.fetchElements(query, retry - 1);
        }
    }

    async fetchElement(query: SahiElementQueryOrWebElement | WebElement, ignoreDefaults: boolean = false, retry: number = 10): Promise<WebElement> {
        return isSahiElementQuery(query)
            ? this.fetchElements(query, retry).then(([first]) => first)
            : Promise.resolve(query)
    }

    async getByString(elements: WebElement[], identifier: string): Promise<WebElement[]> {
        if (identifier.startsWith('/')) {
            identifier = identifier.substr(1, identifier.length);
        }
        if (identifier.endsWith('/')) {
            identifier = identifier.substr(identifier.length, 1);
        }
        const escape = !(identifier.startsWith('/') && identifier.endsWith('/'));
        const indexRegExp = /.*\[([0-9]+)\]$/;
        const matches = identifier.match(indexRegExp);
        return ifPresent(matches,
            async ([_, index]) => {
                identifier = identifier.substr(0, identifier.lastIndexOf('['));
                const elementsByRegExp = await this.getByRegEx(elements, this.stringToRegExp(identifier, escape));
                return [elementsByRegExp[Number(index)]];
            },
            () => this.getByRegEx(elements, this.stringToRegExp(identifier, escape))
        )
    }

    private stringToRegExp(str: string, escape: boolean = true) {
        return new RegExp(escape
            ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            : str
        );
    }

    private async getElementsByAccessorIdentifier(elements: WebElement[], identifier: AccessorIdentifierAttributes): Promise<WebElement[]> {
        if (isAccessorIdentifierAttributesWithClassName(identifier)) {
            elements = await this.getElementBySahiClassName(elements, identifier);
        }
        if (isAccessorIdentifierAttributesWithText(identifier)) {
            elements = types.isRegExp(identifier.sahiText)
                ? await this.getByRegEx(elements, identifier.sahiText)
                : await this.getByString(elements, identifier.sahiText);
        }
        if (isAccessorIdentifierAttributesWithSahiIndex(identifier)) {
            elements = [this.getElementBySahiIndex(elements, identifier)];
        }
        return elements;
    }
}