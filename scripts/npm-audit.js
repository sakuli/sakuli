#!/bin/node

const {exec} = require('child_process');
const {promises} = require('fs');
const {join} = require('path');
const {inspect} = require('util')


async function cmd(command, cwd = process.cwd()) {
    return new Promise((res, rej) => {
        exec(command, {cwd}, (err, stdout, stderr) => {
            if (err) {
                rej(stderr || stdout);
            } else {
                res(stdout);
            }
        });

    })
}

async function getPackages() {
    const result = await cmd('lerna ls --json --loglevel=silent');
    return JSON.parse(result);
}

async function getPackageJson(path) {
    return promises.readFile(join(path, 'package.json')).then(buf => buf.toString());
}

(async () => {
    const packages = await getPackages();
    const packageNames = packages.map(p => p.name);
    for (let lernaPackage of packages) {
        const packageJsonContent = await getPackageJson(lernaPackage.location);
        const packageJson = JSON.parse(packageJsonContent);
        console.log(`Running ${lernaPackage.name}`)

        try {
            function filterDeps (deps) {
                return Object.entries(deps || {}).filter(([name]) => {
                    return !packageNames.some(n => n === name)
                }).reduce((deps, [name, version]) => ({...deps, [name]: version}), {})
            }

            const newPackageJson = ({
                ...packageJson,
                dependencies: filterDeps(packageJson.dependencies),
                devDependencies: filterDeps(packageJson.devDependencies)
            });

            await promises.writeFile(join(lernaPackage.location, 'package.json'), JSON.stringify(newPackageJson, null, 2))

            try {
                console.log(`Run audit in ${lernaPackage.location}`)
                const audit = await cmd('npm audit', lernaPackage.location);
                console.log('Audit result');
                console.log(audit);
            } catch (e) {
                console.log('Audit errors');
                console.error(e)
                console.log('We will fix this for you');
                const auditFix = await cmd('npm audit fix', lernaPackage.location);
                console.log(auditFix);
            }


        } catch(e) {
            console.error(e);
        } finally {
            await promises.writeFile(join(lernaPackage.location, 'package.json'), packageJsonContent)
        }
    }
    //console.log(inspect(packages));
})();