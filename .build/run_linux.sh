#!/usr/bin/env bash
set -e

echo $PWD

npm ci
npm run build
FIREFOX_WD_URL=http://localhost:4444/wd/hub CHROME_WD_URL=http://localhost:4445/wd/hub npm test -- --runInBand --ci --bail
if [[ $TRAVIS_NODE_VERSION = "lts/erbium" ]]; then
  sonar-scanner
fi
npm run test:it
npm run test:e2e
