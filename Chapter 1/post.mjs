import fastify from 'fastify'
const serverOptions = {
  logger: {
    level: 'debug'
  }
}
const app = fastify(serverOptions)

const cats = [] // create an empty storage
app.post('/cat', function saveCat(request, reply) {
  // store the cat
  cats.push(request.body)
  // reply with all the cats saved till now
  reply.code(201).send({ allCats: cats }) // reply methods chaining
})

// curl --request POST 'http://127.0.0.1:8080/cat' \
//   --header 'Content-Type: application/json' \
//   --data-raw '{"name":"Fluffy"}'

// *** //

app.get('/cat/:catName(\\d+)', function readCat(request, reply) {
  const lookingFor = request.params.catName
  const result = cats.find(cat => cat.name == lookingFor)
  if (result) {
    reply.send({ cat: result })
  } else {
    reply.code(404).send(new Error(`cat ${lookingFor} not found`))
  }
})

// *** //

app.get('/cat/:catIndex/detail', function readCat(request, reply) {
  const lookingFor = request.params.catIndex
  const result = cats[lookingFor]
  if (result) {
    reply.send({ cat: result })
  } else {
    reply.code(404).send(new Error(`cat ${lookingFor} not found`))
  }
})

// *** //

app.get('/cat/*', function sendCats(request, reply) {
  reply.send({ allCats: cats })
})


await app.listen({
  port: 8080,
  host: '0.0.0.0'
})
