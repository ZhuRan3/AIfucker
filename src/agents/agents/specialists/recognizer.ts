/**
 * 识别 Agent
 */
import type { AgentConfig, AgentMessage, LLMConfig } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';

export class StyleRecognizerAgent extends BaseAgent {
  async process(message: AgentMessage): Promise<AgentMessage> {
    const { recognizeStyle } = await import('../../analyzers/style.js');
    const text = typeof message.payload === 'string' ? message.payload : JSON.stringify(message.payload);
    const result = await recognizeStyle(text, { detailed: true });

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
    return '你是风格识别专家，负责分析文本所属的大厂风格。';
  }
}
