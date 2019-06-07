import {
    createProgram,
    InterfaceDeclaration,
    ModuleKind,
    Node,
    PropertySignature,
    ScriptTarget,
    SyntaxKind,
    Type,
    SymbolFlags
} from 'typescript';
import {join} from 'path';
import {writeFileSync} from "fs";
import {stringify} from 'flatted'
import * as dom from 'dts-dom';
import {TopLevelDeclaration} from "dts-dom";
import * as os from "os";

const interfaceFileName = join(__dirname, 'dsl.interface.ts');
const program = createProgram([
    interfaceFileName
], {
    target: ScriptTarget.ES5,
    module: ModuleKind.CommonJS
});

const isInterface = (o: Node | undefined): o is InterfaceDeclaration => !!o && o.kind === SyntaxKind.InterfaceDeclaration
const checker = program.getTypeChecker();
const sourceFile = program.getSourceFile(interfaceFileName);
if (sourceFile) {
    const [syntaxList] = sourceFile.getChildren(sourceFile);
    //checker.getSymbolsInScope(syntaxList, SymbolFlags);
    const dslInterface = syntaxList.getChildren(sourceFile).find(n => n.kind === SyntaxKind.InterfaceDeclaration);
    if (isInterface(dslInterface)) {
        const dslType = checker.getTypeAtLocation(dslInterface);
        const props = checker.getPropertiesOfType(dslType);
        const decl: TopLevelDeclaration[]  =[];
        const src: string[]= [];
        props
           // .filter(prop => "driver" === prop.getName())
            .forEach(prop => {
            if (prop.valueDeclaration.kind === SyntaxKind.PropertySignature) {
                const declaration: PropertySignature = prop.valueDeclaration as PropertySignature;
                if (declaration.type) {
                    console.log('------------------------------------------------');
                    console.log(prop.getName());
                    const t = checker.getTypeAtLocation(prop.valueDeclaration);
                    //console.log('', checker.typeToString(checker.getSymbolsInScope()))
                    console.log(checker.typeToString(t));
                    const ts = checker.typeToString(t);
                    const tout = ts.trim().startsWith('new') ? `{${ts}}` : ts;
                    src.push(`declare const ${prop.getName()} = ${tout};`);
                    switch (declaration.type.kind) {
                        case SyntaxKind.TypeReference: {
                            const type = declaration.type as any;
                            const c = dom.create.const(
                                prop.getName(),
                                dom.create.namedTypeReference(type.typeName.escapedText)
                            );
                            decl.push(c);
                            break;
                        }
                        case SyntaxKind.FunctionType: {
                            const f = dom.create.function(prop.getName(), [], dom.type.void)
                            decl.push(f);
                            break;
                        }
                    }
                }
            }
        });

        //console.log(decl.map(d => dom.emit(d)).join(""));
        writeFileSync('globals.d.ts', src.join(os.EOL));
        writeFileSync('augmented.json', stringify(props));

    }
}