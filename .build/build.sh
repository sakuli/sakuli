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
echo "npm i -g lerna"
npm i -g lerna
echo "clean build"
git clean -fdx
echo "npm ci"
npm ci
echo "lerna bootstrap"
lerna bootstrap --ci
echo "lerna run build"
lerna run build
echo "npm run test:it"
npm run test:it
