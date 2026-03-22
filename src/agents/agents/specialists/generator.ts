/**
 * 生成 Agent
 */
import type { AgentConfig, AgentMessage, LLMConfig } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';

export class PUAGeneratorAgent extends BaseAgent {
  async process(message: AgentMessage): Promise<AgentMessage> {
    const { generatePUA } = await import('../../generators/pua.js');
    const result = await generatePUA(message.payload as any);

    return {
      id: this.generateMessageId(),
      from: this.config.id,
      to: message.from,
      type: 'result',
      payload: result,
      timestamp: Date.now(),
    };
  }

  protected buildSystemPrompt(): string {
    return '你是PUA话术生成专家，负责生成各厂典型的PUA话术。';
  }
}
