import { Locator, ThenableWebDriver, until, WebElement } from "selenium-webdriver";
import { TestExecutionContext } from "@sakuli/core";
import { types } from "util";
import {
    AccessorIdentifierAttributes,
    AccessorIdentifierAttributesWithClassName,
    AccessorIdentifierAttributesWithSahiIndex,
    isAccessorIdentifierAttributes,
    isAccessorIdentifierAttributesWithClassName,
    isAccessorIdentifierAttributesWithSahiIndex,
    isAccessorIdentifierAttributesWithText
} from "./accessor-model.interface";
import { RelationsResolver } from "../relations";
import {
    isSahiElementQuery,
    SahiElementQuery,
    SahiElementQueryOrWebElement,
    sahiQueryToString
} from "../sahi-element.interface";
import { ifPresent } from "@sakuli/commons";
import { AccessorIdentifier } from "../api";
import { CHECK_OPEN_REQUESTS, INJECT_SAKULI_HOOK, RESET_OPEN_REQUESTS } from "../action/inject.const";

export class AccessorUtil {

    constructor(
        readonly webDriver: ThenableWebDriver,
        readonly testExecutionContext: TestExecutionContext,
        readonly relationResolver: RelationsResolver
    ) {
    }

    private timeout: number = 3_000;

    setTimeout(timeoutMs: number) {
        this.timeout = timeoutMs;
    }

    getTimeout(): number {
        return this.timeout;
    }

    get logger() {
        return this.testExecutionContext.logger;
    }

    getElementBySahiIndex(elements: WebElement[], identifier: AccessorIdentifierAttributesWithSahiIndex) {
        return elements[identifier.sahiIndex];
    }

    private allValuesInArray(values: string[], hayStack: string[]): boolean {
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
     *  - value
     *  - src
     * @param elements
     */
    async getStringIdentifiersForElement(elements: WebElement[]) {
        return this.webDriver.executeScript<[WebElement, string[]][]>(`
            return (function(element) {
                function getAttributes(e) {
                    return [
                        e.getAttribute('aria-describedby'),
                        e.getAttribute('name'),
                        e.getAttribute('id'),
                        e.className,
                        e.innerText,
                        e.value,
                        e.src
                    ]
                }
                var result = [];
                var elements = arguments[0];
                for(var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    result.push([element, getAttributes(element)]);
                }
                return result;
            })(arguments[0])
        `, elements);
    }

    async getByRegEx(elements: WebElement[], regEx: RegExp): Promise<WebElement[]> {
       const eAndText: [WebElement, string[]][] = await this.getStringIdentifiersForElement(elements);

        return eAndText.filter(([, potentialMatches]) => {
            const matches = potentialMatches.filter(x => x).map(text => {
                const match = text.match(regEx);
                return match ? match.length > 0 : false
            });
            return !!matches.find(m => !!m);
        }).map(([element]) => element);
    }

    async enableHook() {
        await this.webDriver.executeScript(INJECT_SAKULI_HOOK);
    }

    async openRequests(): Promise<number> {
        return this.webDriver.executeScript<number>(CHECK_OPEN_REQUESTS);
    }

    async resetRequests() {
        await this.webDriver.executeScript(RESET_OPEN_REQUESTS);
    }

    async waitForOpenRequests(timeout: number) {
        try {
            await this.webDriver.wait(async () => {
                const openRequest = await this.openRequests();
                return openRequest === 0;
            }, timeout)
        } catch(e) {
            this.testExecutionContext.logger.debug(`Dynamic wait cancelled, reason: ${e}`);
            await this.resetRequests();
        }
    }

    async findElements(locator: Locator): Promise<WebElement[]> {
        try {
            await this.enableHook();
            // TODO Make timeout configurable
            await this.waitForOpenRequests(5000);
        } catch (e) {
            this.testExecutionContext.logger.info(`Dynamic wait not initialised, reason: ${e}`);
        }
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

    async fetchElements(query: SahiElementQuery, waitTimeout: number = this.timeout): Promise<WebElement[]> {
        return this.webDriver.wait<WebElement[]>(async () => {
            const queryAfterRelation = await this.relationResolver.applyRelations(query);
            const elements = await this.findElements(queryAfterRelation.locator);
            const elementsAfterIdentifier = await this.resolveByIdentifier(elements, queryAfterRelation.identifier);
            return  elementsAfterIdentifier.length
                ? elementsAfterIdentifier
                : false
        }, waitTimeout, `Cannot find Element within ${waitTimeout}ms by query:\n${sahiQueryToString(query)}`);

    }

    async fetchElement(query: SahiElementQueryOrWebElement | WebElement, waitTimeout: number = this.timeout): Promise<WebElement> {
        return isSahiElementQuery(query)
            ? this.fetchElements(query, waitTimeout).then(([first]) => first)
            : Promise.resolve(query)
    }

    private isRegExpString(identifier: string) {
        return (identifier.startsWith('/') && identifier.endsWith('/'));
    }

    private normaliseIdentifierString(identifier: string) {
        if (identifier.startsWith('/')) {
            identifier = identifier.substr(1, identifier.length);
        }
        if (identifier.endsWith('/')) {
            identifier = identifier.substr(identifier.length, 1);
        }
        return identifier;
    }

    async getByString(elements: WebElement[], identifier: string): Promise<WebElement[]> {
        const indexRegExp = /.*\[([0-9]+)\]$/;
        const matches = identifier.match(indexRegExp);
        return ifPresent(matches,
            async ([_, indexString]) => {
                identifier = identifier.substr(0, identifier.lastIndexOf('['));
                const elementsByRegExp = await this.getByRegEx(elements, this.stringToRegExp(identifier));
                const element =  elementsByRegExp[Number(indexString)];
                return element ? [element] : [];
            },
            () => this.getByRegEx(elements, this.stringToRegExp(identifier))
        )
    }

    private stringToRegExp(str: string) {
        const isRegEx = this.isRegExpString(str);
        str = this.normaliseIdentifierString(str);
        return new RegExp(isRegEx
            ? str
            : "^\s*" + str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\s*$"
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
