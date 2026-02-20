import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from './init.js'
import { Plan, SubscriptionStatus } from '@prisma/client'
import { createCheckoutSession } from '../stripe.js'
import { AgentService } from '../agentService.js'
import { OpenClawConfigService } from '../openclaw-config.js'
import * as DockerProvider from '../docker.js'

export const authRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => ctx.user),
})

export const agentsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const agent = await ctx.prisma.agent.findUnique({
      where: { userId: ctx.user.id },
    })
    if (!agent) return null
    const baseUrl = process.env.GATEWAY_BASE_URL || 'http://localhost'
    return {
      ...agent,
      qrUrl: agent.port ? `${baseUrl}:${agent.port}` : null,
    }
  }),
  restart: protectedProcedure.mutation(async ({ ctx }) => {
    const agent = await ctx.prisma.agent.findUnique({
      where: { userId: ctx.user.id },
    })
    if (!agent) return { success: false, error: 'No agent found' }
    try {
      await AgentService.restartAgent(agent.id)
      return { success: true }
    } catch (e) {
      return { success: false, error: (e as Error).message }
    }
  }),
  provision: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const agentId = await AgentService.createAgent(ctx.user.id)
      return { success: true, agentId }
    } catch (e) {
      return { success: false, error: (e as Error).message }
    }
  }),
})

export const subscriptionsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.subscription.findFirst({
      where: { userId: ctx.user.id, status: SubscriptionStatus.active },
      orderBy: { createdAt: 'desc' },
    })
  }),
  createCheckout: protectedProcedure
    .input(z.enum(['Hosting', 'Complet']))
    .mutation(async ({ ctx, input }) => {
      const url = await createCheckoutSession(
        ctx.user.id,
        input as Plan,
        `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard?checkout=success`,
        `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard/billing?checkout=cancelled`
      )
      return { url }
    }),
})

export const paymentsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.payment.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }),
})

const todos = [
  { id: 1, name: 'Get groceries' },
  { id: 2, name: 'Buy a new phone' },
  { id: 3, name: 'Finish the project' },
]

export const todosRouter = createTRPCRouter({
  list: publicProcedure.query(() => todos),
  add: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      const newTodo = { id: todos.length + 1, name: input.name }
      todos.push(newTodo)
      return newTodo
    }),
})

export const skillsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    // Get all skills and their status for this user's agent
    const agent = await ctx.prisma.agent.findUnique({
      where: { userId: ctx.user.id },
      include: { skills: true }
    })
    
    const allSkills = await ctx.prisma.skill.findMany()
    
    return allSkills.map(skill => {
      const agentSkill = agent?.skills.find(as => as.skillId === skill.id)
      return {
        ...skill,
        enabled: agentSkill ? agentSkill.enabled : skill.defaultEnabled
      }
    })
  }),
  toggle: protectedProcedure
    .input(z.object({ skillId: z.string(), enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const agent = await ctx.prisma.agent.findUnique({
        where: { userId: ctx.user.id }
      })
      if (!agent) throw new Error('No agent found')
      
      const result = await ctx.prisma.agentSkill.upsert({
        where: {
          agentId_skillId: {
            agentId: agent.id,
            skillId: input.skillId
          }
        },
        create: {
          agentId: agent.id,
          skillId: input.skillId,
          enabled: input.enabled
        },
        update: {
          enabled: input.enabled
        }
      })
      
      // Regenerate config and restart agent to apply changes
      try {
        const config = await OpenClawConfigService.generateConfigForAgent(agent.id);
        await OpenClawConfigService.writeConfigToVolume(agent.id, config);
        // Note: In production, you might want to restart the container here
        // await AgentService.restartAgent(agent.id);
      } catch (e) {
        console.error('Failed to update OpenClaw config:', e);
      }
      
      return result
    }),
})

export const adminRouter = createTRPCRouter({
  getAgentConfig: protectedProcedure.query(async ({ ctx }) => {
    const agent = await ctx.prisma.agent.findUnique({
      where: { userId: ctx.user.id },
      include: { config: true }
    })
    return agent?.config || { envVars: {} }
  }),

  getAgentLogs: protectedProcedure.query(async ({ ctx }) => {
    const agent = await ctx.prisma.agent.findUnique({
      where: { userId: ctx.user.id }
    })
    if (!agent) return 'No agent found'
    return DockerProvider.getContainerLogs(agent.id)
  }),

  updateAgentEnv: protectedProcedure
    .input(z.object({
      envVars: z.record(z.string(), z.string())
    }))
    .mutation(async ({ ctx, input }) => {
      const agent = await ctx.prisma.agent.findUnique({
        where: { userId: ctx.user.id }
      })
      if (!agent) throw new Error('No agent found')

      const existing = await ctx.prisma.agentConfig.findUnique({
        where: { agentId: agent.id }
      })

      const existingEnv = (existing?.envVars as Record<string, string>) || {}
      const mergedEnv = { ...existingEnv, ...input.envVars }

      const config = await ctx.prisma.agentConfig.upsert({
        where: { agentId: agent.id },
        create: {
          agentId: agent.id,
          envVars: mergedEnv as any
        },
        update: {
          envVars: mergedEnv as any
        }
      })

      return config
    }),

  restartAgent: protectedProcedure.mutation(async ({ ctx }) => {
    const agent = await ctx.prisma.agent.findUnique({
      where: { userId: ctx.user.id }
    })
    if (!agent) throw new Error('No agent found')
    await AgentService.restartAgent(agent.id)
    return { success: true }
  }),

  fixIdentity: protectedProcedure.mutation(async ({ ctx }) => {
    const agent = await ctx.prisma.agent.findUnique({
      where: { userId: ctx.user.id }
    })
    if (!agent) throw new Error('No agent found')
    await DockerProvider.wipeAgentIdentity(agent.id)
    return { success: true }
  }),

  testDiscord: protectedProcedure
    .input(z.object({
      token: z.string()
    }))
    .mutation(async ({ input }) => {
      // Simple validation - check if token format is correct
      if (!input.token || input.token.length < 50) {
        throw new Error('Invalid Discord token format')
      }
      // In production, you'd make an actual Discord API call here
      return { success: true, message: 'Token format valid' }
    }),
})

export const trpcRouter = createTRPCRouter({
  auth: authRouter,
  agents: agentsRouter,
  subscriptions: subscriptionsRouter,
  payments: paymentsRouter,
  todos: todosRouter,
  skills: skillsRouter,
  admin: adminRouter,
})

export type TRPCRouter = typeof trpcRouter
