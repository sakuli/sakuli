#!/usr/bin/env bash
set -e

export NVM_DIR="$HOME/.nvm"
[[ -s "$NVM_DIR/nvm.sh" ]] && \. "$NVM_DIR/nvm.sh"

if [[ $# -lt 1 ]]; then
echo "No working directory provided, using default"
targetDir=$PWD
else
targetDir=$1
fi
if [[ $# -lt 2 ]]; then
echo "No node version provided, using default"
nodeVersion="lts/dubnium"
else
nodeVersion=$2
fi

echo "Entering working directory $targetDir"
cd $targetDir
echo "Installing node version $nodeVersion"
nvm install $nodeVersion
echo "Installing dependencies"
docker pull selenium/standalone-chrome-debug
docker pull httpd
npm i -g lerna gh-pages
echo "npm ci"
npm ci > /dev/null 2>&1
echo "git fetch --unshallow"
git fetch --unshallow
echo "lerna run build"
lerna run build
echo "lerna run test"
npm test -- --coverage --runInBand --ci --bail --coverageReporters=text-lcov | npx coveralls
