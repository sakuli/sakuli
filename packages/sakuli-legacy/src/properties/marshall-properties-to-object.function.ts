import PropertiesReader from 'properties-reader'
import { Type } from '@sakuli/commons';
import { getJavaPropertyDefinitons } from './java-properties.decorator';


/**
 * 
 * @param type A class type, which should have decorated fields with JavaProperties @see JavaProperties
 * @param reader  
 */
export function marshallPropertiesToObject<T>(type: Type<T>, reader: PropertiesReader.Reader): T {
    const javaPropertyDefinitons = getJavaPropertyDefinitons(type);
    const data = javaPropertyDefinitons.reduce((agg, def) => {
        return ({
            ...agg,
            [def.property]: reader.get(def.path)
        })
    }, {})
    return Object.assign(new type(), data);
}