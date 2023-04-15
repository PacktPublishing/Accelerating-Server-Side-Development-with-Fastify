# Chapter 13 - Performance Assessment and Improvement

We all know that Fastify is fast. But is your code fast enough for Fastify? Learn how to measure your code's performance to avoid introducing speed regressions. Improve the throughput of your application, find bottlenecks in your code, avoid production issues, and serve more requests with fewer resources. You will learn how to add an instrumentation library to a Fastify application to analyze in detail how the server reacts to an high volume traffic. We will get an overview to understand and act accordingly on the measurements to keep up our server performance and in an healthy status.

## How to use this folder?

In this folder you will find the source code of the chapter.
The filenames are the same as the chapter's sections.

You can run the chapter's code by starting the application:

```bash
npm run zipkin:start
npm run mongo:start
npm run dev
```

Before running the code examples, you need to install the dependencies running `npm install`.

## Trouble?

If you face any difficulties while reading the chapter or while trying out the code examples, feel free to ask for assistance via the [official Discord chat](https://discord.com/channels/725613461949906985/1096783084633985074).
However, make sure to join the [Fastify server](https://discord.gg/fastify) beforehand.
