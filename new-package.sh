# Basic steps to create a new Package
(mkdir $1; cd $_; npm init -y)
lerna add jest --dev
lerna add ts-jest --dev
lerna add typescript --dev
lerna add @types/jest --dev
lerna exec -- npx ts-node config:init