export interface AccessorIdentifierAttributesWithSahiIndex {
    sahiIndex: number
}

export function isAccessorIdentifierAttributesWithSahiIndex(o: any): o is AccessorIdentifierAttributesWithSahiIndex {
    return typeof o === 'object' && 'sahiIndex' in o;
}

export interface AccessorIdentifierAttributesWithClassName {
    className: string
}

export type AccessorIdentifierAttributes = Partial<AccessorIdentifierAttributesWithClassName & AccessorIdentifierAttributesWithSahiIndex>
