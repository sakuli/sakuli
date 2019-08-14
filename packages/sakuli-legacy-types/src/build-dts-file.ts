import {Application, DeclarationReflection} from 'typedoc';
import {join} from "path";
import {renderDeclaration} from "./template.function";
import {writeFileSync, mkdirSync} from "fs";

const outDir = 'dist';
const projectDir = join(__dirname, '..', '..', 'sakuli-legacy');
const srcDir = join(projectDir, 'src');
const app = new Application({
    tsconfig: join(projectDir, 'tsconfig.json'),
    exclude: ['**/*.spec.ts', '**/__mocks__/*']
});

const projection = app.convert(
    app.expandInputFiles([srcDir])
);

if (projection) {
    const api = projection.findReflectionByName('SahiApi');
    const reflections: DeclarationReflection[] = [];
    api.traverse(i => {
        if (i instanceof DeclarationReflection) {
            reflections.push(i);
        }
    });
    const dtsFileContent = renderDeclaration(reflections);
    mkdirSync(outDir, {recursive: true});
    writeFileSync(join(outDir, 'index.d.ts'), dtsFileContent, {flag: 'w'});

} else {

}


