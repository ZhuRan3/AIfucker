/**
 * Claude API 适配器
 *
 * @description
 * 实现 Claude API 的适配器，赋能 AI 调用能力。
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  LLMConfig,
  LLMResponse,
  LLMAdapter,
  LLMProvider,
} from '../types/index.js';
import { LLMError } from '../types/index.js';

/**
 * Claude 适配器配置
 */
export interface ClaudeConfig extends LLMConfig {
  provider: 'claude';
  apiKey?: string;
  model?: string;
  baseURL?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Claude 适配器实现
 */
export class ClaudeAdapter implements LLMAdapter {
  private client: Anthropic | null = null;
  private config: ClaudeConfig;

  constructor(config: ClaudeConfig) {
    this.config = {
      provider: 'claude',
      model: config.model || 'claude-3-5-sonnet-20241022',
      maxTokens: config.maxTokens || 4096,
      temperature: config.temperature || 0.7,
      ...config,
    };

    if (this.config.apiKey) {
      this.client = new Anthropic({
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
      throw new LLMError('Claude client not initialized. Please provide API key.');
    }

    try {
      const config = { ...this.config, ...options };
      const response = await this.client.messages.create({
        model: config.model || this.config.model || 'claude-3-5-sonnet-20241022',
        max_tokens: config.maxTokens || this.config.maxTokens || 4096,
        temperature: config.temperature || this.config.temperature || 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return {
          content: content.text,
          usage: {
            promptTokens: response.usage.input_tokens,
            completionTokens: response.usage.output_tokens,
            totalTokens: response.usage.input_tokens + response.usage.output_tokens,
          },
          model: response.model,
        };
      }

      throw new LLMError('Unexpected response type from Claude API');
    } catch (error) {
      if (error instanceof Error) {
        throw new LLMError(`Claude API error: ${error.message}`, error);
      }
      throw new LLMError('Unknown error calling Claude API', error);
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
      throw new LLMError('Claude client not initialized. Please provide API key.');
    }

    try {
      const config = { ...this.config, ...options };
      const stream = await this.client.messages.create({
        model: config.model || this.config.model || 'claude-3-5-sonnet-20241022',
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

      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            const chunk = event.delta.text;
            fullContent += chunk;
            if (onChunk) {
              onChunk(chunk);
            }
          }
        } else if (event.type === 'message_start') {
          inputTokens = event.message.usage.input_tokens;
        } else if (event.type === 'message_delta') {
          outputTokens = event.usage.output_tokens;
        }
      }

      return {
        content: fullContent,
        usage: {
          promptTokens: inputTokens,
          completionTokens: outputTokens,
          totalTokens: inputTokens + outputTokens,
        },
        model: config.model || this.config.model || 'claude-3-5-sonnet-20241022',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new LLMError(`Claude streaming error: ${error.message}`, error);
      }
      throw new LLMError('Unknown error in Claude streaming', error);
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
      provider: 'claude',
      model: this.config.model || 'claude-3-5-sonnet-20241022',
      available: this.isAvailable(),
    };
  }
}
