#!/usr/bin/env bash
set -e

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get -y -o Dpkg::Options::="--force-confnew" install docker-ce

sudo apt-get install -y build-essential libxt-dev libxtst-dev libpng++-dev libxinerama-dev
docker pull selenium/standalone-chrome-debug
docker pull selenium/standalone-firefox-debug
docker pull s1hofmann/nut-ci
docker run -d -p 4444:4444 selenium/standalone-firefox-debug
docker run -d -p 4445:4444 selenium/standalone-chrome-debug
npm i -g lerna gh-pages
