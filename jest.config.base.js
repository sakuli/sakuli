module.exports = {
    preset: 'ts-jest',
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        "(**/*.spec).(tsx?|ts?)$"
    ],
    verbose: true
};