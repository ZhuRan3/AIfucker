/**
 * 总包 Agent
 *
 * @description
 * 统筹协调所有分包Agent，分配任务和资源。
 * 总包赋能管理，形成统筹闭环。
 */

import type { AgentConfig, AgentMessage, LLMConfig } from '../../types/index.js';
import { BaseAgent } from '../base.js';

/**
 * 总包 Agent 类
 */
export class GeneralAgent extends BaseAgent {
  constructor(config: AgentConfig, llmConfig: LLMConfig) {
    super(config, llmConfig);
  }

  /**
   * 处理消息
   */
  async process(message: AgentMessage): Promise<AgentMessage> {
    const response: AgentMessage = {
      id: this.generateMessageId(),
      from: this.config.id,
      to: message.from,
      type: 'response',
      payload: null,
      timestamp: Date.now(),
    };

    switch (message.type) {
      case 'task':
        // 任务分配
        response.payload = await this.handleTaskAssignment(message.payload);
        break;

      case 'result':
        // 结果收集
        response.payload = await this.handleResultCollection(message.payload);
        break;

      default:
        response.payload = await this.handleDefault(message);
    }

    return response;
  }

  /**
   * 处理任务分配
   */
  private async handleTaskAssignment(payload: unknown): Promise<unknown> {
    const task = payload as { type: string; content: string };

    const prompt = this.buildSystemPrompt() + `

## 收到的任务
任务类型：${task.type}
任务内容：${task.content}

请作为总包Agent，制定任务执行计划：
1. 分析任务需求
2. 确定需要哪些分包Agent
3. 制定执行流程
4. 分配任务到各Agent

请输出执行计划。`;

    return await this.callLLM(prompt);
  }

  /**
   * 处理结果收集
   */
  private async handleResultCollection(payload: unknown): Promise<unknown> {
    const results = payload as Record<string, unknown>;

    const prompt = this.buildSystemPrompt() + `

## 收到的结果
${JSON.stringify(results, null, 2)}

请作为总包Agent，综合各Agent的结果：
1. 分析各Agent的输出
2. 找出最优方案
3. 综合优点
4. 形成最终结果

请输出综合后的结果。`;

    return await this.callLLM(prompt);
  }

  /**
   * 处理默认消息
   */
  private async handleDefault(message: AgentMessage): Promise<unknown> {
    const prompt = this.buildSystemPrompt() + `

## 收到的消息
来自：${message.from}
类型：${message.type}
内容：${JSON.stringify(message.payload)}

请作为总包Agent进行响应。`;

    return await this.callLLM(prompt);
  }

  /**
   * 构建系统提示词
   */
  protected buildSystemPrompt(): string {
    return `你是一个大厂项目总包Agent（General Contractor），负责统筹协调所有工作。

## 职责
1. 接收用户任务，分析需求
2. 将任务分配给合适的分包Agent
3. 收集各Agent的结果
4. 综合评估，选择最优方案
5. 向用户汇报最终结果

## 管理的分包Agent
- 分厂Agent：阿里、腾讯、字节、美团、华为、百度、网易
- 专业Agent：识别、转换、生成
- 审查Agent：PUA审查、质量审查、黑话审查

## 工作风格
- 语言：中性，带一点管理腔
- 黑话浓度：中等
- PUA强度：低
- 强调统筹、协调、对齐

## 典型表达
- "这个任务需要拉齐各方资源"
- "我们需要对齐一下颗粒度"
- "让各厂Agent赛马一下"
- "综合来看，最优方案是..."`;
  }
}
