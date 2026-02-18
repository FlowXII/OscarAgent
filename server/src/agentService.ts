import { prisma } from './db.js';
import * as DockerProvider from './docker.js';

export class AgentService {
  static async createAgent(userId: string) {
    return DockerProvider.createAgent(userId);
  }

  static async startAgent(agentId: string) {
    return DockerProvider.startAgent(agentId);
  }

  static async stopAgent(agentId: string) {
    return DockerProvider.stopAgent(agentId);
  }

  static async restartAgent(agentId: string) {
    await this.stopAgent(agentId);
    // Wait a bit for resources to release
    await new Promise(r => setTimeout(r, 2000));
    await this.startAgent(agentId);
  }
}
