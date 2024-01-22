# Node-project
A simple Node project implemented using koa framework and other technology stacks.

## Getting started
```js
git clone git@github.com:Xglbrilliant/Node-demo.git && cd Node-demo
# install dependency
npm install

cd src/config/keys
openssl
# Generate private key
genrsa -out private.key 2048
# Generate public key using private key
rsa -in private.key -pubout -out public.key

npm run start
```

## Introduction
It mainly uses the koa framework and some third-party libraries to implement simple tests of the interface, including user registration and login, uploading avatars, adding, deleting, modifying, commenting and replying to updates, and adding tags to updates, etc.