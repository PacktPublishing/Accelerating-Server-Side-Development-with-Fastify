import fastify from 'fastify' // 1: import the module in your project
const serverOptions = { // 2: define some settings for the server
  logger: true
}
const server = fastify(serverOptions) // 3: instantiate the server
await server.listen({ // 4: start the server
  port: 8080,
  host: '0.0.0.0'
}) 
