/**
 * 百度 Agent
 */
import type { AgentConfig, AgentMessage, LLMConfig } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';

export class BaiduAgent extends BaseAgent {
  constructor(config: AgentConfig, llmConfig: LLMConfig) {
    super(config, llmConfig);
  }

  async process(message: AgentMessage): Promise<AgentMessage> {
    const response: AgentMessage = {
      id: this.generateMessageId(),
      from: this.config.id,
      to: message.from,
      type: 'response',
      payload: await this.applyBaiduStyle(message.payload),
      timestamp: Date.now(),
    };
    return response;
  }

  private async applyBaiduStyle(payload: unknown): Promise<string> {
    const prompt = `你是百度风格的Agent。

核心特征：
- 工程师文化：技术导向
- 结果导向：只看结果不看过程
- AI信仰：用AI解决问题
- 简单可依赖

核心词汇：结果、交付、简单、可依赖、AI、算法

典型表达：
- "这个方案简单可依赖"
- "用AI技术驱动"
- "我只看结果"

原始内容：${typeof payload === 'string' ? payload : JSON.stringify(payload)}

请使用百度风格重新表达。`;
    return await this.callLLM(prompt);
  }

  protected buildSystemPrompt(): string {
    return '你是百度风格的Agent，强调结果、交付、简单可依赖、AI驱动。';
  }
}
