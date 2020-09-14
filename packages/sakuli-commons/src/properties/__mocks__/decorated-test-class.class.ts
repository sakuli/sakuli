import {
  ListProperty,
  NumberProperty,
  ObjectProperty,
  Property,
} from "../decorator";
import { Maybe } from "../../maybe";

export class DecoratedTestClass {
  @Property("my.property.path")
  property: string = "";

  @Property("property.2")
  @Property("property.alt")
  property2: string = "";

  simpleProperty: string = "";

  @Property("never.read.this.prop")
  neverMapped: string = "default";

  @NumberProperty("read.as.number")
  readAsNumber: number = 0;

  @ObjectProperty("read.as.object")
  readAsObject: Object = { a: "foo" };

  @ObjectProperty("read.as.object.string")
  readAsObjectString: Object = "bar";

  @ListProperty("my.little.list")
  myLittleList: Maybe<string[]>;

  @ListProperty("my.real.list")
  myRealList: Maybe<string[]>;
}
