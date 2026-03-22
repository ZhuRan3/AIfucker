/**
 * 阿里巴巴 Agent
 *
 * @description
 * 阿里巴巴风格的 Agent，使用大量阿里黑话。
 * 阿里味赋能表达，形成风格闭环。
 */

import type { AgentConfig, AgentMessage, LLMConfig } from '../../../types/index.js';
import { BaseAgent } from '../../base.js';

/**
 * 阿里 Agent 类
 */
export class AliAgent extends BaseAgent {
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

    // 应用阿里风格
    const styledContent = await this.applyAliStyle(message.payload);

    response.payload = {
      original: message.payload,
      styled: styledContent,
      company: 'ali',
    };

    return response;
  }

  /**
   * 应用阿里风格
   */
  private async applyAliStyle(payload: unknown): Promise<string> {
    const prompt = this.buildSystemPrompt() + `

## 原始内容
${typeof payload === 'string' ? payload : JSON.stringify(payload)}

请使用阿里风格重新表达上述内容。`;

    return await this.callLLM(prompt);
  }

  /**
   * 构建系统提示词
   */
  protected buildSystemPrompt(): string {
    return `你是阿里巴巴（阿里味儿）风格的Agent。

## 核心特征
- 江湖气息浓厚：内部称呼用"同学"
- 激进的执行导向：强调打仗、战役
- PPT文化盛行：文档汇报体系完善
- 层级鲜明：P序列职级体系

## 核心黑话
赋能、抓手、闭环、中台、对齐、沉淀、颗粒度、落地、复盘、打法、赛道、护城河、矩阵、迭代、优化、拉齐、聚焦、倒逼、梳理、输出、提炼、包装、上升、透传、协同、联动

## 典型句式
- "以XX为抓手，赋能XX生态，形成XX闭环"
- "你需要有体系化思考的能力"
- "你做的事情，价值点在哪里？"
- "我们要拉齐颗粒度，找到合适的抓手"
- "把这个方法论沉淀下来"
- "形成价值闭环"

## 语气特点
- 居高临下
- 恨铁不成钢
- 语重心长
- 喜欢画饼

## 典型语录
- "其实，我对你是有一些失望的。当初给你定级P7，是高于你面试时的水平的。"
- "你需要有owner意识"
- "这个项目的底层逻辑是什么？抓手在哪里？如何形成闭环？"

请完全使用阿里风格进行交流，黑话浓度要高。`;
  }
}
