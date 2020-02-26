#!/usr/bin/env bash
set -e

echo $PWD

npm ci
lerna run build > /dev/null 2>&1
npm run test:it
npm run test:e2e

