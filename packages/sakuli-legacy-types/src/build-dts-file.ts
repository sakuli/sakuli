import { Application, DeclarationReflection, TSConfigReader } from "typedoc";
import { join } from "path";
import { renderDeclaration } from "./template.function";
import { mkdirSync, writeFileSync } from "fs";
import { throwIfAbsent } from "@sakuli/commons";
import { Reflection, TraverseProperty, } from "typedoc/dist/lib/models/reflections/abstract";
import { ScriptTarget } from "typescript";

const outDir = "dist";
const projectDir = join(__dirname, "..", "..", "sakuli-legacy");
const srcDir = join(projectDir, "src");
const app = new Application();
app.options.addReader(new TSConfigReader());
app.bootstrap({
  tsconfig: join(projectDir, "tsconfig.json"),
  exclude: ["**/*.spec.ts", "**/__mocks__/*"],
  entryPoints: [srcDir],
  entryPointStrategy: "expand"
});
app.options.setCompilerOptions(
  app.getEntryPoints()?.map(entryPoint => entryPoint.sourceFile.fileName) ?? [],
  {
    mode: "file",
    target: ScriptTarget.ES5,
    composite: true,
    downlevelIteration: true,
    strict: true,
    esModuleInterop: true,
    experimentalDecorators: true,
  },
  undefined
);
const projection = app.convert();

if (projection) {
  const api = throwIfAbsent(projection.findReflectionByName("SahiApi"));
  const reflections: DeclarationReflection[] = [];

  api.traverse((i: Reflection, _: TraverseProperty) => {
    if (i instanceof DeclarationReflection) {
      reflections.push(i);
    }
  });
  const dtsFileContent = renderDeclaration(reflections);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.d.ts"), dtsFileContent, { flag: "w" });
}
