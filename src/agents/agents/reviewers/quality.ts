/**
 * 质量审查 Agent
 */
import type { AgentConfig, AgentMessage, LLMConfig } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';

export class QualityReviewerAgent extends BaseAgent {
  async process(message: AgentMessage): Promise<AgentMessage> {
    const prompt = this.buildQualityReviewPrompt(message.payload);
    const review = await this.callLLM(prompt);

    return {
      id: this.generateMessageId(),
      from: this.config.id,
      to: message.from,
      type: 'review',
      payload: { review, type: 'quality', score: this.extractScore(review) },
      timestamp: Date.now(),
    };
  }

  private buildQualityReviewPrompt(work: unknown): string {
    return `你是质量审查专家，负责检查代码/文档质量。

## 待审查内容
${JSON.stringify(work)}

请进行质量审查，评估：
1. 正确性：是否符合要求
2. 可读性：是否易于理解
3. 可维护性：是否便于后续修改
4. 完整性：是否包含必要内容

请输出质量评分（0-100）和改进建议。`;
  }

  private extractScore(review: string): number {
    // 简单提取分数
    const match = review.match(/(分数|评分|质量).*?(\d+)/);
    return match ? parseInt(match[2]) : 70;
  }

  protected buildSystemPrompt(): string {
    return '你是质量审查专家，负责检查工作成果的质量。';
  }
}
