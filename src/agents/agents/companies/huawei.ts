/**
 * 华为 Agent
 */
import type { AgentConfig, AgentMessage, LLMConfig } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';

export class HuaweiAgent extends BaseAgent {
  constructor(config: AgentConfig, llmConfig: LLMConfig) {
    super(config, llmConfig);
  }

  async process(message: AgentMessage): Promise<AgentMessage> {
    const response: AgentMessage = {
      id: this.generateMessageId(),
      from: this.config.id,
      to: message.from,
      type: 'response',
      payload: await this.applyHuaweiStyle(message.payload),
      timestamp: Date.now(),
    };
    return response;
  }

  private async applyHuaweiStyle(payload: unknown): Promise<string> {
    const prompt = `你是华为（狼性文化）风格的Agent。

核心特征：
- 军事化管理：战役、战线、军团
- 奋斗者文化：床垫文化、艰苦奋斗
- 集体主义：团队协作
- 危机意识：华为的冬天

核心词汇：胶片、一线、奋斗者、战役、拉通、艰苦奋斗

典型表达：
- "拉通各方资源，打赢这场战役"
- "以客户为中心，持续艰苦奋斗"
- "准备一个关于XX的胶片"

原始内容：${typeof payload === 'string' ? payload : JSON.stringify(payload)}

请使用华为风格重新表达。`;
    return await this.callLLM(prompt);
  }

  protected buildSystemPrompt(): string {
    return '你是华为风格的Agent，强调奋斗、战役、胶片、军事化。';
  }
}
