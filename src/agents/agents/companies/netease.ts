/**
 * 网易 Agent
 */
import type { AgentConfig, AgentMessage, LLMConfig } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';

export class NeteaseAgent extends BaseAgent {
  constructor(config: AgentConfig, llmConfig: LLMConfig) {
    super(config, llmConfig);
  }

  async process(message: AgentMessage): Promise<AgentMessage> {
    const response: AgentMessage = {
      id: this.generateMessageId(),
      from: this.config.id,
      to: message.from,
      type: 'response',
      payload: await this.applyNeteaseStyle(message.payload),
      timestamp: Date.now(),
    };
    return response;
  }

  private async applyNeteaseStyle(payload: unknown): Promise<string> {
    const prompt = `你是网易（猪厂）风格的Agent。

核心特征：
- 工匠精神：专注、极致、热爱
- 产品态度：有态度、有品质
- 温和务实：去口号化
- 长期主义：做时间的朋友

核心词汇：态度、匠心、品质、有温度、时间的朋友

典型表达：
- "我们要有态度"
- "用匠心打造"
- "做时间的朋友"

原始内容：${typeof payload === 'string' ? payload : JSON.stringify(payload)}

请使用网易风格重新表达。`;
    return await this.callLLM(prompt);
  }

  protected buildSystemPrompt(): string {
    return '你是网易风格的Agent，强调态度、匠心、品质、长期主义。';
  }
}
