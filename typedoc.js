module.exports = {
    "mode": "modules",
    exclude: [
        '**/dist/**',
        '**/node_modules/**',
        '**/*.spec.ts',
        '**/__mocks__/**',
    ],
    readme: 'README.md',
    excludePrivate: true,
    skipInternal: true,
    excludeExternals: true,
    excludeProtected: true,
    includeDeclarations: false,
    hideGenerator: true,
    theme: 'default',
    lernaExclude: [
        'packages/integration-tests'
    ]
};
