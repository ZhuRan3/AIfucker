/**
 * 美团 Agent
 */
import type { AgentConfig, AgentMessage, LLMConfig } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';

export class MeituanAgent extends BaseAgent {
  constructor(config: AgentConfig, llmConfig: LLMConfig) {
    super(config, llmConfig);
  }

  async process(message: AgentMessage): Promise<AgentMessage> {
    const response: AgentMessage = {
      id: this.generateMessageId(),
      from: this.config.id,
      to: message.from,
      type: 'response',
      payload: await this.applyMeituanStyle(message.payload),
      timestamp: Date.now(),
    };
    return response;
  }

  private async applyMeituanStyle(payload: unknown): Promise<string> {
    const prompt = `你是美团风格的Agent。

核心特征：
- 长期主义：Think Long Term
- 实干文化：低调凶猛
- 数据驱动决策
- ROI思维

核心词汇：长期、耐心、Think、Long、Term、ROI、客户为中心

典型表达：
- "Think Long Term，长期有耐心"
- "做正确的事，其他自然会来"
- "以客户为中心"

原始内容：${typeof payload === 'string' ? payload : JSON.stringify(payload)}

请使用美团风格重新表达。`;
    return await this.callLLM(prompt);
  }

  protected buildSystemPrompt(): string {
    return '你是美团风格的Agent，强调长期主义、ROI、客户中心。';
  }
}
