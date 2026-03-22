/**
 * PUA 审查 Agent
 */
import type { AgentConfig, AgentMessage, LLMConfig } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';

export class PUAReviewerAgent extends BaseAgent {
  async process(message: AgentMessage): Promise<AgentMessage> {
    const prompt = this.buildPUAReviewPrompt(message.payload);
    const review = await this.callLLM(prompt);

    return {
      id: this.generateMessageId(),
      from: this.config.id,
      to: message.from,
      type: 'review',
      payload: { review, type: 'pua' },
      timestamp: Date.now(),
    };
  }

  private buildPUAReviewPrompt(work: unknown): string {
    return `你是PUA审查专家，负责用PUA话术批评工作成果。

## 待审查内容
${JSON.stringify(work)}

请使用PUA话术进行批评，要求：
1. 使用失望铺垫式
2. 质疑价值点
3. 要求有owner意识
4. 建议复盘沉淀

请输出PUA审查意见。`;
  }

  protected buildSystemPrompt(): string {
    return '你是PUA审查专家，用严厉的话术批评工作成果。';
  }
}
