/**
 * 配置管理
 *
 * @description
 * 加载和管理项目配置。
 */

import type { GlobalConfig } from '../types/index.js';
import { cosmiconfig } from 'cosmiconfig';
import { resolve } from 'path';
import { existsSync } from 'fs';

/**
 * 配置文件名称
 */
const CONFIG_FILES = [
  'jargon-pua.config',
  'jargon-pua.config.json',
  'jargon-pua.config.yml',
  'jargon-pua.config.yaml',
  '.jargon-puarc',
  '.jargon-puarc.json',
  '.jargon-puarc.yml',
  '.jargon-puarc.yaml',
];

/**
 * 默认配置
 */
export const DEFAULT_CONFIG: GlobalConfig = {
  llm: {
    provider: 'claude',
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 4096,
    temperature: 0.7,
  },
  mode: 'normal',
  intensity: {
    pua: 'moderate',
    jargon: 'medium',
  },
  loop: {
    maxIterations: 5,
    increasePUAIntensity: true,
    rotateReviewer: true,
    logEachIteration: true,
    alignmentThreshold: 90,
  },
  safety: {
    enabled: true,
    maxChanges: 100,
    maxDeletionRatio: 0.3,
    confirmDangerZone: true,
  },
  logging: {
    enabled: true,
    level: 'info',
    saveToFile: false,
  },
};

/**
 * 加载配置
 */
export async function loadConfig(): Promise<GlobalConfig> {
  // 使用 cosmiconfig 加载配置
  const explorer = cosmiconfig('jargon-pua');

  const result = await explorer.search();

  if (result) {
    return { ...DEFAULT_CONFIG, ...result.config };
  }

  return DEFAULT_CONFIG;
}

/**
 * 从文件加载配置
 */
export async function loadConfigFromFile(filePath: string): Promise<GlobalConfig> {
  const { exists } = await import('fs');
  const { join } = await import('path');

  if (!exists(filePath)) {
    throw new Error(`配置文件不存在: ${filePath}`);
  }

  // 根据文件扩展名选择加载方式
  if (filePath.endsWith('.json')) {
    const fs = await import('fs/promises');
    const content = await fs.readFile(filePath, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(content) };
  } else if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
    const yaml = await import('js-yaml');
    const fs = await import('fs/promises');
    const content = await fs.readFile(filePath, 'utf-8');
    return { ...DEFAULT_CONFIG, ...yaml.load(content) };
  }

  throw new Error(`不支持的配置文件格式: ${filePath}`);
}

/**
 * 保存配置到文件
 */
export async function saveConfig(
  filePath: string,
  config: GlobalConfig
): Promise<void> {
  const fs = await import('fs/promises');
  const { dirname } = await import('path');

  // 确保目录存在
  const dir = dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  // 根据文件扩展名选择保存方式
  if (filePath.endsWith('.json')) {
    await fs.writeFile(filePath, JSON.stringify(config, null, 2), 'utf-8');
  } else if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
    const yaml = await import('js-yaml');
    await fs.writeFile(filePath, yaml.dump(config), 'utf-8');
  } else {
    throw new Error(`不支持的配置文件格式: ${filePath}`);
  }
}

/**
 * 获取环境变量
 */
export function loadEnvConfig(): Partial<GlobalConfig> {
  const config: Partial<GlobalConfig> = {};

  // LLM 配置
  if (process.env.ANTHROPIC_API_KEY) {
    config.llm = {
      ...config.llm,
      provider: 'claude',
      apiKey: process.env.ANTHROPIC_API_KEY,
    };
  }

  if (process.env.OPENAI_API_KEY) {
    config.llm = {
      ...config.llm,
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
    };
  }

  if (process.env.DEFAULT_CLAUDE_MODEL) {
    config.llm = {
      ...config.llm,
      model: process.env.DEFAULT_CLAUDE_MODEL,
    };
  }

  // 强度配置
  if (process.env.DEFAULT_PUA_INTENSITY) {
    config.intensity = {
      ...config.intensity,
      pua: process.env.DEFAULT_PUA_INTENSITY as any,
    };
  }

  if (process.env.DEFAULT_JARGON_INTENSITY) {
    config.intensity = {
      ...config.intensity,
      jargon: process.env.DEFAULT_JARGON_INTENSITY as any,
    };
  }

  return config;
}

/**
 * 合并配置
 */
export function mergeConfigs(
  ...configs: (Partial<GlobalConfig> | undefined)[]
): GlobalConfig {
  let result = { ...DEFAULT_CONFIG };

  for (const config of configs) {
    if (config) {
      result = { ...result, ...config };
    }
  }

  return result;
}
