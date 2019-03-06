module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    name: 'sakuli-legacy',
    displayName: 'sakuli-legacy',
    rootDir: 'src/',
    testMatch: [
        `**/!(*.aix.*|*.darwin.*|*.freebsd.*|*.linux.*|*.openbsd.*|*.sunos.*|*.win32.*)+(spec|test).[jt]s?(x)`,
        `**/?(*.${process.platform}.)+(spec|test).[jt]s?(x)`
    ]
};