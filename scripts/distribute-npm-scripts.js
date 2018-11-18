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
            .map(package => join(packagesDir, package, 'package.json'))
            .forEach(async sharedPackageJson => {
                const pkgJson = await readJson(sharedPackageJson);
                const { currentScript } = pkgJson;
                const newPackageJson = {
                    ...pkgJson,
                    scripts: {
                        ...pkgJson.scripts,
                        ...sharedScripts
                    }
                }
                console.log('Would write to ' + sharedPackageJson);
                console.log(JSON.stringify(newPackageJson, null, 2))
                await writeJson(sharedPackageJson, newPackageJson);
            })
    }
})();