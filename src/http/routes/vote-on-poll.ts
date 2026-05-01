import { randomUUID } from 'node:crypto'

import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../../lib/prisma'
import { redis } from '../../lib/redis'

import { voting } from '../../utils/voting-pub-sub'

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (request, reply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    })

    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    })

    const { pollId } = voteOnPollParams.parse(request.params)

    const { pollOptionId } = voteOnPollBody.parse(request.body)

    const doesPollExist = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      select: {
        id: true,
      },
    })

    if (!doesPollExist) {
      return reply.status(400).send({
        message: 'Poll not found!',
      })
    }

    const doesPollOptionExist = await prisma.pollOption.findFirst({
      where: {
        id: pollOptionId,
        pollId,
      },
      select: {
        id: true,
      },
    })

    if (!doesPollOptionExist) {
      return reply.status(400).send({
        message: 'Poll option not found for this poll!',
      })
    }

    let { sessionId } = request.cookies

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      })

      if (
        userPreviousVoteOnPoll &&
        userPreviousVoteOnPoll.pollOptionId !== pollOptionId
      ) {
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id,
          },
        })

        const totalVotes = await redis.zincrby(
          pollId,
          -1,
          userPreviousVoteOnPoll.pollOptionId
        )

        voting.publish(pollId, {
          pollOptionId: userPreviousVoteOnPoll.pollOptionId,
          votes: Number(totalVotes),
        })
      } else if (userPreviousVoteOnPoll) {
        return reply
          .status(400)
          .send({ message: 'You already have voted on this poll!' })
      }
    }

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true,
      })
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    })

    const totalVotes = await redis.zincrby(pollId, 1, pollOptionId)

    voting.publish(pollId, {
      pollOptionId,
      votes: Number(totalVotes),
    })

    return reply.status(201).send()
  })
}
