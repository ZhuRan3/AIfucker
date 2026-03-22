/**
 * LLM 抽象适配器
 *
 * @description
 * 提供统一的LLM接口，支持多种LLM提供商。
 * 适配器赋能切换，形成多模型闭环。
 */

import type {
  LLMConfig,
  LLMProvider,
  LLMResponse,
  AsyncResult,
  JargonPUAError,
} from '../types/index.js';
import { ClaudeAdapter } from './claude.js';
import { OpenAIAdapter } from './openai.js';
import { LLMError } from '../types/index.js';

// ============================================================================
// 适配器工厂
// ============================================================================

/**
 * LLM 适配器接口
 */
export interface LLMAdapter {
  /**
   * 生成文本
   */
  generate(prompt: string, options?: LLMConfig): Promise<LLMResponse>;

  /**
   * 流式生成文本
   */
  generateStream(
    prompt: string,
    options?: LLMConfig,
    onChunk?: (chunk: string) => void
  ): Promise<LLMResponse>;

  /**
   * 检查适配器是否可用
   */
  isAvailable(): boolean;

  /**
   * 获取适配器信息
   */
  getInfo(): {
    provider: LLMProvider;
    model: string;
    available: boolean;
  };
}

/**
 * 创建 LLM 适配器
 */
export function createLLMAdapter(config: LLMConfig): LLMAdapter {
  switch (config.provider) {
    case 'claude':
      return new ClaudeAdapter(config);
    case 'openai':
      return new OpenAIAdapter(config);
    case 'custom':
      throw new LLMError('Custom provider not implemented yet');
    default:
      throw new LLMError(`Unknown provider: ${config.provider}`);
  }
}

/**
 * 适配器管理器
 */
export class LLMAdapterManager {
  private adapters: Map<string, LLMAdapter> = new Map();
  private defaultAdapter: LLMAdapter | null = null;

  /**
   * 注册适配器
   */
  register(name: string, adapter: LLMAdapter): void {
    this.adapters.set(name, adapter);
  }

  /**
   * 获取适配器
   */
  get(name: string): LLMAdapter | undefined {
    return this.adapters.get(name);
  }

  /**
   * 设置默认适配器
   */
  setDefault(adapter: LLMAdapter): void {
    this.defaultAdapter = adapter;
  }

  /**
   * 获取默认适配器
   */
  getDefault(): LLMAdapter {
    if (!this.defaultAdapter) {
      throw new LLMError('No default adapter set');
    }
    return this.defaultAdapter;
  }

  /**
   * 获取所有可用的适配器
   */
  getAvailable(): LLMAdapter[] {
    return Array.from(this.adapters.values()).filter((a) => a.isAvailable());
  }

  /**
   * 检查是否有可用的适配器
   */
  hasAvailable(): boolean {
    return this.getAvailable().length > 0;
  }
}

// ============================================================================
// 全局适配器管理器
// ============================================================================

/**
 * 全局适配器管理器实例
 */
let globalManager: LLMAdapterManager | null = null;

/**
 * 获取全局适配器管理器
 */
export function getLLMManager(): LLMAdapterManager {
  if (!globalManager) {
    globalManager = new LLMAdapterManager();
  }
  return globalManager;
}

/**
 * 初始化默认适配器
 */
export async function initializeDefaultAdapter(config: LLMConfig): Promise<void> {
  const manager = getLLMManager();
  const adapter = createLLMAdapter(config);

  if (adapter.isAvailable()) {
    manager.register('default', adapter);
    manager.setDefault(adapter);
  } else {
    throw new LLMError(`Adapter for ${config.provider} is not available`);
  }
}

/**
 * 使用默认适配器生成文本
 */
export async function generate(
  prompt: string,
  options?: Partial<LLMConfig>
): Promise<LLMResponse> {
  const manager = getLLMManager();
  const adapter = manager.getDefault();
  return adapter.generate(prompt, options);
}

/**
 * 使用默认适配器流式生成文本
 */
export async function generateStream(
  prompt: string,
  onChunk?: (chunk: string) => void,
  options?: Partial<LLMConfig>
): Promise<LLMResponse> {
  const manager = getLLMManager();
  const adapter = manager.getDefault();
  return adapter.generateStream(prompt, options, onChunk);
}
