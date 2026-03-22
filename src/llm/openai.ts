/**
 * OpenAI API 适配器
 *
 * @description
 * 实现 OpenAI API (包括 Codex) 的适配器，赋能多模型支持。
 */

import OpenAI from 'openai';
import type {
  LLMConfig,
  LLMResponse,
  LLMAdapter,
  LLMProvider,
} from '../types/index.js';
import { LLMError } from '../types/index.js';

/**
 * OpenAI 适配器配置
 */
export interface OpenAIConfig extends LLMConfig {
  provider: 'openai';
  apiKey?: string;
  baseURL?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * OpenAI 适配器实现
 */
export class OpenAIAdapter implements LLMAdapter {
  private client: OpenAI | null = null;
  private config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    this.config = {
      provider: 'openai',
      model: config.model || 'gpt-4',
      maxTokens: config.maxTokens || 4096,
      temperature: config.temperature || 0.7,
      ...config,
    };

    if (this.config.apiKey) {
      this.client = new OpenAI({
        apiKey: this.config.apiKey,
        baseURL: this.config.baseURL,
      });
    }
  }

  /**
   * 生成文本
   */
  async generate(prompt: string, options?: LLMConfig): Promise<LLMResponse> {
    if (!this.client) {
      throw new LLMError('OpenAI client not initialized. Please provide API key.');
    }

    try {
      const config = { ...this.config, ...options };
      const response = await this.client.chat.completions.create({
        model: config.model || this.config.model || 'gpt-4',
        max_tokens: config.maxTokens || this.config.maxTokens || 4096,
        temperature: config.temperature || this.config.temperature || 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const choice = response.choices[0];
      if (!choice) {
        throw new LLMError('No response from OpenAI API');
      }

      return {
        content: choice.message.content || '',
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
        model: response.model,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new LLMError(`OpenAI API error: ${error.message}`, error);
      }
      throw new LLMError('Unknown error calling OpenAI API', error);
    }
  }

  /**
   * 流式生成文本
   */
  async generateStream(
    prompt: string,
    options?: LLMConfig,
    onChunk?: (chunk: string) => void
  ): Promise<LLMResponse> {
    if (!this.client) {
      throw new LLMError('OpenAI client not initialized. Please provide API key.');
    }

    try {
      const config = { ...this.config, ...options };
      const stream = await this.client.chat.completions.create({
        model: config.model || this.config.model || 'gpt-4',
        max_tokens: config.maxTokens || this.config.maxTokens || 4096,
        temperature: config.temperature || this.config.temperature || 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: true,
      });

      let fullContent = '';
      let inputTokens = 0;
      let outputTokens = 0;

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          fullContent += delta;
          if (onChunk) {
            onChunk(delta);
          }
        }
        // Note: OpenAI streaming doesn't provide token usage in the stream
      }

      // Get approximate token count
      outputTokens = Math.ceil(fullContent.length / 4);
      inputTokens = Math.ceil(prompt.length / 4);

      return {
        content: fullContent,
        usage: {
          promptTokens: inputTokens,
          completionTokens: outputTokens,
          totalTokens: inputTokens + outputTokens,
        },
        model: config.model || this.config.model || 'gpt-4',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new LLMError(`OpenAI streaming error: ${error.message}`, error);
      }
      throw new LLMError('Unknown error in OpenAI streaming', error);
    }
  }

  /**
   * 检查适配器是否可用
   */
  isAvailable(): boolean {
    return this.client !== null && this.config.apiKey !== undefined;
  }

  /**
   * 获取适配器信息
   */
  getInfo(): { provider: LLMProvider; model: string; available: boolean } {
    return {
      provider: 'openai',
      model: this.config.model || 'gpt-4',
      available: this.isAvailable(),
    };
  }
}
