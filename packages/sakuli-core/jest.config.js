module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  name: "sakuli-core",
  displayName: "sakuli-core",
  rootDir: "src/",
  testMatch: [
    `**/!(*.+(aix|it).*|*.+(darwin|it).*|*.+(freebsd|it).*|*.+(linux|it).*|*.+(openbsd|it).*|*.+(sunos|it).*|*.+(win32|it).*)+(spec|test).[jt]s?(x)`,
    `**/?(*.${process.platform}!(.it).*)+(spec|test).[jt]s?(x)`,
  ],
  testRunner: "jest-jasmine2",
};
