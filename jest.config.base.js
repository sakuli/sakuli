module.exports = {
    preset: 'ts-jest',
    roots: [
        "<rootDir>/src",
    ],
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        "(**/*.spec).(tsx?|ts?)$"
    ],
    verbose: true
};