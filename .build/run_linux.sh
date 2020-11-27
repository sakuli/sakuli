#!/usr/bin/env bash
set -e

echo $PWD

export FIREFOX_WD_URL=http://localhost:4444/wd/hub
export CHROME_WD_URL=http://localhost:4445/wd/hub

npm ci
npm run build
npm run coverage:clean
npm test -- --runInBand --ci --bail
npm run test:it
npm run coverage:merge
npm run coverage:merge-report
sonar-scanner
npm run test:e2e
