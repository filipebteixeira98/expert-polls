import fastify from 'fastify'

import { getPoll } from './routes/get-poll'
import { createPoll } from './routes/create-poll'

const app = fastify()

app.register(createPoll)
app.register(getPoll)

app.listen({ port: 3333 }).then(() => {
  console.log('🚀 HTTP server is running at localhost:3333!')
})
