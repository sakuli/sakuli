#!/usr/bin/env bash
set -e -o pipefail

function help() {
    echo "Usage: sh release.sh <RELEASE_VERSION>"
    echo ""
    echo "Parameters:"
    echo "  RELEASE_VERSION: SemVer Version of the release"
}

semver_pattern="^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$"

RELEASE_VERSION=${1}

[[ -z "${RELEASE_VERSION}" ]] && echo "ERROR: RELEASE_VERSION is empty" && help  && exit 1
[[ ! "${RELEASE_VERSION}" =~ $semver_pattern ]] && echo "ERROR: RELEASE_VERSION does not match the SemVer specification" && help && exit 1

git fetch
printf "\n%s\n" "Create new branch release/${RELEASE_VERSION}"
git checkout -b release/${RELEASE_VERSION} origin/develop
