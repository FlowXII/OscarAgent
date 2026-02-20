import { prisma } from './db.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Helper to ensure legacy model names get their provider prefix
 */
function addProviderPrefix(modelStr: string | undefined): string {
  if (!modelStr) return "minimax/MiniMax-M2.5";
  if (modelStr.includes('/')) return modelStr;
  
  const lower = modelStr.toLowerCase();
  if (lower.includes('minimax') || lower.includes('m2.')) return `minimax/${modelStr}`;
  if (lower.includes('claude')) return `anthropic/${modelStr}`;
  if (lower.includes('gpt')) return `openai/${modelStr}`;
  if (lower.includes('moonshot') || lower.includes('kimi')) return `moonshot/${modelStr}`;
  
  return `anthropic/${modelStr}`; // default fallback
}

/**
 * OpenClaw Configuration Manager
 * Generates openclaw.json configuration files for each agent based on their enabled skills
 */

interface OpenClawConfig {
  agents?: {
    defaults?: {
      model?: string | {
        primary?: string;
        [key: string]: any;
      };
      sandbox?: {
        mode?: string;
      };
    };
  };
  tools?: {
    exec?: {
      security?: string;
      ask?: string;
    };
    [key: string]: any;
  };
  browser?: {
    defaultProfile?: string;
    enabled?: boolean;
  };
  models?: {
    providers?: Record<string, any>;
  };
  skills?: {
    entries?: Record<string, {
      enabled: boolean;
      config?: Record<string, any>;
    }>;
  };
  channels?: {
    discord?: {
      dm?: {
        policy: string;
        allowFrom?: string[];
      };
      groupPolicy?: string;
    };
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
        config: true,
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

    const configVars = (agent.config?.envVars as Record<string, string>) || {};
    // Ensure the default fallback includes the provider prefix and legacy names are migrated
    const modelName = addProviderPrefix(configVars.OPENCLAW_MODEL);

    const discordUserId = configVars.DISCORD_USER_ID;
    
    // Default to open if no ID is provided, but use strict allowlist if provided
    const dmPolicy = discordUserId ? "allowlist" : "open";
    const groupPolicy = discordUserId ? "allowlist" : "open";
    const allowFrom = discordUserId ? [discordUserId] : undefined;

    // Configure custom providers if keys exist
    const providers: Record<string, any> = {};
    if (configVars.MOONSHOT_API_KEY) {
      providers['moonshot'] = {
        api: "openai-completions",
        baseUrl: "https://api.moonshot.cn/v1",
        apiKey: configVars.MOONSHOT_API_KEY,
        models: [
          { id: "moonshot-v1-8k", name: "Kimi K2 8K" },
          { id: "moonshot-v1-32k", name: "Kimi K2 32K" },
          { id: "moonshot-v1-128k", name: "Kimi K2 128K" }
        ]
      };
    }


    const config: OpenClawConfig = {
      agents: {
        defaults: {
          model: {
            primary: modelName,
          },
          sandbox: {
            mode: "off",
          },
        },
      },
      tools: {
        exec: {
          security: "full",
          ask: "off",
        },
      },
      browser: {
        defaultProfile: "openclaw",
        enabled: true,
      },
      models: {
        ...(Object.keys(providers).length > 0 && { providers })
      },
      skills: {
        entries: agent.skills.reduce((acc, agentSkill) => {
          acc[agentSkill.skill.slug] = {
            enabled: agentSkill.enabled,
            config: {},
          };
          return acc;
        }, {} as Record<string, any>),
      },
      channels: {
        discord: {
          dm: {
            policy: dmPolicy,
            ...(allowFrom && { allowFrom })
          },
          groupPolicy: groupPolicy,
        }
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
    const configDir = '/openclaw-configs';
    try {
      await fs.mkdir(configDir, { recursive: true });
    } catch (e) {
      // Ignore if it already exists or if we don't have permissions to create (though it should be a volume)
    }
    
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

      // Mapping for OpenClaw specific model selection
      if (configVars.OPENCLAW_MODEL) {
        const normalizedModel = addProviderPrefix(configVars.OPENCLAW_MODEL);
        
        // Standard mapping
        envVars['OPENCLAW_AGENTS_DEFAULTS_MODEL'] = normalizedModel;
        envVars['OPENCLAW_AGENTS_DEFAULTS_MODEL_PRIMARY'] = normalizedModel;
        
        // Nested mapping with double underscores (standard for many config loaders)
        envVars['OPENCLAW__AGENTS__DEFAULTS__MODEL'] = normalizedModel;
        envVars['OPENCLAW__AGENT__MODEL'] = normalizedModel;
        
        // Also set these for per-agent overrides if supported
        envVars['OPENCLAW_AGENT_MODEL'] = normalizedModel;
        envVars['OPENCLAW_AGENT_MODEL_PRIMARY'] = normalizedModel;
      }

      // Auto-enable Minimax plugin if key is present
      if (configVars.MINIMAX_API_KEY) {
        envVars['OPENCLAW_PLUGINS_ENTRIES_MINIMAX_ENABLED'] = 'true';
        envVars['OPENCLAW__PLUGINS__ENTRIES__MINIMAX__ENABLED'] = 'true';
      }
    }

    return envVars;
  }
}
