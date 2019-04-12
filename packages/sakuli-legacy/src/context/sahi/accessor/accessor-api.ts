import {SahiRelation} from "../relations/sahi-relation.interface";
import {By} from "selenium-webdriver";
import {AccessorFunction, AccessorIdentifier} from "../api";
import {SahiElementQueryOrWebElement} from "../sahi-element.interface";
import {isAccessorIdentifierAttributesWithClassName} from "./accessor-model.interface";

export type AccessorApi = ReturnType<typeof accessorApi>;
export type DefaultAccessors = Pick<AccessorApi, Exclude<keyof AccessorApi, "_activeElement" | "_byId" | "_byText" | "_byClassName" | "_byXPath">>
export type AccessorFunctions = Exclude<keyof AccessorApi, "_activeElement" | "_byId" | "_byText" | "_byClassName" | "_byXPath">;

export function accessorApi() {

    function createAccessorFunction(css: string): AccessorFunction {
        return (identifier: AccessorIdentifier, ...relations: SahiRelation[]) => {
            let extendedLocator = By.css(css);
            if(isAccessorIdentifierAttributesWithClassName(identifier)) {
                extendedLocator = By.css(`${css}.${identifier.className.split(" ").join(".")}`)
            }
            return ({
                locator: extendedLocator,
                identifier,
                relations
            });
        }
    }

    return {
        _activeElement: (): SahiElementQueryOrWebElement => {
            return ({
                locator: By.css(':focus'),
                identifier: 0,
                relations: []
            })
        },
        _byId: (id: string): SahiElementQueryOrWebElement => {
            return ({
                locator: By.css(`#${id}`),
                identifier: 0,
                relations: []
            })
        },
        _byText: (text: string, tagName: string): SahiElementQueryOrWebElement => {
            return ({
                locator: By.css(tagName),
                identifier: text,
                relations: [],
            })
        },
        _byClassName: (clsName: string, tagName: string): SahiElementQueryOrWebElement => {
            return ({
                locator: By.css(`${tagName}.${clsName}`),
                identifier: 0,
                relations: []
            })
        },
        _byXPath: (xPath: string): SahiElementQueryOrWebElement => {
            return ({
                locator: By.xpath(xPath),
                identifier: 0,
                relations: []
            })
        },
        _password: createAccessorFunction('input[type="password"]'),
        _textbox: createAccessorFunction('input[type="text"]'),
        _hidden: createAccessorFunction('input[type="hidden"]'),
        _datebox: createAccessorFunction('input[type="date"]'),
        _datetimebox: createAccessorFunction('input[type="datetime"]'),
        _datetimelocalbox: createAccessorFunction('input[type="datetime-local"]'),
        _emailbox: createAccessorFunction('input[type="email"]'),
        _monthbox: createAccessorFunction('input[type="month"]'),
        _numberbox: createAccessorFunction('input[type="number"]'),
        _rangebox: createAccessorFunction('input[type="range"]'),
        _searchbox: createAccessorFunction('input[type="search"]'),
        _telephonebox: createAccessorFunction('input[type="tel"]'),
        _timebox: createAccessorFunction('input[type="time"]'),
        _urlbox: createAccessorFunction('input[type="url"]'),
        _weekbox: createAccessorFunction('input[type="week"]'),
        _textarea: createAccessorFunction('textarea'),
        _button: createAccessorFunction('button'),
        _checkbox: createAccessorFunction('input[type="checkbox"]'),
        _radio: createAccessorFunction('input[type="radio"]'),
        _submit: createAccessorFunction('input[type="submit"], button[type="submit"]'),
        _reset: createAccessorFunction('input[type="reset"]'),
        _imageSubmitButton: createAccessorFunction('input[type="image"]'),
        _select: createAccessorFunction('select'),
        _option: createAccessorFunction('option'),
        _file: createAccessorFunction('input[type="file"]'),
        _table: createAccessorFunction('table'),
        _row: createAccessorFunction('tr'),
        _cell: createAccessorFunction('td'),
        _tableHeader: createAccessorFunction('th'),
        _link: createAccessorFunction('a'),
        _image: createAccessorFunction('img'),
        _label: createAccessorFunction('label'),
        _listItem: createAccessorFunction('li'),
        _list: createAccessorFunction('ul'),
        _div: createAccessorFunction('div'),
        _span: createAccessorFunction('span'),
        _fieldset: createAccessorFunction('fieldset'),
        _heading1: createAccessorFunction('h1'),
        _heading2: createAccessorFunction('h2'),
        _heading3: createAccessorFunction('h3'),
        _heading4: createAccessorFunction('h4'),
        _heading5: createAccessorFunction('h5'),
        _heading6: createAccessorFunction('h6'),
        _area: createAccessorFunction('area'),
        _map: createAccessorFunction('map'),
        _paragraph: createAccessorFunction('p'),
        _italic: createAccessorFunction('i'),
        _emphasis: createAccessorFunction('em'),
        _bold: createAccessorFunction('b'),
        _strong: createAccessorFunction('strong'),
        _preformatted: createAccessorFunction('pre'),
        _code: createAccessorFunction('code'),
        _blockquote: createAccessorFunction('blockquote'),
        _canvas: createAccessorFunction('canvas'),
        _abbr: createAccessorFunction('abbr'),
        _hr: createAccessorFunction('hr'),
        _iframe: createAccessorFunction('iframe'),
        _rte: createAccessorFunction('iframe'),
        _frame: createAccessorFunction('frame'),
        _object: createAccessorFunction('object'),
        _embed: createAccessorFunction('embed'),
        _dList: createAccessorFunction('dl'),
        _dTerm: createAccessorFunction('dt'),
        _dDesc: createAccessorFunction('dd'),
        _font: createAccessorFunction('font'),
        _svg_rect: createAccessorFunction('rect'),
        _svg_tspan: createAccessorFunction('tspan'),
        _svg_circle: createAccessorFunction('circle'),
        _svg_ellipse: createAccessorFunction('ellipse'),
        _svg_line: createAccessorFunction('line'),
        _svg_polygon: createAccessorFunction('polygon'),
        _svg_polyline: createAccessorFunction('polyline'),
        _svg_path: createAccessorFunction('path'),
        _svg_text: createAccessorFunction('text'),
        _article: createAccessorFunction('article'),
        _aside: createAccessorFunction('aside'),
        _details: createAccessorFunction('details'),
        _figcaption: createAccessorFunction('figcaption'),
        _figure: createAccessorFunction('figure'),
        _footer: createAccessorFunction('footer'),
        _header: createAccessorFunction('header'),
        _main: createAccessorFunction('main'),
        _mark: createAccessorFunction('mark'),
        _nav: createAccessorFunction('nav'),
        _section: createAccessorFunction('section'),
        _summary: createAccessorFunction('summary'),
        _time: createAccessorFunction('time'),
        _video: createAccessorFunction('video'),
    }

}