/**
 * Agent 管理器
 *
 * @description
 * 管理所有 Agent 的注册、创建、通信和生命周期。
 * 管理赋能协调，形成组织闭环。
 */

import type {
  AgentConfig,
  AgentMessage,
  AgentType,
  CompanyType,
  LLMConfig,
} from '../types/index.js';
import { BaseAgent } from './base.js';
import { GeneralAgent } from './agents/general.js';
import { AliAgent } from './agents/companies/ali.js';
import { TencentAgent } from './agents/companies/tencent.js';
import { BytedanceAgent } from './agents/companies/bytedance.js';
import { MeituanAgent } from './agents/companies/meituan.js';
import { HuaweiAgent } from './agents/companies/huawei.js';
import { BaiduAgent } from './agents/companies/baidu.js';
import { NeteaseAgent } from './agents/companies/netease.js';
import { StyleRecognizerAgent } from './agents/specialists/recognizer.js';
import { StyleConverterAgent } from './agents/specialists/converter.js';
import { PUAGeneratorAgent } from './agents/specialists/generator.js';
import { PUAReviewerAgent } from './agents/reviewers/pua.js';
import { QualityReviewerAgent } from './agents/reviewers/quality.js';
import { JargonReviewerAgent } from './agents/reviewers/jargon.js';

// ============================================================================
// Agent 管理器配置
// ============================================================================

/**
 * Agent 管理器配置
 */
export interface AgentManagerConfig {
  llm: LLMConfig;
}

// ============================================================================
// Agent 管理器
// ============================================================================

/**
 * Agent 管理器类
 */
export class AgentManager {
  private agents: Map<string, BaseAgent> = new Map();
  private config: AgentManagerConfig;
  private llmConfig: LLMConfig;

  constructor(config: AgentManagerConfig) {
    this.config = config;
    this.llmConfig = config.llm;
  }

  /**
   * 创建 Agent
   */
  createAgent(config: AgentConfig): BaseAgent {
    const agent = this.instantiateAgent(config);
    this.agents.set(config.id, agent);
    return agent;
  }

  /**
   * 实例化 Agent
   */
  private instantiateAgent(config: AgentConfig): BaseAgent {
    switch (config.type) {
      case 'general':
        return new GeneralAgent(config, this.llmConfig);

      case 'company':
        return this.instantiateCompanyAgent(config);

      case 'specialist':
        return this.instantiateSpecialistAgent(config);

      case 'reviewer':
        return this.instantiateReviewerAgent(config);

      default:
        throw new Error(`Unknown agent type: ${config.type}`);
    }
  }

  /**
   * 实例化分厂 Agent
   */
  private instantiateCompanyAgent(config: AgentConfig): BaseAgent {
    if (!config.company) {
      throw new Error('Company agent requires a company type');
    }

    switch (config.company) {
      case 'ali':
        return new AliAgent(config, this.llmConfig);
      case 'tencent':
        return new TencentAgent(config, this.llmConfig);
      case 'bytedance':
        return new BytedanceAgent(config, this.llmConfig);
      case 'meituan':
        return new MeituanAgent(config, this.llmConfig);
      case 'huawei':
        return new HuaweiAgent(config, this.llmConfig);
      case 'baidu':
        return new BaiduAgent(config, this.llmConfig);
      case 'netease':
        return new NeteaseAgent(config, this.llmConfig);
      default:
        throw new Error(`Unknown company type: ${config.company}`);
    }
  }

  /**
   * 实例化分包 Agent
   */
  private instantiateSpecialistAgent(config: AgentConfig): BaseAgent {
    // 根据 name 判断具体类型
    switch (config.name) {
      case 'recognizer':
        return new StyleRecognizerAgent(config, this.llmConfig);
      case 'converter':
        return new StyleConverterAgent(config, this.llmConfig);
      case 'generator':
        return new PUAGeneratorAgent(config, this.llmConfig);
      default:
        throw new Error(`Unknown specialist agent: ${config.name}`);
    }
  }

  /**
   * 实例化审查 Agent
   */
  private instantiateReviewerAgent(config: AgentConfig): BaseAgent {
    switch (config.name) {
      case 'pua-reviewer':
        return new PUAReviewerAgent(config, this.llmConfig);
      case 'quality-reviewer':
        return new QualityReviewerAgent(config, this.llmConfig);
      case 'jargon-reviewer':
        return new JargonReviewerAgent(config, this.llmConfig);
      default:
        throw new Error(`Unknown reviewer agent: ${config.name}`);
    }
  }

  /**
   * 获取 Agent
   */
  getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }

  /**
   * 获取所有 Agent
   */
  getAllAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * 按 Agent ID 获取
   */
  getById(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }

  /**
   * 按类型获取 Agent
   */
  getByType(type: AgentType): BaseAgent[] {
    return this.getAllAgents().filter((agent) => agent.getType() === type);
  }

  /**
   * 按 Agent ID 删除
   */
  removeAgent(id: string): boolean {
    return this.agents.delete(id);
  }

  /**
   * 清空所有 Agent
   */
  clear(): void {
    this.agents.clear();
  }

  /**
   * 广播消息到所有 Agent
   */
  async broadcast(message: Omit<AgentMessage, 'id' | 'timestamp'>): Promise<void> {
    const fullMessage: AgentMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: Date.now(),
    };

    const promises = this.getAllAgents().map((agent) => agent.receive(fullMessage));
    await Promise.all(promises);
  }

  /**
   * 发送消息到指定 Agent
   */
  async send(
    from: string,
    to: string,
    payload: unknown,
    style?: CompanyType
  ): Promise<void> {
    const fromAgent = this.getAgent(from);
    if (!fromAgent) {
      throw new Error(`Agent not found: ${from}`);
    }

    await fromAgent.send(to, payload, style);

    const toAgent = this.getAgent(to);
    if (toAgent) {
      // 找到发送的消息并转发
      const history = fromAgent.getMessageHistory();
      const lastMessage = history[history.length - 1];
      if (lastMessage) {
        await toAgent.receive(lastMessage);
      }
    }
  }

  /**
   * 启动 Agent 间通信
   */
  async startCommunication(
    from: string,
    to: string,
    message: unknown
  ): Promise<AgentMessage> {
    const fromAgent = this.getAgent(from);
    const toAgent = this.getAgent(to);

    if (!fromAgent || !toAgent) {
      throw new Error('Agent not found');
    }

    const agentMessage: AgentMessage = {
      id: this.generateMessageId(),
      from,
      to,
      type: 'query',
      payload: message,
      timestamp: Date.now(),
    };

    await toAgent.receive(agentMessage);

    // 获取响应
    const toAgentHistory = toAgent.getMessageHistory();
    const response = toAgentHistory[toAgentHistory.length - 1];

    return response;
  }

  /**
   * 获取所有 Agent 的状态
   */
  getStatuses(): Map<string, string> {
    const statuses = new Map();
    for (const [id, agent] of this.agents) {
      statuses.set(id, agent.getStatus());
    }
    return statuses;
  }

  /**
   * 生成消息 ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// 工厂函数
// ============================================================================

/**
 * 创建默认的 Agent 管理器
 */
export function createDefaultAgentManager(llmConfig: LLMConfig): AgentManager {
  const manager = new AgentManager({ llm });

  // 创建总包 Agent
  manager.createAgent({
    id: 'general',
    type: 'general',
    name: '总包Agent',
    description: '统筹协调所有分包Agent',
  });

  // 创建分厂 Agent
  const companies: CompanyType[] = ['ali', 'tencent', 'bytedance', 'meituan', 'huawei', 'baidu', 'netease'];
  for (const company of companies) {
    const companyName = getCompanyName(company);
    manager.createAgent({
      id: `company-${company}`,
      type: 'company',
      company,
      name: `${companyName}Agent`,
      description: `${companyName}风格专家`,
    });
  }

  // 创建分包 Agent
  manager.createAgent({
    id: 'recognizer',
    type: 'specialist',
    name: '风格识别Agent',
    description: '识别文本所属的大厂风格',
  });

  manager.createAgent({
    id: 'converter',
    type: 'specialist',
    name: '风格转换Agent',
    description: '将文本转换为指定风格',
  });

  manager.createAgent({
    id: 'generator',
    type: 'specialist',
    name: 'PUA生成Agent',
    description: '生成PUA话术',
  });

  // 创建审查 Agent
  manager.createAgent({
    id: 'pua-reviewer',
    type: 'reviewer',
    name: 'PUA审查Agent',
    description: '用PUA话术批评工作成果',
  });

  manager.createAgent({
    id: 'quality-reviewer',
    type: 'reviewer',
    name: '质量审查Agent',
    description: '检查代码/文档质量',
  });

  manager.createAgent({
    id: 'jargon-reviewer',
    type: 'reviewer',
    name: '黑话审查Agent',
    description: '检查黑话浓度是否达标',
  });

  return manager;
}

/**
 * 获取公司名称
 */
function getCompanyName(company: CompanyType): string {
  const names: Record<CompanyType, string> = {
    ali: '阿里',
    tencent: '腾讯',
    bytedance: '字节',
    meituan: '美团',
    huawei: '华为',
    baidu: '百度',
    netease: '网易',
  };
  return names[company];
}
