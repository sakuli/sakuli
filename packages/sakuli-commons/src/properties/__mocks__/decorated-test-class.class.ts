import {Property} from "../decorator/properties.decorator";

export class DecoratedTestClass {
    @Property('my.property.path')
    property: string = '';

    @Property('property.2')
    @Property('property.alt')
    property2: string = '';

    simpleProperty: string = ''

    @Property('never.read.this.prop')
    neverMapped: string = 'default'
}