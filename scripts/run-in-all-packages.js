#!/bin/node

const { exec } = require("child_process");
const { join } = require("path");
const { readdirSync } = require("fs-extra");
const { argv } = require("yargs");

const packageFolder = join(__dirname, "..", "packages");

if (argv.cmd) {
  const { cmd } = argv;
  readdirSync(packageFolder)
    .map((package) => [package, join(packageFolder, package)])
    .forEach(([packageName, cwd]) => {
      exec(
        cmd.replace(/\{package\}/g, packageName),
        {
          cwd,
        },
        (err, stdout, stderr) => {
          if (stdout) {
            console.log(stdout);
          }
          if (stderr) {
            console.error(stderr);
          }
        }
      );
    });
} else {
  console.warn("Please provide a command via --cmd option");
}
