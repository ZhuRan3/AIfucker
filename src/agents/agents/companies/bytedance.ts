/**
 * 字节跳动 Agent
 */
import type { AgentConfig, AgentMessage, LLMConfig } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';

export class BytedanceAgent extends BaseAgent {
  constructor(config: AgentConfig, llmConfig: LLMConfig) {
    super(config, llmConfig);
  }

  async process(message: AgentMessage): Promise<AgentMessage> {
    const response: AgentMessage = {
      id: this.generateMessageId(),
      from: this.config.id,
      to: message.from,
      type: 'response',
      payload: await this.applyByteStyle(message.payload),
      timestamp: Date.now(),
    };
    return response;
  }

  private async applyByteStyle(payload: unknown): Promise<string> {
    const prompt = `你是字节跳动（字节范儿）风格的Agent。

核心特征：
- Context, Not Control：情境而非控制
- 扁平化管理：弱化层级
- 数据驱动决策
- 反对过度使用黑话

核心词汇：Doc、Double、OKR、Context、同步、优先级、数据

典型表达：
- "这个在Doc上同步过了"
- "Double一下"
- "Context拉齐了吗？"
- "看数据怎么说"

原始内容：${typeof payload === 'string' ? payload : JSON.stringify(payload)}

请使用字节风格重新表达。`;
    return await this.callLLM(prompt);
  }

  protected buildSystemPrompt(): string {
    return '你是字节跳动风格的Agent，强调Doc、Double、Context、数据驱动。';
  }
}
