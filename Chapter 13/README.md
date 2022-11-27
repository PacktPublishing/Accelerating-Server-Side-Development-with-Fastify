# Project name

A short introduction to the project. What it does, how it works, etc.
Adding useful links to the project documentation is a good idea.

## Requirements

You need these external resources:

- Node.js v16.x within npm v7.x
- Docker: https://docs.docker.com/get-docker/

## How to install

This project uses `npm`. Install it running:

```
npm ci
```

## How to start

You need a `.env` file in the root directory before starting the project.
Check the `.env.sample` file to know what to put in it.

```
npm start
```

## How to develop

To run the application you need to setup your `.env` linking the company's 
development database and run:

```
npm run dev
```

## How to test

The tests are written using the [`tap`](https://www.npmjs.com/package/tap) framework.
To run them you need to run:

```
npm test
```

## How to deploy

Example:

> Our CI/CD pipeline is based on XXX and it will deploy the application whenever a new merge is detected in the `main` branch.

## Need help?

Contact your colleagues at hi@help.com
