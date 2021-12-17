import { recordToPropertiesString } from "./configuration-record.type";
import { EOL } from "os";

describe("recordTo", () => {
  it("should render comments with leading # and other properties without #", () => {
    const result = recordToPropertiesString({
      "comment-me-out": { isComment: true, value: "i-am-hidden" },
      "show-me-out": { isComment: false, value: "i-am-visible" },
    });

    expect(result).toContain("#comment-me-out=i-am-hidden");
    expect(result).toContain("\nshow-me-out=i-am-visible");
    expect(result.endsWith(EOL)).toBeTruthy();
  });
});
