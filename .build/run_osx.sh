#!/usr/bin/env bash
set -e

echo $PWD

npm ci
lerna run build > /dev/null 2>&1
lerna run test:e2e

