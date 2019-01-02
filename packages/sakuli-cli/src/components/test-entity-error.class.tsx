import {Component, h} from "ink";
import {TestContextEntity} from "@sakuli/core";
import Youch from "youch";

export interface TestEntityErrorProps {
    entity: TestContextEntity
}

export interface TestEntityErrorState {
    renderedError: string,
    serializedError?: any
}

export class TestEntityError extends Component<TestEntityErrorProps, TestEntityErrorState> {

    constructor(props: TestEntityErrorProps) {
        super(props);
        this.state = {
            renderedError: 'lol',
            serializedError: null,
        }
    }

    componentDidMount() {
        if (this.props.entity.error) {
            this.setState({serializedError: {error: 'lol'}});
            const youch = (new Youch(
                this.props.entity.error, {}
            ));
            youch.toJSON().then(errorJson => {
                this.setState(s => ({
                    serializedError: errorJson
                }));
            });
        }
    }

    render(p: TestEntityErrorProps, state: TestEntityErrorState) {
        if (this.props.entity.error) {
            return <div>{state.renderedError}{this.props.entity.error.message}</div>
        } else {
            return <div>No Error</div>
        }
    }
}