import PropertiesReader from 'properties-reader'
import { Type } from '../../util/type.interface';
import { getJavaPropertyDefinitons } from './java-properties.decorator';

export function marshallPropertiesToObject<T>(type: Type<T>, properties: PropertiesReader.Reader): T {
    const javaPropertyDefinitons = getJavaPropertyDefinitons(type);
    const data = javaPropertyDefinitons.reduce((agg, def) => {
        return ({
            ...agg,
            [def.property]: properties.read(def.path)
        })
    }, {})
    return Object.assign(new type(), data);
}