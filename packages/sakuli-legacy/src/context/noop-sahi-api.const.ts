import { SahiApi } from "./sahi/sahi-api.interface";
import { SahiElementQueryOrWebElement } from "./sahi/sahi-element.interface";
import { AccessorIdentifier } from "./sahi/api";
import { SahiRelation } from "./sahi/relations/sahi-relation.interface";
import { WebElement } from "selenium-webdriver";
import { CharInfo } from "./sahi/action/char-info.interface";

const _NoopSahiApi: SahiApi = {
    _parentNode(q: SahiElementQueryOrWebElement, tagName: string, occurrence?: number | undefined): Promise<SahiElementQueryOrWebElement> {
        throw new Error("Method not implemented.");
    },
    _parentCell(q: SahiElementQueryOrWebElement, occurrence?: number | undefined): Promise<SahiElementQueryOrWebElement> {
        throw new Error("Method not implemented.");
    },
    _parentRow(q: SahiElementQueryOrWebElement, occurrence?: number | undefined): Promise<SahiElementQueryOrWebElement> {
        throw new Error("Method not implemented.");
    },
    _parentTable(q: SahiElementQueryOrWebElement, occurrence?: number | undefined): Promise<SahiElementQueryOrWebElement> {
        throw new Error("Method not implemented.");
    },
    _in(anchor: SahiElementQueryOrWebElement): SahiRelation {
        throw new Error("Method not implemented.");
    },
    _near(anchor: SahiElementQueryOrWebElement): SahiRelation {
        throw new Error("Method not implemented.");
    },
    _under(anchor: SahiElementQueryOrWebElement, offset?: number | undefined): SahiRelation {
        throw new Error("Method not implemented.");
    },
    _above(anchor: SahiElementQueryOrWebElement, offset?: number | undefined): SahiRelation {
        throw new Error("Method not implemented.");
    },
    _underOrAbove(anchor: SahiElementQueryOrWebElement, offset?: number | undefined): SahiRelation {
        throw new Error("Method not implemented.");
    },
    _rightOf(anchor: SahiElementQueryOrWebElement, offset?: number | undefined): SahiRelation {
        throw new Error("Method not implemented.");
    },
    _leftOf(anchor: SahiElementQueryOrWebElement, offset?: number | undefined): SahiRelation {
        throw new Error("Method not implemented.");
    },
    _leftOrRightOf(anchor: SahiElementQueryOrWebElement, offset?: number | undefined): SahiRelation {
        throw new Error("Method not implemented.");
    },
    _dynamicInclude(): Promise<void> {
        throw new Error("Method not implemented.");
    },        _xy(): never {
        throw new Error("Method not implemented.");
    },
    _click(query: SahiElementQueryOrWebElement, combo?: string | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _mouseDown(query: SahiElementQueryOrWebElement, isRight?: boolean | undefined, combo?: string | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _mouseUp(query: SahiElementQueryOrWebElement, isRight?: boolean | undefined, combo?: string | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _rightClick(query: SahiElementQueryOrWebElement, combo?: string | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _mouseOver(query: SahiElementQueryOrWebElement, combo?: string | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _check(query: SahiElementQueryOrWebElement): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _uncheck(query: SahiElementQueryOrWebElement): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _dragDrop(eSource: SahiElementQueryOrWebElement, eTarget: SahiElementQueryOrWebElement): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _dragDropXY(q: SahiElementQueryOrWebElement, x: number, y: number, $isRelative?: boolean | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _setSelected(query: SahiElementQueryOrWebElement, optionToSelect: string | number | string[] | number[], isMultiple?: boolean | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _setValue(query: SahiElementQueryOrWebElement, value: string): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _keyDown(query: SahiElementQueryOrWebElement, charInfo: CharInfo, combo?: string | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _keyUp(query: SahiElementQueryOrWebElement, charInfo: CharInfo): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _keyPress(query: SahiElementQueryOrWebElement, charInfo: CharInfo, combo?: string | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _type(query: SahiElementQueryOrWebElement, text: string): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _focus(query: SahiElementQueryOrWebElement): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _blur(query: SahiElementQueryOrWebElement): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _removeFocus(query: SahiElementQueryOrWebElement): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _eval<T = any>(source: string, ..._args: any[]): Promise<T> {
        throw new Error("Method not implemented.");
    },
    _highlight(query: SahiElementQueryOrWebElement, timeoutMs?: number | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _wait(millis: number, expression?: ((...locators: SahiElementQueryOrWebElement[]) => Promise<boolean>) | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _navigateTo(target: string, forceReload?: boolean | undefined, credentials?: { user: string; password: string; } | undefined): Promise<any> {
        throw new Error("Method not implemented.");
    },
    _rteWrite(query: SahiElementQueryOrWebElement, content: string): Promise<void> {
        throw new Error("Method not implemented.");
    },
    _activeElement(): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _byId(id: string): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _byText(text: string, tagName: string): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _byClassName(clsName: string, tagName: string): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _byXPath(xPath: string): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _password(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _textbox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _hidden(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _datebox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _datetimebox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _datetimelocalbox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _emailbox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _monthbox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _numberbox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _rangebox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _searchbox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _telephonebox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _timebox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _urlbox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _weekbox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _textarea(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _button(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _checkbox(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _radio(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _submit(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _reset(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _imageSubmitButton(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _select(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _option(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _file(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _table(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _row(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _cell(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _tableHeader(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _link(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _image(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _label(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _listItem(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _list(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _div(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _span(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _fieldset(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _heading1(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _heading2(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _heading3(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _heading4(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _heading5(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _heading6(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _area(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _map(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _paragraph(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _italic(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _emphasis(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _bold(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _strong(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _preformatted(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _code(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _blockquote(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _canvas(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _abbr(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _hr(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _iframe(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _rte(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _frame(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _object(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _embed(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _dList(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _dTerm(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _dDesc(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _font(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _svg_rect(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _svg_tspan(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _svg_circle(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _svg_ellipse(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _svg_line(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _svg_polygon(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _svg_polyline(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _svg_path(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _svg_text(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _article(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _aside(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _details(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _figcaption(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _figure(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _footer(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _header(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _main(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _mark(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _nav(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _section(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _summary(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _time(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _video(identifier: AccessorIdentifier, ...relations: SahiRelation[]): SahiElementQueryOrWebElement {
        throw new Error("Method not implemented.");
    },
    _getValue(query: SahiElementQueryOrWebElement): Promise<string> {
        throw new Error("Method not implemented.");
    },
    _getText(query: SahiElementQueryOrWebElement): Promise<string> {
        throw new Error("Method not implemented.");
    },
    _getCellText(query: SahiElementQueryOrWebElement): Promise<string> {
        throw new Error("Method not implemented.");
    },
    _getOptions(query: SahiElementQueryOrWebElement, value?: "value" | undefined): Promise<string[]> {
        throw new Error("Method not implemented.");
    },
    _getSelectedText(query: SahiElementQueryOrWebElement): Promise<string> {
        throw new Error("Method not implemented.");
    },
    _getAttribute(query: SahiElementQueryOrWebElement, name: string): Promise<string> {
        throw new Error("Method not implemented.");
    },
    _exists(query: SahiElementQueryOrWebElement): Promise<boolean> {
        throw new Error("Method not implemented.");
    },
    _areEqual(query1: SahiElementQueryOrWebElement, query2: SahiElementQueryOrWebElement): Promise<boolean> {
        throw new Error("Method not implemented.");
    },
    _isVisible(query: SahiElementQueryOrWebElement): Promise<boolean> {
        throw new Error("Method not implemented.");
    },
    _isChecked(query: SahiElementQueryOrWebElement): Promise<boolean> {
        throw new Error("Method not implemented.");
    },
    _isEnabled(query: SahiElementQueryOrWebElement): Promise<boolean> {
        throw new Error("Method not implemented.");
    },
    _containsText(query: SahiElementQueryOrWebElement, text: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    },
    _containsHTML(query: SahiElementQueryOrWebElement, html: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    },
    _contains(parent: SahiElementQueryOrWebElement, child: SahiElementQueryOrWebElement): Promise<boolean> {
        throw new Error("Method not implemented.");
    },
    _title(): Promise<string> {
        throw new Error("Method not implemented.");
    },
    _style(query: SahiElementQueryOrWebElement, attr: string): Promise<string> {
        throw new Error("Method not implemented.");
    },
    _position(query: SahiElementQueryOrWebElement): Promise<[number, number]> {
        throw new Error("Method not implemented.");
    },
    _getSelectionText(): Promise<string> {
        throw new Error("Method not implemented.");
    },
    _fetch(query: SahiElementQueryOrWebElement): Promise<WebElement> {
        throw new Error("Method not implemented.");
    },
    _collect(accessorApiMethod: "_password" | "_textbox" | "_hidden" | "_datebox" | "_datetimebox" | "_datetimelocalbox" | "_emailbox" | "_monthbox" | "_numberbox" | "_rangebox" | "_searchbox" | "_telephonebox" | "_timebox" | "_urlbox" | "_weekbox" | "_textarea" | "_button" | "_checkbox" | "_radio" | "_submit" | "_reset" | "_imageSubmitButton" | "_select" | "_option" | "_file" | "_table" | "_row" | "_cell" | "_tableHeader" | "_link" | "_image" | "_label" | "_listItem" | "_list" | "_div" | "_span" | "_fieldset" | "_heading1" | "_heading2" | "_heading3" | "_heading4" | "_heading5" | "_heading6" | "_area" | "_map" | "_paragraph" | "_italic" | "_emphasis" | "_bold" | "_strong" | "_preformatted" | "_code" | "_blockquote" | "_canvas" | "_abbr" | "_hr" | "_iframe" | "_rte" | "_frame" | "_object" | "_embed" | "_dList" | "_dTerm" | "_dDesc" | "_font" | "_svg_rect" | "_svg_tspan" | "_svg_circle" | "_svg_ellipse" | "_svg_line" | "_svg_polygon" | "_svg_polyline" | "_svg_path" | "_svg_text" | "_article" | "_aside" | "_details" | "_figcaption" | "_figure" | "_footer" | "_header" | "_main" | "_mark" | "_nav" | "_section" | "_summary" | "_time" | "_video", identifier: AccessorIdentifier, ...relations: SahiRelation[]): Promise<WebElement[]> {
        throw new Error("Method not implemented.");
    },
    _count(accessorApiMethod: "_password" | "_textbox" | "_hidden" | "_datebox" | "_datetimebox" | "_datetimelocalbox" | "_emailbox" | "_monthbox" | "_numberbox" | "_rangebox" | "_searchbox" | "_telephonebox" | "_timebox" | "_urlbox" | "_weekbox" | "_textarea" | "_button" | "_checkbox" | "_radio" | "_submit" | "_reset" | "_imageSubmitButton" | "_select" | "_option" | "_file" | "_table" | "_row" | "_cell" | "_tableHeader" | "_link" | "_image" | "_label" | "_listItem" | "_list" | "_div" | "_span" | "_fieldset" | "_heading1" | "_heading2" | "_heading3" | "_heading4" | "_heading5" | "_heading6" | "_area" | "_map" | "_paragraph" | "_italic" | "_emphasis" | "_bold" | "_strong" | "_preformatted" | "_code" | "_blockquote" | "_canvas" | "_abbr" | "_hr" | "_iframe" | "_rte" | "_frame" | "_object" | "_embed" | "_dList" | "_dTerm" | "_dDesc" | "_font" | "_svg_rect" | "_svg_tspan" | "_svg_circle" | "_svg_ellipse" | "_svg_line" | "_svg_polygon" | "_svg_polyline" | "_svg_path" | "_svg_text" | "_article" | "_aside" | "_details" | "_figcaption" | "_figure" | "_footer" | "_header" | "_main" | "_mark" | "_nav" | "_section" | "_summary" | "_time" | "_video", identifier: AccessorIdentifier, ...relations: SahiRelation[]): Promise<number> {
        throw new Error("Method not implemented.");
    },
    _assertTrue(condition: Promise<boolean>, message?: String): Promise<void> {
        throw new Error("Method not Implemented");
    },
    _assert(condition: Promise<boolean>, message = "Condition evaluated to 'false'"): Promise<void> {
        throw new Error("Method not Implemented");
    },
    _assertFalse(condition: Promise<boolean>, message?: String): Promise<void> {
        throw new Error("Method not Implemented");
    },
    _assertNotTrue(condition: Promise<boolean>, message?: String): Promise<void> {
        throw new Error("Method not Implemented");
    },
    _assertContainsText(expected: String, element: SahiElementQueryOrWebElement, message?: String): Promise<void> {
        throw new Error("Not Implemented");
    },
    _assertNotContainsText(expected: String, element: SahiElementQueryOrWebElement, message?: String): Promise<void> {
        throw new Error("Not Implemented");
    },
    _assertEqual(expected: any, actual: any, message?: String): Promise<void> {
        throw new Error("Not Implemented");
    },
    _assertNotEqual(expected: any, actual: any, message?: String): Promise<void> {
        throw new Error("Not Implemented");
    },
    _assertEqualArrays(expected: Array<any>, actual: Array<any>, message?: String): Promise<void> {
        throw new Error("Not Implemented");
    },
    _assertExists(element: SahiElementQueryOrWebElement, message?: String): Promise<void> {
        throw new Error("Not Implemented");
    },
    _assertNotExists(element: SahiElementQueryOrWebElement, message?: String): Promise<void> {
        throw new Error("Not Implemented");
    },
    _assertNotNull(value: any, message?: String): Promise<void> {
        throw new Error("Not Implemented");
    },
    _assertNull(value: any, message?: String): Promise<void> {
        throw new Error("Not Implemented");
    },
    _setFetchTimeout(timeout: number): void {
        throw new Error("Not Implemented");
    },
    _getFetchTimeout() {
        throw new Error("Not Implemented");
    }
};

export const NoopSahiApi = new Proxy(_NoopSahiApi, {
    get: (target: SahiApi, prop: keyof SahiApi) => {
        if(typeof target[prop] === 'function') {
            return (...args: any[]) => {
                throw Error(`Cannot invoke function ${prop} in ui only tests`);
            }
        } else {
            return target[prop];
        }
    }
});
