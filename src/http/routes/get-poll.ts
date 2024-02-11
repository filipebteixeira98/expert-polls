import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../../lib/prisma'
import { redis } from '../../lib/redis'

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    })

    const { pollId } = getPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!poll) {
      return reply.status(400).send({ message: 'Poll not found!' })
    }

    const votesResult = await redis.zrange(pollId, 0, -1, 'WITHSCORES')

    const formattedVotes = votesResult.reduce((obj, line, index) => {
      if (index % 2 === 0) {
        const score = votesResult[index + 1]

        Object.assign(obj, { [line]: Number(score) })
      }

      return obj
    }, {} as Record<string, number>)

    return reply.send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map((option) => {
          return {
            id: option.id,
            title: option.title,
            score: option.id in formattedVotes ? formattedVotes[option.id] : 0,
          }
        }),
      },
    })
  })
}
