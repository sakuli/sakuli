import { migrateV1Code } from "./legacy-migration.function";
import { stripIndent } from "common-tags";

describe("migrateV1Code", () => {
  it("should wrap code in an iife", () => {
    const v2Code = migrateV1Code(stripIndent`
            alert('Hello World');
        `);
    expect(v2Code.trim().startsWith("(async () => {")).toBe(true);
    expect(v2Code.trim().endsWith("})().then(done);")).toBe(true);
  });

  it("should migrate simple sahi functions", () => {
    const v2Code = migrateV1Code(stripIndent`
            _highlight('Test');
            _link('huhu')
        `);
    expect(v2Code).toContain("await _highlight");
    expect(v2Code).toContain("await _link");
  });

  it("should migrate nested calls", () => {
    const v2Code = migrateV1Code(stripIndent`
            _highlight(_link('huhu'));
        `);
    expect(v2Code).toContain("await _highlight");
    expect(v2Code).toContain("await _link");
  });

  it("should migrate within if statements", () => {
    const v2Code = migrateV1Code(stripIndent`
            if(_isVisible(_div('test'))) {
                _highlight(_link('huhu'))
            } else {
                _link('else')
            }
        `);
    expect(v2Code).toContain("await _highlight");
    expect(v2Code).toContain("await _link('huhu')");
    expect(v2Code).toContain("await _div");
    expect(v2Code).toContain("await _link('else')");
  });

  it("should migrate functions which contains sahi calls", () => {
    const v2Code = migrateV1Code(stripIndent`
            function iWillBeAsync() {
                _link('Hello');
            }
            
            function iWillRemainSync() {
                alert('Hello');
            }
        `);

    expect(v2Code).not.toContain("async function iWillRemainSync()");
    expect(v2Code).toContain("function iWillRemainSync()");
    expect(v2Code).toContain("async function iWillBeAsync()");
  });

  it("should migrate within try/catch block", () => {
    const v2Code = migrateV1Code(stripIndent`
            try {
                _link('huhu')
            } catch(e) {
                _div('huhu')
            }
        `);
    expect(v2Code).toContain("await _link");
    expect(v2Code).toContain("await _div");
  });

  it("should migrate within loops", () => {
    const v2Code = migrateV1Code(stripIndent`
            for(var i = 0; i <= 10; i++) {
                _link('for')
            }
            while(true) {
                _link('while')
            }
            do {
                _link('do-while')
            } while(true)
        `);
    expect(v2Code).toContain(`await _link('for')`);
    expect(v2Code).toContain(`await _link('while')`);
    expect(v2Code).toContain(`await _link('do-while')`);
  });

  it("should add await to calls of changed async functions", () => {
    const v2Code = migrateV1Code(stripIndent`
        
            _highlightClick(_link('test'));
            
            function _highlightClick($el) {
                _highlight($el);
                _click($el)
            }        
        `);

    expect(v2Code).toContain(`async function _highlightClick`);
    expect(v2Code).toContain(`await _highlightClick(await _link('test'))`);
  });
});
