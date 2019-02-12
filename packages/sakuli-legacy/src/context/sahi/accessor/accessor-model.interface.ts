export interface AccessorIdentifierAttributesWithSahiIndex {
    sahiIndex: number
}
export interface AccessorIdentifierAttributesWithClassName {
    className: string
}

export function isAccessorIdentifierAttributesWithSahiIndex(o: any): o is AccessorIdentifierAttributesWithSahiIndex {
    return typeof o === 'object' && 'sahiIndex' in o;
}

export function isAccessorIdentifierAttributesWithClassName(o: any): o is AccessorIdentifierAttributesWithClassName {
    return typeof o === 'object' && 'className' in o;
}


export type AccessorIdentifierAttributes = Partial<AccessorIdentifierAttributesWithClassName & AccessorIdentifierAttributesWithSahiIndex>
