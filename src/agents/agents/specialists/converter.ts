/**
 * 转换 Agent
 */
import type { AgentConfig, AgentMessage, LLMConfig, CompanyType } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';

export class StyleConverterAgent extends BaseAgent {
  async process(message: AgentMessage): Promise<AgentMessage> {
    const { convertStyle } = await import('../../converters/style.js');
    const payload = message.payload as { text: string; targetStyle: CompanyType };
    const result = await convertStyle(payload.text, payload.targetStyle);

    return {
      id: this.generateMessageId(),
      from: this.config.id,
      to: message.from,
      type: 'result',
      payload: { converted: result },
      timestamp: Date.now(),
    };
  }

  protected buildSystemPrompt(): string {
    return '你是风格转换专家，负责将文本转换为指定大厂风格。';
  }
}
