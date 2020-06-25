curl -H "Authorization: token $GITHUB_TOKEN" \
    --request POST \
    --data '{"event_type": "build-release"}' \
    https://api.github.com/repos/sakuli/sakuli-docker/dispatches