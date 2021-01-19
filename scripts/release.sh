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

pushd ..

git fetch
printf "\n%s\n" "Create new branch release/${RELEASE_VERSION}"
git checkout -b release/${RELEASE_VERSION} origin/develop

printf "\n%s\n" "Run npm install"
npm i

printf "\n%s\n"  "Change Version in package.json"
npx lerna version --no-git-tag-version --no-push -y --exact ${RELEASE_VERSION}
printf "\n%s\n"  "Update @sakuli/plugin-validator"
npx lerna add @sakuli/plugin-validator@${RELEASE_VERSION} -E --scope=@sakuli/cli --no-bootstrap

printf "\n%s\n" "Run npm run rebuild"
npm run rebuild

printf "\n%s\n"  "Run npm run audit"
npm run audit

printf "\n\n%s "  "Please update the changelog before continuing. Would you like to commit and push these changes? (y/n)"
read CHANGE_CONFIRMATION
[[ ! "${CHANGE_CONFIRMATION}" == "y" ]] && exit 1

printf "\n%s\n"  "Committing changes"
git commit -am "Release ${RELEASE_VERSION}"
printf "\n%s\n" "Pushing changes"
git push --set-upstream origin release/${RELEASE_VERSION}

printf "\n\n%s\n" "Verify successful builds on GH Actions before continuing."
echo "To to release the plugin-validator use following commands:"
printf "%s\n" "git tag -a v${RELEASE_VERSION} -m \"Release ${RELEASE_VERSION}\""
echo "git push --tags"

popd
