module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    name: 'sakuli-legacy',
    displayName: 'sakuli-legacy',
    rootDir: 'src/',
    testMatch: [
        `**/(*.it.)+(spec|test).[jt]s?(x)`
    ]
};