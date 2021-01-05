#!/usr/bin/env bash
set -e

echo $PWD

npm ci
npm run build
npm run test:it

