declare namespace JSX {
    interface Element { }
    interface IntrinsicElements { div: any; span: any}
}

declare module 'ink' {
    /*
    import {SFCElement, createElement, Component, StatelessComponent} from 'react'
    export {Component} from 'react'
    export const h: typeof createElement;
    export function render(cmp:any): void    
    export class Color extends Component<any, any> {}
    */

    type TODO = any;
    export class VNode {
        constructor(component: string | TODO, props: TODO)
    }

    export function render(tree: VNode): (() => void);

    export function h(component: Function | string, props: TODO, ...children: (Function | string)[]): VNode

    export class Component<P = {}, S = {}, C = {}> {
        state: S;
        readonly props: P;
        readonly context: C;
        readonly refs: {[key: string]: any};
        constructor(props?: P, context?: any);

        setState(nextState: Partial<S> | ((s: S) => Partial<S>), callback?: Function): void

        forceUpdate(): void;

        componentWillMount(): void;
        componentDidMount(): void;
        componentWillUnmount(): void;
        componentDidUnmount(): void;
        componentWillReceiveProps(): void;
        componentWillUpdate(): void;
        componentDidUpdate(): void;
        shouldComponentUpdate(): boolean;
        getChildContext(): {};
        render(props?: P, state?: S, ctx?: C): VNode | JSX.Element;
        static isComponent: true;
    }

    export class StringComponent<P = {}, S = {}, C = {}> extends Component<P, S, C> {}
    export interface ColorProps {
        black?: boolean;
        red?: boolean;
        green?: boolean;
        yellow?: boolean;
        blue?: boolean; 
        magenta?: boolean;
        cyan?: boolean;
        white?: boolean;
        gray?: boolean; 
        redBright?: boolean;
        greenBright?: boolean;
        yellowBright?: boolean;
        blueBright?: boolean;
        magentaBright?: boolean;
        cyanBright?: boolean;
        whiteBright?: boolean;
        bgKeyWord?: string;
        rgb?: [number, number, number]
        hex?: string;
        bgHex?: string;
        bgBlack?: boolean;
        bgRed?: boolean;
        bgGreen?: boolean;
        bgYellow?: boolean;
        bgBlue?: boolean;
        bgMagenta?: boolean;
        bgCyan?: boolean;
        bgWhite?: boolean;
        bgBlackBright?: boolean;
        bgRedBright?: boolean;
        bgGreenBright?: boolean;
        bgYellowBright?: boolean;
        bgBlueBright?: boolean;
        bgMagentaBright?: boolean;
        bgCyanBright?: boolean;
        bgWhiteBright?: boolean;
    }
    export class Color extends StringComponent<ColorProps> {}
    export class Bold extends StringComponent {}
    export class Underline extends StringComponent {}
    export interface IndentProps {
        size: number,
        indent: number;
    }
    export class Indent extends StringComponent<IndentProps> {}
    export class Text extends Color {}
    export class Fragment extends Component {}
}
