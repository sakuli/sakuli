const { execSync } = require("child_process");
const isX64 = process.arch === "x64";

const install = (pkg) => {
    execSync(`npm install ${pkg}`);
};

const packages = {
    "darwin": [
    ],
    "win32": [
    ],
    "linux": [
    ]
};

if (!isX64) {
    console.log("Unsupported platform, only x64 is supported.");
    process.exit(-1);
}

const op = process.platform;

console.log(`Installing license-validator for plattform ${op}`);
install(`@sakuli/plugin-validator-${op}`);
packages[op].forEach(pkg => {
    console.log(`Installing additional runtime dependency '${pkg}'`);
    install(pkg);
});
console.log(`Done.`);