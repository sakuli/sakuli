#!/bin/node

/**
 *
 * For development only
 *
 * this will take the script from sharedScripts property in package.json and adds this script to your packages
 *
 */

const args = require('yargs').argv;
const {
    readJson,
    writeJson,
    readdir
} = require('fs-extra');
const {
    join
} = require('path');

const dir = join(__dirname, '..');
const packagesDir = join(dir, 'packages');

(async () => {
    const packageJson = await readJson(join(dir, 'package.json'));
    const {sharedScripts} = packageJson;
    console.log()
    if (sharedScripts) {
        console.log(`Will search for packages in ${packagesDir}`)
        const packages = await readdir(packagesDir);
        packages
            .map(package => [package, join(packagesDir, package, 'package.json')])
            .forEach(async ([packageName, sharedPackageJson]) => {
                const _sharedScripts = {...sharedScripts};
                const pkgJson = await readJson(sharedPackageJson);
                if (pkgJson && pkgJson.name.startsWith('@sakuli')) {

                    Object.keys(_sharedScripts).forEach(scriptKey => {
                        _sharedScripts[scriptKey] = `${_sharedScripts[scriptKey]}`
                            .replace(/\{package\}/g, packageName)
                    })
                    const newPackageJson = {
                        ...pkgJson,
                        scripts: {
                            ...pkgJson.scripts,
                            ..._sharedScripts
                        }
                    }
                    console.log('Would write to ' + sharedPackageJson);
                    console.log(JSON.stringify(_sharedScripts, null, 2))
                    await writeJson(sharedPackageJson, newPackageJson, {
                        spaces: 2
                    });
                }
            })
    }
})();