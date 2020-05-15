import { parseSahiTestsuiteDefiniton } from "./parse-sahi-testsuite-definition.function";
import { stripIndent } from "common-tags";

describe("ParseSahiTestsuitedefiniton", () => {
  it("should parse contents of sahis testsuite.suite", () => {
    const content = stripIndent`
            // use "//" to disable single testcases
            //
            // ... define your tescase like:
            // folder-of-testcase http://www.startURL.de
            //
            case1/sakuli_demo.js http://sahi.example.com/_s_/dyn/Driver_initialized
        `;

    const sahiTestSuites = parseSahiTestsuiteDefiniton(content);

    expect(sahiTestSuites.length).toBe(1);
    expect(sahiTestSuites[0].path).toBe("case1/sakuli_demo.js");
    expect(sahiTestSuites[0].startUrl).toBe(
      "http://sahi.example.com/_s_/dyn/Driver_initialized"
    );
  });
});
