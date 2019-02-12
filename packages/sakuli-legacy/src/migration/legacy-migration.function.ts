import {parseModule} from 'esprima';
import {ExpressionStatement, Node} from 'estree'
import {generate} from 'escodegen'
import {isSahiFunction, registerSahiFunction} from "./sahi-functions.const";
import {inspect} from "util";

function writeAsyncChangeLog(changeLog: string[], node: any) {
    changeLog.push(`${node.loc.start.line}:${node.loc.start.column} Changed ${node.callee.name} to await ${node.callee.name}`)
}

function mapSahiToAsync(node: Node, changeLog: string[], parent: any | null): Node {
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
        if(typeof node === 'object')
            try {
                if ((node as any)[prop] && !Array.isArray((node as any)[prop])) {
                    (node as any)[prop] = mapSahiToAsync((node as any)[prop] as any, changeLog, node) as any;
                }
                if ((node as any)[prop] && Array.isArray((node as any)[prop])) {
                    (node as any)[prop] = ((node as any)[prop] as any).map((n: any) => mapSahiToAsync(n, changeLog, node)) as any[];
                }
            } catch(e) {
                console.warn(e.message);
                console.warn(prop, inspect(node, true, null, true));
            }
    });

    if (node.type === 'FunctionDeclaration' && previousLogLength >= 0 && previousLogLength < changeLog.length) {
        node.async = true;
        if(node.id != null) {
            registerSahiFunction(node.id.name);
        }
    }

    if (
        node.type === 'CallExpression'
        && node.callee.type === 'Identifier'
        && parent.type != 'AwaitExpression'
        && isSahiFunction(node.callee.name)
    ) {
        writeAsyncChangeLog(changeLog, node);
        return ({
            type: 'AwaitExpression',
            argument: node
        })
    }

    return node;
}

export function migrateV1Code(code: string): string {
    const ast = parseModule(code, {
        comment: true,
        range: true,
        loc: true
    });
    const changeLog: string[] = [];

    const newBody = ast.body
        // one run is needed in order to identify functions which are actually async
        // in the second run calls on this functions where prefixed with await
        .map(node => mapSahiToAsync(node, changeLog, ast))
        .map(node => mapSahiToAsync(node, changeLog, ast));

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