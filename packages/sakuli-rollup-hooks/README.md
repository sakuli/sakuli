# @sakuli/rollup-hooks

**TLDR;**

This is a essential Part of Sakuli which handles the preprocessing of Testfiles. It is usually _not_ nesseccary for Sakuli-Endusers to have any knowledge about the internals of this package.

## Usage

This package provdies a preset that implements the following lifecycle hooks:

- readFileContent
- requestContext

It is required by `@sakuli/legacy` but can also be used (and considered) as the default file transformer for any Sakuli extension.

The basic task is to take a given test-file and bundle it together with it's dependencies into a single _script-string_. Sakuli will than create a [Script-Object](https://nodejs.org/docs/latest-v10.x/api/vm.html#vm_new_vm_script_code_options) from this source.

As the name of this package tells, [Rollup](https://rollupjs.org/guide/en/) does the heavy lifting of the bundling process. There is not much magic in this process. Some points are still interesting:

- It enables Sakuli to use ES6-Modules
- The output format is [`commonjs`](https://rollupjs.org/guide/en/#core-functionality), in order to work properly with external required modules sakuli also injects the `require` function from its scope.
- If the extension of the provided file is `.ts` or `.tsx` the plugin `rollup-plugin-typescript2` is added as a plugin
