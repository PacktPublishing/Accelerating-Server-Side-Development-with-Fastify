# Chapter 7 - Building a RESTful API

In this chapter, we will build a well-structured RESTful API. 
We will define routes, hooks, connect to a data source, and secure the endpoints.


## How to use this folder?

In this folder, you will find the source code of the chapter.
The filenames are the same as the chapter's sections.

You can run the chapter's code by starting the application:

```bash
npm run dev
```

Before running the code examples, you need to install the dependencies running `npm install`.

## Trouble?

If you face any difficulties while reading the chapter or while trying out the code examples, feel free to ask for assistance via the [official Discord chat](https://discord.com/channels/725613461949906985/1096783084633985074).
However, make sure to join the [Fastify server](https://discord.gg/fastify) beforehand.

## Readme example

✏️ As discussed in the `Improving the application structure` section, the following text is an example
of a good application's README.md file, use it as a template to create your own and improve it based on your needs!

--------------------------------------------------------------------------------

# Project name

A short introduction to the project. What it does, how it works, etc.
Adding useful links to the project documentation is a good idea.

## Requirements

You need these external resources:

- Node.js v18.x within npm v7.x
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
