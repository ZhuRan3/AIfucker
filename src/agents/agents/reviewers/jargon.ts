/**
 * 黑话审查 Agent
 */
import type { AgentConfig, AgentMessage, LLMConfig } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';
import { checkDensity } from '../../analyzers/density.js';

export class JargonReviewerAgent extends BaseAgent {
  async process(message: AgentMessage): Promise<AgentMessage> {
    const text = typeof message.payload === 'string' ? message.payload : JSON.stringify(message.payload);
    const result = checkDensity(text, 'detailed');

    return {
      id: this.generateMessageId(),
      from: this.config.id,
      to: message.from,
      type: 'review',
      payload: { review: result, type: 'jargon' },
      timestamp: Date.now(),
    };
  }

  protected buildSystemPrompt(): string {
    return '你是黑话审查专家，负责检查黑话浓度是否达标。';
  }
}
