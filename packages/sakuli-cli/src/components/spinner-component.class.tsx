import {Component} from "ink";
import Timeout = NodeJS.Timeout;

export interface SpinnerProps {
    frames?: string[] | string;
    tick: number
}

export interface SpinnerState {
    tick: number
}

export class Spinner extends Component<SpinnerProps, SpinnerState> {
    timer?: Timeout;
    _frames =  ['◜','◠','◝','◞','◡','◟'];
    constructor(props: SpinnerProps) {
        super(props);
        this.state = {
            tick: 0
        }
    }

    get frames() {
        return this.props.frames || this._frames;
    }

    render() {
        const l = this.frames.length;
        return this.frames[this.props.tick % l];
    }
}