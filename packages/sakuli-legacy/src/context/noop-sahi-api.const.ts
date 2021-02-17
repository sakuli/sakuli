import { SahiApi } from "./sahi/sahi-api.interface";
import { SahiElementQueryOrWebElement } from "./sahi/sahi-element.interface";
import { AccessorIdentifier } from "./sahi/api";
import { SahiRelation } from "./sahi/relations/sahi-relation.interface";
import { WebElement } from "selenium-webdriver";
import { CharInfo } from "./sahi/action/char-info.interface";
import { ClickOptions } from "./sahi/action/mouse-action";
import {
  WaitParameter,
  WaitParameterWithExpression,
} from "./sahi/action/common-action";

const _NoopSahiApi: SahiApi = {
  _parentNode(
    _: SahiElementQueryOrWebElement,
    __: string,
    ___?: number | undefined
  ): Promise<SahiElementQueryOrWebElement> {
    throw new Error("Method not implemented.");
  },
  _parentCell(
    _: SahiElementQueryOrWebElement,
    __?: number | undefined
  ): Promise<SahiElementQueryOrWebElement> {
    throw new Error("Method not implemented.");
  },
  _parentRow(
    _: SahiElementQueryOrWebElement,
    __?: number | undefined
  ): Promise<SahiElementQueryOrWebElement> {
    throw new Error("Method not implemented.");
  },
  _parentTable(
    _: SahiElementQueryOrWebElement,
    __?: number | undefined
  ): Promise<SahiElementQueryOrWebElement> {
    throw new Error("Method not implemented.");
  },
  _in(_: SahiElementQueryOrWebElement): SahiRelation {
    throw new Error("Method not implemented.");
  },
  _near(_: SahiElementQueryOrWebElement): SahiRelation {
    throw new Error("Method not implemented.");
  },
  _under(
    _: SahiElementQueryOrWebElement,
    __?: number | undefined
  ): SahiRelation {
    throw new Error("Method not implemented.");
  },
  _above(
    _: SahiElementQueryOrWebElement,
    __?: number | undefined
  ): SahiRelation {
    throw new Error("Method not implemented.");
  },
  _underOrAbove(
    _: SahiElementQueryOrWebElement,
    __?: number | undefined
  ): SahiRelation {
    throw new Error("Method not implemented.");
  },
  _rightOf(
    _: SahiElementQueryOrWebElement,
    __?: number | undefined
  ): SahiRelation {
    throw new Error("Method not implemented.");
  },
  _leftOf(
    _: SahiElementQueryOrWebElement,
    __?: number | undefined
  ): SahiRelation {
    throw new Error("Method not implemented.");
  },
  _leftOrRightOf(
    _: SahiElementQueryOrWebElement,
    __?: number | undefined
  ): SahiRelation {
    throw new Error("Method not implemented.");
  },
  _dynamicInclude(): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _xy(): never {
    throw new Error("Method not implemented.");
  },
  _click(
    _: SahiElementQueryOrWebElement,
    __?: string | undefined | ClickOptions,
    ___?: ClickOptions | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _mouseDown(
    _: SahiElementQueryOrWebElement,
    __?: boolean | undefined,
    ___?: string | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _mouseUp(
    _: SahiElementQueryOrWebElement,
    __?: boolean | undefined,
    ___?: string | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _rightClick(
    _: SahiElementQueryOrWebElement,
    __?: string | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _mouseOver(
    _: SahiElementQueryOrWebElement,
    __?: string | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _check(_: SahiElementQueryOrWebElement): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _uncheck(_: SahiElementQueryOrWebElement): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _dragDrop(
    _: SahiElementQueryOrWebElement,
    __: SahiElementQueryOrWebElement
  ): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _dragDropXY(
    _: SahiElementQueryOrWebElement,
    __: number,
    ___: number,
    ____?: boolean | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _setSelected(
    _: SahiElementQueryOrWebElement,
    __: string | number | string[] | number[],
    ___?: boolean | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _setValue(_: SahiElementQueryOrWebElement, __: string): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _keyDown(
    _: SahiElementQueryOrWebElement,
    __: CharInfo,
    ___?: string | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _keyUp(_: SahiElementQueryOrWebElement, __: CharInfo): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _keyPress(
    _: SahiElementQueryOrWebElement,
    __: CharInfo,
    ___?: string | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _type(_: SahiElementQueryOrWebElement, __: string): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _focus(_: SahiElementQueryOrWebElement): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _blur(_: SahiElementQueryOrWebElement): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _removeFocus(_: SahiElementQueryOrWebElement): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _eval<T = any>(source: string, ..._args: any[]): Promise<T> {
    throw new Error("Method not implemented.");
  },
  _highlight(
    _: SahiElementQueryOrWebElement,
    __?: number | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _pageIsStable(_?: number, __?: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  },
  _wait<P extends WaitParameter<any>>(
    ...[_, __]: P
  ): Promise<P extends WaitParameterWithExpression<infer R> ? R : void> {
    throw new Error("Method not implemented.");
  },
  _navigateTo(
    _: string,
    __?: boolean | undefined,
    ___?: { user: string; password: string } | undefined
  ): Promise<any> {
    throw new Error("Method not implemented.");
  },
  _rteWrite(_: SahiElementQueryOrWebElement, __: string): Promise<void> {
    throw new Error("Method not implemented.");
  },
  _activeElement(): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _byId(_: string): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _byText(_: string, __: string): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _byClassName(_: string, __: string): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _byXPath(_: string): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _password(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _textbox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _hidden(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _datebox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _datetimebox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _datetimelocalbox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _emailbox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _monthbox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _numberbox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _rangebox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _searchbox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _telephonebox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _timebox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _urlbox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _weekbox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _textarea(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _button(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _checkbox(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _radio(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _submit(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _reset(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _imageSubmitButton(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _select(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _option(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _file(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _table(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _row(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _cell(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _tableHeader(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _link(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _image(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _label(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _listItem(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _list(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _div(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _span(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _fieldset(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _heading1(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _heading2(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _heading3(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _heading4(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _heading5(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _heading6(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _area(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _map(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _paragraph(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _italic(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _emphasis(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _bold(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _strong(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _preformatted(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _code(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _blockquote(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _canvas(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _abbr(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _hr(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _iframe(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _rte(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _frame(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _object(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _embed(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _dList(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _dTerm(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _dDesc(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _font(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _svg_rect(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _svg_tspan(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _svg_circle(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _svg_ellipse(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _svg_line(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _svg_polygon(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _svg_polyline(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _svg_path(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _svg_text(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _article(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _aside(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _details(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _figcaption(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _figure(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _footer(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _header(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _main(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _mark(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _nav(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _section(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _summary(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _time(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _video(
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): SahiElementQueryOrWebElement {
    throw new Error("Method not implemented.");
  },
  _getValue(_: SahiElementQueryOrWebElement): Promise<string> {
    throw new Error("Method not implemented.");
  },
  _getText(_: SahiElementQueryOrWebElement): Promise<string> {
    throw new Error("Method not implemented.");
  },
  _getCellText(_: SahiElementQueryOrWebElement): Promise<string> {
    throw new Error("Method not implemented.");
  },
  _getOptions(
    _: SahiElementQueryOrWebElement,
    __?: "value" | undefined
  ): Promise<string[]> {
    throw new Error("Method not implemented.");
  },
  _getSelectedText(_: SahiElementQueryOrWebElement): Promise<string> {
    throw new Error("Method not implemented.");
  },
  _getAttribute(_: SahiElementQueryOrWebElement, __: string): Promise<string> {
    throw new Error("Method not implemented.");
  },
  _exists(_: SahiElementQueryOrWebElement): Promise<boolean> {
    throw new Error("Method not implemented.");
  },
  _areEqual(
    _: SahiElementQueryOrWebElement,
    __: SahiElementQueryOrWebElement
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  },
  _isVisible(_: SahiElementQueryOrWebElement): Promise<boolean> {
    throw new Error("Method not implemented.");
  },
  _isChecked(_: SahiElementQueryOrWebElement): Promise<boolean> {
    throw new Error("Method not implemented.");
  },
  _isEnabled(_: SahiElementQueryOrWebElement): Promise<boolean> {
    throw new Error("Method not implemented.");
  },
  _containsText(_: SahiElementQueryOrWebElement, __: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  },
  _containsHTML(_: SahiElementQueryOrWebElement, __: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  },
  _contains(
    _: SahiElementQueryOrWebElement,
    __: SahiElementQueryOrWebElement
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  },
  _title(): Promise<string> {
    throw new Error("Method not implemented.");
  },
  _style(_: SahiElementQueryOrWebElement, __: string): Promise<string> {
    throw new Error("Method not implemented.");
  },
  _position(_: SahiElementQueryOrWebElement): Promise<[number, number]> {
    throw new Error("Method not implemented.");
  },
  _getSelectionText(): Promise<string> {
    throw new Error("Method not implemented.");
  },
  _fetch(_: SahiElementQueryOrWebElement): Promise<WebElement> {
    throw new Error("Method not implemented.");
  },
  _collect(
    accessorApiMethod:
      | "_password"
      | "_textbox"
      | "_hidden"
      | "_datebox"
      | "_datetimebox"
      | "_datetimelocalbox"
      | "_emailbox"
      | "_monthbox"
      | "_numberbox"
      | "_rangebox"
      | "_searchbox"
      | "_telephonebox"
      | "_timebox"
      | "_urlbox"
      | "_weekbox"
      | "_textarea"
      | "_button"
      | "_checkbox"
      | "_radio"
      | "_submit"
      | "_reset"
      | "_imageSubmitButton"
      | "_select"
      | "_option"
      | "_file"
      | "_table"
      | "_row"
      | "_cell"
      | "_tableHeader"
      | "_link"
      | "_image"
      | "_label"
      | "_listItem"
      | "_list"
      | "_div"
      | "_span"
      | "_fieldset"
      | "_heading1"
      | "_heading2"
      | "_heading3"
      | "_heading4"
      | "_heading5"
      | "_heading6"
      | "_area"
      | "_map"
      | "_paragraph"
      | "_italic"
      | "_emphasis"
      | "_bold"
      | "_strong"
      | "_preformatted"
      | "_code"
      | "_blockquote"
      | "_canvas"
      | "_abbr"
      | "_hr"
      | "_iframe"
      | "_rte"
      | "_frame"
      | "_object"
      | "_embed"
      | "_dList"
      | "_dTerm"
      | "_dDesc"
      | "_font"
      | "_svg_rect"
      | "_svg_tspan"
      | "_svg_circle"
      | "_svg_ellipse"
      | "_svg_line"
      | "_svg_polygon"
      | "_svg_polyline"
      | "_svg_path"
      | "_svg_text"
      | "_article"
      | "_aside"
      | "_details"
      | "_figcaption"
      | "_figure"
      | "_footer"
      | "_header"
      | "_main"
      | "_mark"
      | "_nav"
      | "_section"
      | "_summary"
      | "_time"
      | "_video",
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): Promise<WebElement[]> {
    throw new Error("Method not implemented.");
  },
  _count(
    accessorApiMethod:
      | "_password"
      | "_textbox"
      | "_hidden"
      | "_datebox"
      | "_datetimebox"
      | "_datetimelocalbox"
      | "_emailbox"
      | "_monthbox"
      | "_numberbox"
      | "_rangebox"
      | "_searchbox"
      | "_telephonebox"
      | "_timebox"
      | "_urlbox"
      | "_weekbox"
      | "_textarea"
      | "_button"
      | "_checkbox"
      | "_radio"
      | "_submit"
      | "_reset"
      | "_imageSubmitButton"
      | "_select"
      | "_option"
      | "_file"
      | "_table"
      | "_row"
      | "_cell"
      | "_tableHeader"
      | "_link"
      | "_image"
      | "_label"
      | "_listItem"
      | "_list"
      | "_div"
      | "_span"
      | "_fieldset"
      | "_heading1"
      | "_heading2"
      | "_heading3"
      | "_heading4"
      | "_heading5"
      | "_heading6"
      | "_area"
      | "_map"
      | "_paragraph"
      | "_italic"
      | "_emphasis"
      | "_bold"
      | "_strong"
      | "_preformatted"
      | "_code"
      | "_blockquote"
      | "_canvas"
      | "_abbr"
      | "_hr"
      | "_iframe"
      | "_rte"
      | "_frame"
      | "_object"
      | "_embed"
      | "_dList"
      | "_dTerm"
      | "_dDesc"
      | "_font"
      | "_svg_rect"
      | "_svg_tspan"
      | "_svg_circle"
      | "_svg_ellipse"
      | "_svg_line"
      | "_svg_polygon"
      | "_svg_polyline"
      | "_svg_path"
      | "_svg_text"
      | "_article"
      | "_aside"
      | "_details"
      | "_figcaption"
      | "_figure"
      | "_footer"
      | "_header"
      | "_main"
      | "_mark"
      | "_nav"
      | "_section"
      | "_summary"
      | "_time"
      | "_video",
    _: AccessorIdentifier,
    ...__: SahiRelation[]
  ): Promise<number> {
    throw new Error("Method not implemented.");
  },
  _assertTrue(_: Promise<boolean>, __?: string): Promise<void> {
    throw new Error("Method not Implemented");
  },
  _assert(
    _: Promise<boolean>,
    __ = "Condition evaluated to 'false'"
  ): Promise<void> {
    throw new Error("Method not Implemented");
  },
  _assertFalse(_: Promise<boolean>, __?: string): Promise<void> {
    throw new Error("Method not Implemented");
  },
  _assertNotTrue(_: Promise<boolean>, __?: string): Promise<void> {
    throw new Error("Method not Implemented");
  },
  _assertContainsText(
    _: string,
    __: SahiElementQueryOrWebElement,
    ___?: string
  ): Promise<void> {
    throw new Error("Not Implemented");
  },
  _assertNotContainsText(
    _: string,
    __: SahiElementQueryOrWebElement,
    ___?: string
  ): Promise<void> {
    throw new Error("Not Implemented");
  },
  _assertEqual(_: any, __: any, ___?: string): Promise<void> {
    throw new Error("Not Implemented");
  },
  _assertNotEqual(_: any, __: any, ___?: string): Promise<void> {
    throw new Error("Not Implemented");
  },
  _assertEqualArrays(
    _: Array<any>,
    __: Array<any>,
    ___?: string
  ): Promise<void> {
    throw new Error("Not Implemented");
  },
  _assertExists(_: SahiElementQueryOrWebElement, __?: string): Promise<void> {
    throw new Error("Not Implemented");
  },
  _assertNotExists(
    _: SahiElementQueryOrWebElement,
    __?: string
  ): Promise<void> {
    throw new Error("Not Implemented");
  },
  _assertNotNull(_: any, __?: string): Promise<void> {
    throw new Error("Not Implemented");
  },
  _assertNull(_: any, __?: string): Promise<void> {
    throw new Error("Not Implemented");
  },
  _setFetchTimeout(_: number): void {
    throw new Error("Not Implemented");
  },
  _getFetchTimeout() {
    throw new Error("Not Implemented");
  },
};

export const NoopSahiApi = new Proxy(_NoopSahiApi, {
  get: (target: SahiApi, prop: keyof SahiApi) => {
    if (typeof target[prop] === "function") {
      return (..._: any[]) => {
        throw Error(`Cannot invoke function ${prop} in ui only tests`);
      };
    } else {
      return target[prop];
    }
  },
});
