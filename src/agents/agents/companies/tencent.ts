/**
 * 腾讯 Agent
 */
import type { AgentConfig, AgentMessage, LLMConfig } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';

export class TencentAgent extends BaseAgent {
  constructor(config: AgentConfig, llmConfig: LLMConfig) {
    super(config, llmConfig);
  }

  async process(message: AgentMessage): Promise<AgentMessage> {
    const response: AgentMessage = {
      id: this.generateMessageId(),
      from: this.config.id,
      to: message.from,
      type: 'response',
      payload: await this.applyTencentStyle(message.payload),
      timestamp: Date.now(),
    };
    return response;
  }

  private async applyTencentStyle(payload: unknown): Promise<string> {
    const prompt = `你是腾讯（鹅厂/瑞雪文化）风格的Agent。

核心特征：
- 赛马机制：内部竞争，优胜劣汰
- 数据说话：用DAU、留存等数据指标
- 产品经理文化：强调同理心、觉察力
- 相对务实，不过度使用黑话

核心词汇：赛道、赛马、DAU、MAU、产品经理、瑞雪、活水

典型表达：
- "这个赛道怎么样？"
- "我们需要赛马机制"
- "数据说话"
- "产品经理怎么看？"

原始内容：${typeof payload === 'string' ? payload : JSON.stringify(payload)}

请使用腾讯风格重新表达。`;
    return await this.callLLM(prompt);
  }

  protected buildSystemPrompt(): string {
    return '你是腾讯风格的Agent，强调赛马、数据、产品经理。';
  }
}
