import { prisma } from './db.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * OpenClaw Configuration Manager
 * Generates openclaw.json configuration files for each agent based on their enabled skills
 */

interface OpenClawConfig {
  skills?: {
    entries?: Array<{
      name: string;
      enabled: boolean;
      config?: Record<string, any>;
    }>;
  };
  env?: Record<string, string>;
}

export class OpenClawConfigService {
  /**
   * Generate OpenClaw config for a specific agent
   */
  static async generateConfigForAgent(agentId: string): Promise<OpenClawConfig> {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!agent) {
      throw new Error('Agent not found');
    }

    const config: OpenClawConfig = {
      skills: {
        entries: agent.skills.map((agentSkill) => ({
          name: agentSkill.skill.slug,
          enabled: agentSkill.enabled,
          config: {},
        })),
      },
      env: {},
    };

    return config;
  }

  /**
   * Write config to agent's volume
   * This assumes the volume is mounted at a predictable path
   */
  static async writeConfigToVolume(agentId: string, config: OpenClawConfig): Promise<void> {
    // Docker volumes are typically at /var/lib/docker/volumes/
    // But we'll write to a temp location that can be mounted
    const configDir = path.join(process.cwd(), '.openclaw-configs');
    await fs.mkdir(configDir, { recursive: true });
    
    const configPath = path.join(configDir, `${agentId}.json`);
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  }

  /**
   * Get enabled skills for an agent as environment variables
   * This can be passed to Docker container creation
   */
  static async getSkillsEnvVars(agentId: string): Promise<Record<string, string>> {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        skills: {
          where: { enabled: true },
          include: { skill: true },
        },
        config: true,
      },
    });

    if (!agent) {
      return {};
    }

    const envVars: Record<string, string> = {};
    
    // Create a comma-separated list of enabled skill slugs
    const enabledSkills = agent.skills.map(as => as.skill.slug).join(',');
    envVars['OPENCLAW_ENABLED_SKILLS'] = enabledSkills;

    // Add all user-configured environment variables from database
    if (agent.config?.envVars) {
      const configVars = agent.config.envVars as Record<string, string>;
      Object.assign(envVars, configVars);
    }

    return envVars;
  }
}
