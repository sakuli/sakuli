import {parseModule} from 'esprima';
import {ExpressionStatement, Node} from 'estree'
import {generate} from 'escodegen'
import {isSahiFunction} from "./sahi-functions.const";

export function migrateV1Code(code: string): string {
    const ast = parseModule(code, {
        comment: true,
        range: true,
        loc: true
    });
    //console.log(inspect(ast, true, null, true));
    // yes this is really sideeffectish :/
    const changeLog: string[] = [];

    function writeAsyncChangeLog(node: any) {
        changeLog.push(`${node.loc.start.line}:${node.loc.start.column} Changed ${node.callee.name} to await ${node.callee.name}`)
    }

    const newBody = ast.body.map(function mapSahiToAsync(node: Node): Node {
        let previousLogLength = -1;
        if (node.type === 'FunctionDeclaration') {
            previousLogLength = changeLog.length;
        }

        [   // Properties with nested nodes
            'alternate',
            'argument',
            'arguments',
            'block',
            'body',
            'callee',
            'consequent',
            'declaration',
            'elements',
            'expression',
            'expressions',
            'handler',
            'key',
            'left',
            'param',
            'property',
            'quasis',
            'right',
            'test',
            'tag',
            'value',
            'leadingComments',
            'trailingComments'
        ].forEach(prop => {
            if ((node as any)[prop] && !Array.isArray((node as any)[prop])) {
                (node as any)[prop] = mapSahiToAsync((node as any)[prop] as any) as any;
            }
            if ((node as any)[prop] && Array.isArray((node as any)[prop])) {
                (node as any)[prop] = ((node as any)[prop] as any).map(mapSahiToAsync) as any[];
            }
        });

        if (node.type === 'FunctionDeclaration' && previousLogLength >= 0 && previousLogLength < changeLog.length) {
            node.async = true;
        }

        if (
            node.type === 'CallExpression'
            && node.callee.type === 'Identifier'
            && isSahiFunction(node.callee.name)
        ) {
            writeAsyncChangeLog(node);
            return ({
                type: 'AwaitExpression',
                argument: node
            })
        }

        return node;
    });
    return generate(wrapWithAsyncIIFE(newBody));

}

function wrapWithAsyncIIFE(body: any[], sourceType: string = 'module') {
    return ({
        "type": "Program",
        "body": [
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "CallExpression",
                            "callee": {
                                "type": "ArrowFunctionExpression",
                                "id": null,
                                "params": [],
                                "body": {
                                    "type": "BlockStatement",
                                    body
                                },
                                "generator": false,
                                "expression": false,
                                "async": true
                            },
                            "arguments": []
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "then"
                        }
                    },
                    "arguments": [
                        {
                            "type": "Identifier",
                            "name": "done"
                        }
                    ]
                }
            }
        ],
        sourceType
    })
}