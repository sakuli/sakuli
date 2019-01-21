import {By, Locator, ThenableWebDriver, until, WebElement} from "selenium-webdriver";
import {stripIndents} from "common-tags";
import {Maybe} from "@sakuli/commons";
import {TestExecutionContext} from "@sakuli/core";
import {throwIfAbsent} from "@sakuli/commons";
import {AccessorIdentifierAttributes} from "./accessor/accessor-model.interface";
import {AccessorUtil} from "./accessor/accessor-util.class";
import {SahiRelation} from "./relations/sahi-relation.interface";
import {RelationsResolver} from "./relations/relations-resolver.class";

type SahiElement = WebElement;
type pr_i_AB = [number, number];

export type AccessorIdentifier = number | string | AccessorIdentifierAttributes | RegExp;
export type AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => Promise<Maybe<SahiElement>>;


export class SahiApi {
    _navigateTo = async (url: string, forceReload: boolean = false): Promise<any> => {
        await this.webDriver.get(url);
        if (forceReload) {
            await this.webDriver.navigate().refresh()
        }
    };
    _wait = async (millis: number): Promise<void> => {

        return new Promise<void>((res, rej) => {
            setTimeout(() => res(), millis);
        });
    };
    _highlight = async (element: Maybe<SahiElement>, timeoutMs: number = 2000): Promise<void> => {
        throwIfAbsent(element, Error('No element to highlight found'));
        const oldBorder = await this.webDriver.executeScript(stripIndents`
            const oldBorder = arguments[0].style.border;
            arguments[0].style.border = '2px solid red'
            return oldBorder;
        `, element);
        await new Promise<void>((res, rej) => {
            setTimeout(res, timeoutMs);
        });
        await this.webDriver.executeScript(stripIndents`
            const oldBorder = arguments[1];
            arguments[0].style.border = oldBorder
        `, element, oldBorder)

    };
    _dynamicInclude = async (path: string) => {
        return Promise.resolve();
    }
    _password: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="password"]'),
            identifier, ...relations
        );
    };
    _textbox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="text"]'),
            identifier, ...relations
        );
    };
    _hidden: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="hidden"]'),
            identifier, ...relations
        );
    };
    _datebox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="date"]'),
            identifier, ...relations
        );
    };
    _datetimebox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="datetime"]'),
            identifier, ...relations
        );
    };
    _datetimelocalbox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="datetime-local"]'),
            identifier, ...relations
        );
    };
    _emailbox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="email"]'),
            identifier, ...relations
        );
    };
    _monthbox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="month"]'),
            identifier, ...relations
        );
    };
    _numberbox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="number"]'),
            identifier, ...relations
        );
    };
    _rangebox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="range"]'),
            identifier, ...relations
        );
    };
    _searchbox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="search"]'),
            identifier, ...relations
        );
    };
    _telephonebox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="tel"]'),
            identifier, ...relations
        );
    };
    _timebox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="time"]'),
            identifier, ...relations
        );
    };
    _urlbox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="url"]'),
            identifier, ...relations
        );
    };
    _weekbox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="week"]'),
            identifier, ...relations
        );
    };
    _textarea: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('textarea'),
            identifier, ...relations
        );
    };
    _button: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('button'),
            identifier, ...relations
        )
    };
    _checkbox: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="checkbox"]'),
            identifier, ...relations
        );
    };
    _radio: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="radio"]'),
            identifier, ...relations
        );
    };
    _submit: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="submit"]'),
            identifier, ...relations
        );
    };
    _reset: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="reset"]'),
            identifier, ...relations
        );
    };
    _imageSubmitButton: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="image"]'),
            identifier, ...relations
        );
    };
    _select: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('select'),
            identifier, ...relations
        );
    };
    _option: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('option'),
            identifier, ...relations
        );
    };
    _file: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="file"]'),
            identifier, ...relations
        );
    };
    _table: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('table'),
            identifier, ...relations
        );
    };
    _row: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('tr'),
            identifier, ...relations
        );
    };
    _cell: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('td'),
            identifier, ...relations
        );
    };
    _tableHeader: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('th'),
            identifier, ...relations
        );
    };
    _link: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('a'),
            identifier, ...relations
        );
    };
    _image: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('img'),
            identifier, ...relations
        );
    };
    _label: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('label'),
            identifier, ...relations
        );
    };
    _listItem: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('li'),
            identifier, ...relations
        );
    };
    _list: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('ul'),
            identifier, ...relations
        );
    };
    _div: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('div'),
            identifier, ...relations
        )
    };
    _span: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('span'),
            identifier, ...relations
        );
    };
    _fieldset: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('fieldset'),
            identifier, ...relations
        );
    };
    _heading1: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('h1'),
            identifier, ...relations
        );
    };
    _heading2: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('h2'),
            identifier, ...relations
        );
    };
    _heading3: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('h3'),
            identifier, ...relations
        );
    };
    _heading4: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('h4'),
            identifier, ...relations
        );
    };
    _heading5: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('h5'),
            identifier, ...relations
        );
    };
    _heading6: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('h6'),
            identifier, ...relations
        );
    };
    _area: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('area'),
            identifier, ...relations
        );
    };
    _map: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('map'),
            identifier, ...relations
        );
    };
    _paragraph: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('p'),
            identifier, ...relations
        );
    };
    _italic: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('i'),
            identifier, ...relations
        );
    };
    _emphasis: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('em'),
            identifier, ...relations
        );
    };
    _bold: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('b'),
            identifier, ...relations
        );
    };
    _strong: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('strong'),
            identifier, ...relations
        );
    };
    _preformatted: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('pre'),
            identifier, ...relations
        );
    };
    _code: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('code'),
            identifier, ...relations
        );
    };
    _blockquote: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('blockqoute'),
            identifier, ...relations
        );
    };
    _canvas: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('canvas'),
            identifier, ...relations
        );
    };
    _abbr: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('abbr'),
            identifier, ...relations
        );
    };
    _hr: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('hr'),
            identifier, ...relations
        );
    };
    _iframe: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('iframe'),
            identifier, ...relations
        );
    };
    _frame: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('frame'),
            identifier, ...relations
        );
    };
    _object: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('object'),
            identifier, ...relations
        );
    };
    _embed: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('embed'),
            identifier, ...relations
        );
    };
    _dList: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('dl'),
            identifier, ...relations
        );
    };
    _dTerm: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('dt'),
            identifier, ...relations
        );
    };
    _dDesc: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('dd'),
            identifier, ...relations
        );
    };
    _font: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('font'),
            identifier, ...relations
        );
    };
    _svg_rect: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('rect'),
            identifier, ...relations
        );
    };
    _svg_tspan: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('tspan'),
            identifier, ...relations
        );
    };
    _svg_circle: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('circle'),
            identifier, ...relations
        );
    };
    _svg_ellipse: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('ellipse'),
            identifier, ...relations
        );
    };
    _svg_line: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('line'),
            identifier, ...relations
        );
    };
    _svg_polygon: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('polygon'),
            identifier, ...relations
        );
    };
    _svg_polyline: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('polyline'),
            identifier, ...relations
        );
    };
    _svg_path: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('path'),
            identifier, ...relations
        );
    };
    _svg_text: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('text'),
            identifier, ...relations
        );
    };
    _article: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('article'),
            identifier, ...relations
        );
    };
    _aside: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('aside'),
            identifier, ...relations
        );
    };
    _details: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('details'),
            identifier, ...relations
        );
    };
    _figcaption: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('figcaption'),
            identifier, ...relations
        );
    };
    _figure: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('figure'),
            identifier, ...relations
        );
    };
    _footer: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('footer'),
            identifier, ...relations
        );
    };
    _header: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('header'),
            identifier, ...relations
        );throw Error('Not yet implemented _header')
    };
    _main: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('main'),
            identifier, ...relations
        );
    };
    _mark: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('mark'),
            identifier, ...relations
        );
    };
    _nav: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('nav'),
            identifier, ...relations
        );
    };
    _section: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('section'),
            identifier, ...relations
        );
    };
    _summary: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('summary'),
            identifier, ...relations
        );
    };
    _time: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('input[type="time"]'),
            identifier, ...relations
        );
    };
    _video: AccessorFunction = async (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        return this.getElement(
            By.css('video'),
            identifier, ...relations
        );
    };
    _click = async (maybeElement: Maybe<SahiElement>, combo?: string): Promise<SahiElement> => {
        const e = throwIfAbsent(maybeElement, Error('No element specified to click'));
        await e.click();
        return e;
    };
    _setValue = async (e: Maybe<SahiElement>, value: string) => {
        throwIfAbsent(e, Error('cannot set value on a null reference'));
        return await this.webDriver.executeScript(`
            const ele = arguments[0];
            const value = arguments[1];
            ele.setAttribute('value', value);
        `, e, value)
    };
    private accessorUtil: AccessorUtil = new AccessorUtil(
        this.webDriver,
        this.testExecutionContext,
        new RelationsResolver(
            this.webDriver,
            this.testExecutionContext
        )
    );

    constructor(
        readonly webDriver: ThenableWebDriver,
        readonly testExecutionContext: TestExecutionContext
    ) {
    }

    _activeElement(): SahiElement {
        throw Error('Not yet implemented _activeElement')
    };

    _byId(id: string): SahiElement {
        throw Error('Not yet implemented _byId')
    };

    _byText(text: string, tagName: string): SahiElement {
        throw Error('Not yet implemented _byText')
    };

    _byClassName(className: string, tagName: string, ...relations: SahiRelation[]): SahiElement {
        throw Error('Not yet implemented _byClassName')
    };

    _byXPath(xpath: string): SahiElement {
        throw Error('Not yet implemented _byXPath')
    };

    _accessor(accessor: string): SahiElement {
        throw Error('Not yet implemented _accessor')
    };

    _bySeleniumSelector(locator: string): null {
        throw Error('Not yet implemented _bySeleniumSelector')
    };

    _near(e: SahiElement): SahiRelation {
        throw Error('Not yet implemented _near')
    };

    _in(e: SahiElement): SahiRelation {
        throw Error('Not yet implemented _in')
    };

    _startLookInside(e: SahiElement): SahiRelation {
        throw Error('Not yet implemented _startLookInside')
    };

    _stopLookInside(): SahiRelation {
        throw Error('Not yet implemented _stopLookInside')
    };

    _rightOf(e: SahiElement, offset?: pr_i_AB | number): SahiRelation {
        throw Error('Not yet implemented _rightOf')
    };

    _leftOf(e: SahiElement, offset?: pr_i_AB | number): SahiRelation {
        throw Error('Not yet implemented _leftOf')
    };

    _leftOrRightOf(e: SahiElement, offset?: pr_i_AB | number): SahiRelation {
        throw Error('Not yet implemented _leftOrRightOf')
    };

    _under(e: SahiElement, offset?: pr_i_AB | number, limit?: number): SahiRelation {
        throw Error('Not yet implemented _under')
    };

    _above(e: SahiElement, offset?: pr_i_AB | number, limit?: number): SahiRelation {
        throw Error('Not yet implemented _above')
    };

    _aboveOrUnder(e: SahiElement, offset?: pr_i_AB | number): SahiRelation {
        throw Error('Not yet implemented _aboveOrUnder')
    };

    _parentNode(e: SahiElement, tagName: string, occurrence: number): SahiRelation {
        throw Error('Not yet implemented _parentNode')
    };

    _parentCell(e: SahiElement, occurrence?: number): SahiRelation {
        throw Error('Not yet implemented _parentCell')
    };

    _parentRow(e: SahiElement, occurrence?: number): SahiRelation {
        throw Error('Not yet implemented _parentRow')
    };

    _parentTable(e: SahiElement, occurrence?: number): SahiRelation {
        throw Error('Not yet implemented _parentTable')
    };

    _xy(e: SahiElement, x: number, y: number): SahiElement {
        throw Error('Not yet implemented')
    };

    async _doubleClick(e: SahiElement, combo?: string): Promise<SahiElement> {
        await this.webDriver.executeScript('');
        return e;
    };

    _rightClick(e: SahiElement, combo?: string): SahiElement {
        throw Error('Not yet implemented')
    };

    _mouseDown(e: SahiElement, $isRight: boolean = false, $combo?: string): null {
        throw Error('Not yet implemented')
    };

    _mouseUp(e: SahiElement, $isRight: boolean = false, $combo?: string): null {
        throw Error('Not yet implemented')
    };

    _mouseOver(e: SahiElement, $combo?: string): null {
        throw Error('Not yet implemented')
    };

    _check(e: SahiElement): null {
        throw Error('Not yet implemented')
    };

    _uncheck(e: SahiElement): null {
        throw Error('Not yet implemented')
    };

    _setSelected(e: SahiElement, ...relations: SahiRelation[]): null {
        throw Error('Not yet implemented')
    };

    _dragDrop(eSource: SahiElement, eTarget: SahiElement): null {
        throw Error('Not yet implemented')
    };

    _dragDropXY(e: SahiElement, $x: number, $y: number, $isRelative: boolean = false): null {
        throw Error('Not yet implemented')
    };

    private async runAsAction<T>(name: string, action: Promise<T>): Promise<T> {
        this.testExecutionContext.startTestAction({id: name});
        const result = await action;
        this.testExecutionContext.endTestAction();
        return result;
    }

    private async getElement(locator: Locator, identifier: AccessorIdentifier, ...relations: SahiRelation[]) {
        await this.webDriver.wait(until.elementsLocated(locator));
        return this.accessorUtil.getElement(
            await this.webDriver.findElements(locator),
            identifier, ...relations
        );
    }
}