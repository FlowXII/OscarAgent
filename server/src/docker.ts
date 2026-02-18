import Docker from 'dockerode'
import { prisma } from './db.js'
import { AgentStatus } from '@prisma/client'
import { OpenClawConfigService } from './openclaw-config.js'

const BASE_PORT = 18789
const IMAGE = 'alpine/openclaw'

let docker: Docker | null = null

function getDocker(): Docker {
  if (!docker) {
    const socket = process.env.DOCKER_HOST || '/var/run/docker.sock'
    docker = new Docker({ socketPath: socket })
  }
  return docker
}

async function findNextPort(): Promise<number> {
  const agents = await prisma.agent.findMany({
    where: { port: { not: null } },
    select: { port: true },
  })
  const used = new Set(agents.map((a) => a.port).filter(Boolean) as number[])
  let port = BASE_PORT
  while (used.has(port)) port++
  return port
}

export async function createAgent(userId: string): Promise<string> {
  const existing = await prisma.agent.findUnique({ where: { userId } })
  if (existing) {
    await startAgent(existing.id)
    return existing.id
  }
  const port = await findNextPort()
  const agent = await prisma.agent.create({
    data: {
      userId,
      status: AgentStatus.starting,
      port,
    },
  })
  try {
    const d = getDocker()
    await d.getImage(IMAGE).inspect().catch(async () => {
      await new Promise<void>((res, rej) => {
        d.pull(IMAGE, (err: Error | null, stream: NodeJS.ReadableStream) => {
          if (err) return rej(err)
          d.modem.followProgress(stream, (err: Error | null) => (err ? rej(err) : res()))
        })
      })
    })
    
    // Get enabled skills as environment variables
    const skillsEnv = await OpenClawConfigService.getSkillsEnvVars(agent.id);
    
    // Get user-configured environment variables (Discord token, AI model, API keys)
    const agentConfig = await prisma.agentConfig.findUnique({
      where: { agentId: agent.id }
    });
    const userEnvVars = (agentConfig?.envVars as Record<string, string>) || {};
    
    // Merge both: user config takes precedence over skills
    const allEnvVars = { ...skillsEnv, ...userEnvVars };
    
    const container = await d.createContainer({
      Image: IMAGE,
      name: `oscaragent-agent-${agent.id}`,
      Env: Object.entries(allEnvVars).map(([key, value]) => `${key}=${value}`),
      User: 'root', // Run as root to avoid permission issues
      HostConfig: {
        PortBindings: {
          '18789/tcp': [{ HostPort: String(port) }],
        },
        Binds: [`oscaragent-openclaw-${agent.id}:/home/node/.openclaw`],
        RestartPolicy: { Name: 'unless-stopped' },
        // Resource limits for multi-tenancy
        Memory: 2 * 1024 * 1024 * 1024, // 2GB
        MemorySwap: 2 * 1024 * 1024 * 1024, // No swap
        NanoCpus: 1000000000, // 1 CPU
        // Logging configuration
        LogConfig: {
          Type: 'json-file',
          Config: {
            'max-size': '10m',
            'max-file': '3',
          },
        },
      },
      Healthcheck: {
        Test: ['CMD-SHELL', 'curl -f http://localhost:18789/health || exit 1'],
        Interval: 30000000000, // 30s in nanoseconds
        Timeout: 10000000000, // 10s
        Retries: 3,
      },
    })
    await container.start()
    await prisma.agent.update({
      where: { id: agent.id },
      data: { containerId: container.id, status: AgentStatus.running },
    })
    return agent.id
  } catch (e) {
    await prisma.agent.update({
      where: { id: agent.id },
      data: {
        status: AgentStatus.error,
        errorMessage: (e as Error).message,
      },
    })
    throw e
  }
}

export async function startAgent(agentId: string): Promise<void> {
  const agent = await prisma.agent.findUnique({ where: { id: agentId } })
  if (!agent) throw new Error('Agent not found')
  const d = getDocker()
  if (agent.containerId) {
    try {
      const container = d.getContainer(agent.containerId)
      const info = await container.inspect()
      if (info.State.Running) return
      await container.start()
      await prisma.agent.update({
        where: { id: agentId },
        data: { status: AgentStatus.running, errorMessage: null },
      })
      return
    } catch {
      // Container may have been removed
    }
  }
  const port = agent.port ?? (await findNextPort())
  if (!agent.port) {
    await prisma.agent.update({
      where: { id: agentId },
      data: { port },
    })
  }
  await d.getImage(IMAGE).inspect().catch(async () => {
    await new Promise<void>((res, rej) => {
      d.pull(IMAGE, (err: Error | null, stream: NodeJS.ReadableStream) => {
        if (err) return rej(err)
        d.modem.followProgress(stream, (err: Error | null) => (err ? rej(err) : res()))
      })
    })
  })
  
  // Get enabled skills as environment variables
  const skillsEnv = await OpenClawConfigService.getSkillsEnvVars(agentId);
  
  // Get user-configured environment variables (Discord token, AI model, API keys)
  const agentConfig = await prisma.agentConfig.findUnique({
    where: { agentId }
  });
  const userEnvVars = (agentConfig?.envVars as Record<string, string>) || {};
  
  // Merge both: user config takes precedence over skills
  const allEnvVars = { ...skillsEnv, ...userEnvVars };
  
  const container = await d.createContainer({
    Image: IMAGE,
    name: `oscaragent-agent-${agentId}`,
    Env: Object.entries(allEnvVars).map(([key, value]) => `${key}=${value}`),
    User: 'root', // Run as root to avoid permission issues
    HostConfig: {
      PortBindings: {
        '18789/tcp': [{ HostPort: String(port) }],
      },
      Binds: [`oscaragent-openclaw-${agentId}:/home/node/.openclaw`],
      RestartPolicy: { Name: 'unless-stopped' },
      // Resource limits for multi-tenancy
      Memory: 2 * 1024 * 1024 * 1024, // 2GB
      MemorySwap: 2 * 1024 * 1024 * 1024, // No swap
      NanoCpus: 1000000000, // 1 CPU
      // Logging configuration
      LogConfig: {
        Type: 'json-file',
        Config: {
          'max-size': '10m',
          'max-file': '3',
        },
      },
    },
    Healthcheck: {
      Test: ['CMD-SHELL', 'curl -f http://localhost:18789/health || exit 1'],
      Interval: 30000000000, // 30s in nanoseconds
      Timeout: 10000000000, // 10s
      Retries: 3,
    },
  })
  await container.start()
  await prisma.agent.update({
    where: { id: agentId },
    data: { containerId: container.id, status: AgentStatus.running, errorMessage: null },
  })
}

export async function stopAgent(agentId: string): Promise<void> {
  const agent = await prisma.agent.findUnique({ where: { id: agentId } })
  if (!agent?.containerId) {
    await prisma.agent.update({
      where: { id: agentId },
      data: { status: AgentStatus.stopped },
    })
    return
  }
  try {
    const d = getDocker()
    const container = d.getContainer(agent.containerId)
    await container.stop()
    await container.remove()
  } catch {
    // Container may already be stopped
  }
  await prisma.agent.update({
    where: { id: agentId },
    data: { containerId: null, status: AgentStatus.stopped },
  })
}

export async function getContainerLogs(agentId: string): Promise<string> {
  const agent = await prisma.agent.findUnique({ where: { id: agentId } })
  if (!agent?.containerId) {
    return 'No container found'
  }
  
  try {
    const d = getDocker()
    const container = d.getContainer(agent.containerId)
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail: 100,
      timestamps: true,
    })
    return logs.toString('utf-8')
  } catch (e) {
    return `Error fetching logs: ${(e as Error).message}`
  }
}
