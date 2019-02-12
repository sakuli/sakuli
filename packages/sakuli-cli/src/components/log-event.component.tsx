import {LogEvent} from "@sakuli/commons";
import {Bold, Fragment, h} from "ink";
import {format} from "date-fns";
import {inspect} from "util";

export function LogEvent({message, time, data, level}: LogEvent) {
    const dataElement = data.length
        ? (
            <div>{data.map(d => (<div>{inspect(d, true, null, true)}</div>))}</div>
        ): null;
    return (
        <div>
            <Bold>[{format(time.getTime())}]</Bold> {message}
            {dataElement}
        </div>
    )
}