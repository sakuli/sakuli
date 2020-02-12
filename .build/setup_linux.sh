#!/usr/bin/env bash
set -e

sudo apt-get install -y build-essential libxt-dev libxtst-dev libpng++-dev libxinerama-dev
docker pull selenium/standalone-chrome-debug
docker pull selenium/standalone-firefox-debug
docker run -d -p 4444:4444 selenium/standalone-firefox-debug
docker run -d -p 4445:4444 selenium/standalone-chrome-debug
npm i -g lerna gh-pages
