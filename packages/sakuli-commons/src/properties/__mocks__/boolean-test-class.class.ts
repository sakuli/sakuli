import { BooleanProperty } from "../decorator";

export class DecoratedBooleanTestClass {
  @BooleanProperty("boolean.prop")
  booleanProp: boolean = false;
}
