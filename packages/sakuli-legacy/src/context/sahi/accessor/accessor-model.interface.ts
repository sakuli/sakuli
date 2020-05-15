export interface AccessorIdentifierAttributesWithSahiIndex {
  sahiIndex: number;
}
export interface AccessorIdentifierAttributesWithClassName {
  className: string;
}

export interface AccessorIdentifierAttrbutesWithText {
  sahiText: string | RegExp;
}

export function isAccessorIdentifierAttributesWithSahiIndex(
  o: any
): o is AccessorIdentifierAttributesWithSahiIndex {
  return typeof o === "object" && "sahiIndex" in o;
}

export function isAccessorIdentifierAttributesWithClassName(
  o: any
): o is AccessorIdentifierAttributesWithClassName {
  return typeof o === "object" && "className" in o;
}

export function isAccessorIdentifierAttributesWithText(
  o: any
): o is AccessorIdentifierAttrbutesWithText {
  return typeof o === "object" && "sahiText" in o;
}

export function isAccessorIdentifierAttributes(
  o: any
): o is AccessorIdentifierAttributes {
  return (
    typeof o === "object" &&
    ["sahiText", "sahiIndex", "className"].some((attr) => attr in o)
  );
}

export type AccessorIdentifierAttributes = Partial<
  AccessorIdentifierAttributesWithClassName &
    AccessorIdentifierAttributesWithSahiIndex &
    AccessorIdentifierAttrbutesWithText
>;
