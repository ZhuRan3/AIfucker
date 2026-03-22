/**
 * Agent 基类
 *
 * @description
 * 定义所有 Agent 的基础接口和通用功能。
 * 基类赋能继承，形成 Agent 闭环。
 */

import type {
  AgentConfig,
  AgentMessage,
  AgentStatus,
  AgentType,
  CompanyType,
  LLMConfig,
} from '../types/index.js';
import { generate } from '../llm/adapter.js';

// ============================================================================
// Agent 基类
// ============================================================================

/**
 * Agent 基类
 */
export abstract class BaseAgent {
  protected config: AgentConfig;
  protected status: AgentStatus = 'idle';
  protected messageHistory: AgentMessage[] = [];
  protected llmConfig: LLMConfig;

  constructor(config: AgentConfig, llmConfig: LLMConfig) {
    this.config = config;
    this.llmConfig = llmConfig;
  }

  /**
   * 获取 Agent ID
   */
  getId(): string {
    return this.config.id;
  }

  /**
   * 获取 Agent 类型
   */
  getType(): AgentType {
    return this.config.type;
  }

  /**
   * 获取 Agent 名称
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * 获取 Agent 描述
   */
  getDescription(): string {
    return this.config.description;
  }

  /**
   * 获取 Agent 状态
   */
  getStatus(): AgentStatus {
    return this.status;
  }

  /**
   * 设置 Agent 状态
   */
  protected setStatus(status: AgentStatus): void {
    this.status = status;
  }

  /**
   * 处理消息（由子类实现）
   */
  abstract process(message: AgentMessage): Promise<AgentMessage>;

  /**
   * 发送消息
   */
  async send(to: string | 'all', payload: unknown, style?: CompanyType): Promise<void> {
    const message: AgentMessage = {
      id: this.generateMessageId(),
      from: this.config.id,
      to,
      type: 'query',
      payload,
      timestamp: Date.now(),
      style,
    };

    this.messageHistory.push(message);
    return;
  }

  /**
   * 接收消息
   */
  async receive(message: AgentMessage): Promise<void> {
    this.messageHistory.push(message);

    if (message.to === this.config.id || message.to === 'all') {
      this.setStatus('working');
      const response = await this.process(message);
      this.messageHistory.push(response);
      this.setStatus('idle');
    }
  }

  /**
   * 生成消息 ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取消息历史
   */
  getMessageHistory(): AgentMessage[] {
    return [...this.messageHistory];
  }

  /**
   * 清空消息历史
   */
  clearHistory(): void {
    this.messageHistory = [];
  }

  /**
   * 调用 LLM
   */
  protected async callLLM(prompt: string): Promise<string> {
    const response = await generate(prompt, this.llmConfig);
    return response.content;
  }

  /**
   * 构建系统提示词
   */
  protected abstract buildSystemPrompt(): string;
}
