#!/usr/bin/env bash

export AWS_ECR_HOST="OverrideMeWithAwsAccountNumber.dkr.ecr.eu-west-1.amazonaws.com"
export AWS_PROFILE="OverrideMeWithAppropriateAwsProfileName"
export SAKULI_LICENSE_KEY="OverrideMeWithSakuliLicenseKey"

aws --profile="${AWS_PROFILE}" \
    ecr get-login-password \
    | docker login \
        --username AWS \
        --password-stdin \
        "https://${AWS_ECR_HOST}"

docker run -it --rm \
   -e SAKULI_LICENSE_KEY \
   -p 6901:6901 \
   "${AWS_ECR_HOST}/OverrideMeWithRegistryEndpointName/sakuli:2.3.0" \
   /bin/bash

# in container do the following:
############################################################
#   cd /tmp
#   git clone https://github.com/progaddict/sakuli.git
#   cd sakuli
#   git reset --hard 339e360786342e1171a71dd113641665a0fbe0bc
#   cd packages/e2e
#   echo commit info:
#   echo "$(git log -n 1)"
#   echo node version:
#   echo "$(node --version)"
#   echo npm version:
#   echo "$(npm --version)"
#   npm ci --production
#   cd e2e-suite
#   npx sakuli run .
############################################################
# and observe that a Sakuli test succeeds
