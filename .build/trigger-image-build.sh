curl -H "Authorization: token $SAKULIDEV_TOKEN" \
    --request POST \
    --data '{"event_type": "build-latest"}' \
    https://api.github.com/repos/sakuli/sakuli-docker/dispatches
