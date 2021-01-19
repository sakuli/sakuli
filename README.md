# Sakuli2

[![Build Status](https://github.com/sakuli/sakuli/workflows/Continuous%20Delivery/badge.svg)](https://github.com/sakuli/sakuli/actions?query=workflow:%22Continuous+Delivery%22)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=sakuli%3Asakuli&metric=alert_status)](https://sonarcloud.io/dashboard?id=sakuli%3Asakuli)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=sakuli%3Asakuli&metric=coverage)](https://sonarcloud.io/dashboard?id=sakuli%3Asakuli)

## Why Sakuli 2?

In the past, we encountered a lot of issues with the architecture of Sakuli. But first and foremost the inactive
development of Sahi and its deep integration into Sakuli was one of the main reasons to rethink our technology stack.

So we decide to create a brand-new platform which allows users to test and monitor their systems and developers to extend
the platform to their own needs.

## What is the new Stack of Sakuli2?

We started to make a complete core code rewrite based on NodeJs and Typescript.

- **Node.js** because we wanted the same language for our platform and testcases (Sakuli was written in Java while testcases where executed in a modified version of RhinoJs-Engine)
- **Typescript** to provide clear interfaces for third-party devs.

We also replaced the engines for web- and native checks:

- **Sahi** is replaced by Webdriver / Selenium
- **Sikuli** is replaced by [nut.js](https://github.com/nut-tree/nut.js)

while we try our best to keep the sakuli api backwards compatible.

## What can I expect from Sakuli2...

### ...as a user / tester

Expect the full power of Sakuli, which means testing and monitoring systems either in web or native.

### ...as a developer

Use the full power of typescript, nodejs and their corresponding ecosystems.

# Installation

Please refer to the [Sakuli website](https://sakuli.io) and the [Getting Started](https://sakuli.io/docs/getting-started/) guide for installation instructions.

# Development

## Workstation

To start developing Sakuli 2 some setup on your workstation is required.

- Make sure to have the active LTS version (v12) of node installed.
- Make sure to have docker installed and started
- Make sure to execute `docker pull selenium/standalone-chrome-debug` before you start developing.

## Building the Project

In some situations, it is necessary to build/rebuild the sources (e.g. after changing branches) to create a consistent
state in the project.

To do so, please use `npm run rebuild`

## Executing the current state of Sakuli

During development, you might want to test the overall behavior of Sakuli from a developers' perspective. Therefore, we
created a `packages/integration-tests` module containing a Sakuli project using Sakuli at the current state of the
repository.

Build and execute Sakuli as it is in the current state of the repository:

```shell script
npm run rebuild
cd packages/integration-tests
npx sakuli
```

_This step has to be done after every code change so that the changes take place in the prepared Sakuli environment._

## Updating dependencies

Long story short: `npm run update`

As this is a multi-module project using [lerna](https://www.npmjs.com/package/lerna), dependency updates have to be
consistent for the whole project. To achieve this, we use the [lerna-update-wizard](https://www.npmjs.com/package/lerna-update-wizard)
and added the npm script `npm run update`.

## Pre-commit Hooks

We are using [Prettier](https://github.com/prettier/prettier) as an opinionated code formatter in combination with
[husky](https://github.com/typicode/husky) for the pre-commit hook.
If you are using a node version manager, make sure to create `~/.huskyrc` with the following content:

```bash
# ~/.huskyrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```
