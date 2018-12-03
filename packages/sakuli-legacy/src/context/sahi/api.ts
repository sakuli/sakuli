import {ThenableWebDriver, WebElement} from "selenium-webdriver";
import {types} from "util";


type SahiElement = WebElement;
type pr_i_AB = [number, number];

interface AccessorIdentifierAttributesWithSahiIndex {
    sahiIndex: number
}

function isAccessorIdentifierAttributesWithSahiIndex(o: any): o is AccessorIdentifierAttributesWithSahiIndex {
    return typeof o === 'object' && 'sahiIndex' in  o;
}

interface AccessorIdentifierAttributesWithClassName {
    className: string
}

export type AccessorIdentifierAttributes = Partial<AccessorIdentifierAttributesWithClassName & AccessorIdentifierAttributesWithSahiIndex>

type SahiRelation = any;
type AccessorIdentifier = number | string | AccessorIdentifierAttributes | RegExp;
type AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => SahiElement;


export class SahiApi {
    constructor(
        readonly webDriver: ThenableWebDriver
    ) {
    }


    private getElementBySahiIndex(elements:WebElement[], identifier: AccessorIdentifierAttributesWithSahiIndex) {
        return elements[identifier.sahiIndex];
    }

    private async getElement(elements: WebElement[], identifier: AccessorIdentifier, ...relations: SahiRelation[]): Promise<WebElement | undefined> {
        if (typeof identifier === 'number') {
            return Promise.resolve(this.getElementBySahiIndex(elements, {sahiIndex: identifier}));
        }
        if (isAccessorIdentifierAttributesWithSahiIndex(identifier)) {
            return Promise.resolve(this.getElementBySahiIndex(elements, identifier));
        }
        if (typeof identifier === 'string') {
            const eAndText: [WebElement, string][] = await Promise.all(elements
                .map(e => e.getText().then((text):[WebElement, string] => [e, text]))
            );
            const e = eAndText.find(([e, text]) => text.includes(identifier));
            return e ? Promise.resolve(e[0]) : Promise.resolve(undefined);
        }
        if(types.isRegExp(identifier)) {
            const eAndText: [WebElement, string][] = await Promise.all(elements
                .map(e => e.getText().then((text):[WebElement, string] => [e, text]))
            );
            const e = eAndText.find(([e, text]) => {
                const match = text.match(identifier);
                    return match ? match.length > 0 : false
            });
            return e ? Promise.resolve(e[0]) : Promise.resolve(undefined);
        }
    }

    _password: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _textbox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _hidden: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _datebox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _datetimebox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _datetimelocalbox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _emailbox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _monthbox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _numberbox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _rangebox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _searchbox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _telephonebox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _timebox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _urlbox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _weekbox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _textarea: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _button: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _checkbox: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _radio: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _submit: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _reset: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _imageSubmitButton: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _select: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _option: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _file: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _table: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _row: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _cell: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _tableHeader: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _link: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _image: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _label: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _listItem: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _list: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _div: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _span: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _fieldset: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _heading1: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _heading2: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _heading3: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _heading4: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _heading5: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _heading6: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _area: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _map: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _paragraph: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _italic: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _emphasis: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _bold: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _strong: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _preformatted: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _code: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _blockquote: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _canvas: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _abbr: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _hr: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _iframe: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _frame: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _object: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _embed: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _dList: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _dTerm: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _dDesc: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _font: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _svg_rect: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _svg_tspan: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _svg_circle: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _svg_ellipse: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _svg_line: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _svg_polygon: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _svg_polyline: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _svg_path: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _svg_text: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _article: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _aside: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _details: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _figcaption: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _figure: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _footer: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _header: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _main: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _mark: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _nav: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _section: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _summary: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _time: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };
    _video: AccessorFunction = (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
        throw Error('Not yet implemented')
    };

    _activeElement(): SahiElement {
        throw Error('Not yet implemented')
    };

    _byId(id: string): SahiElement {
        throw Error('Not yet implemented')
    };

    _byText(text: string, tagName: string): SahiElement {
        throw Error('Not yet implemented')
    };

    _byClassName(className: string, tagName: string, ...relations: SahiRelation[]): SahiElement {
        throw Error('Not yet implemented')
    };

    _byXPath(xpath: string): SahiElement {
        throw Error('Not yet implemented')
    };

    _accessor(accessor: string): SahiElement {
        throw Error('Not yet implemented')
    };

    _bySeleniumSelector(locator: string): null {
        throw Error('Not yet implemented')
    };

    _near(e: SahiElement): SahiRelation {
        throw Error('Not yet implemented')
    };

    _in(e: SahiElement): SahiRelation {
        throw Error('Not yet implemented')
    };

    _startLookInside(e: SahiElement): SahiRelation {
        throw Error('Not yet implemented')
    };

    _stopLookInside(): SahiRelation {
        throw Error('Not yet implemented')
    };

    _rightOf(e: SahiElement, offset?: pr_i_AB | number): SahiRelation {
        throw Error('Not yet implemented')
    };

    _leftOf(e: SahiElement, offset?: pr_i_AB | number): SahiRelation {
        throw Error('Not yet implemented')
    };

    _leftOrRightOf(e: SahiElement, offset?: pr_i_AB | number): SahiRelation {
        throw Error('Not yet implemented')
    };

    _under(e: SahiElement, offset?: pr_i_AB | number, limit?: number): SahiRelation {
        throw Error('Not yet implemented')
    };

    _above(e: SahiElement, offset?: pr_i_AB | number, limit?: number): SahiRelation {
        throw Error('Not yet implemented')
    };

    _aboveOrUnder(e: SahiElement, offset?: pr_i_AB | number): SahiRelation {
        throw Error('Not yet implemented')
    };

    _parentNode(e: SahiElement, tagName: string, occurrence: number): SahiRelation {
        throw Error('Not yet implemented')
    };


    _parentCell(e: SahiElement, occurrence?: number): SahiRelation {
        throw Error('Not yet implemented')
    };

    _parentRow(e: SahiElement, occurrence?: number): SahiRelation {
        throw Error('Not yet implemented')
    };

    _parentTable(e: SahiElement, occurrence?: number): SahiRelation {
        throw Error('Not yet implemented')
    };

    _xy(e: SahiElement, x: number, y: number): SahiElement {
        throw Error('Not yet implemented')
    };

    async _click(e: SahiElement, combo?: string): Promise<SahiElement> {
        await e.click();
        return e;
    };

    async _doubleClick(e: SahiElement, combo?: string): Promise<SahiElement> {
        this.webDriver.executeScript('')
        throw Error('Not yet implemented')
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

}