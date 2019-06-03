import {createProgram, Declaration, Type,  InterfaceDeclaration, ModuleKind, Node, ScriptTarget, SyntaxKind} from 'typescript';
import {join} from 'path';
import {inspect} from "util";

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
    const dslInterface = syntaxList.getChildren(sourceFile).find(n => n.kind === SyntaxKind.InterfaceDeclaration);
    if (isInterface(dslInterface)) {
        const dslType = checker.getTypeAtLocation(dslInterface);
        const props = checker.getPropertiesOfType(dslType);
        props
            .filter(p => p.getName() === '_click')
            .map(p => `
            ${inspect(omit(checker.getTypeAtLocation(p.valueDeclaration)), true, 5, true)} 
        `).forEach(o => {
            console.log(o);
        });

    }
}


function omit(dec: Type | any) {
    const {checker, ...rest} = dec;
    return rest;
}