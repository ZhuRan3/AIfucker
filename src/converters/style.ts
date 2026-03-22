/**
 * 风格转换器
 *
 * @description
 * 实现文本风格从一种大厂风格到另一种风格的转换。
 * 转换赋能表达，形成风格闭环。
 */

import type {
  CompanyType,
  StyleConversionConfig,
  StyleConversionResult,
  JargonIntensity,
} from '../types/index.js';
import { generate } from '../llm/adapter.js';
import { getCompanyKeywords, getCompanyPatterns } from '../data/vocabularies/jargon.js';

// ============================================================================
// 转换配置
// ============================================================================

/**
 * 风格转换选项
 */
export interface ConversionOptions {
  targetStyle: CompanyType;
  sourceStyle?: CompanyType;
  intensity?: JargonIntensity;
  preserveMeaning?: boolean;
}

// ============================================================================
// 风格转换器
// ============================================================================

/**
 * 风格转换器类
 */
export class StyleConverter {
  /**
   * 转换文本风格
   */
  async convert(
    text: string,
    options: ConversionOptions
  ): Promise<string> {
    const { targetStyle, intensity = 'medium', preserveMeaning = true } = options;

    // 构建转换提示词
    const prompt = this.buildConversionPrompt(text, targetStyle, {
      intensity,
      preserveMeaning,
    });

    // 调用 LLM 进行转换
    const response = await generate(prompt);

    // 清理响应
    let result = response.content.trim();

    // 移除可能的引号包裹
    if (result.startsWith('"') && result.endsWith('"')) {
      result = result.slice(1, -1);
    }
    if (result.startsWith("'") && result.endsWith("'")) {
      result = result.slice(1, -1);
    }

    return result;
  }

  /**
   * 批量转换
   */
  async convertBatch(
    texts: string[],
    options: ConversionOptions
  ): Promise<string[]> {
    return Promise.all(texts.map((text) => this.convert(text, options)));
  }

  /**
   * 构建转换提示词
   */
  private buildConversionPrompt(
    text: string,
    targetStyle: CompanyType,
    options: {
      intensity?: JargonIntensity;
      preserveMeaning?: boolean;
    }
  ): string {
    const { intensity = 'medium', preserveMeaning = true } = options;

    // 获取目标风格的关键词和句式
    const keywords = getCompanyKeywords(targetStyle);
    const patterns = getCompanyPatterns(targetStyle);

    // 根据强度确定词汇使用频率
    const intensityGuide = this.getIntensityGuide(intensity);

    // 构建提示词
    return `你是一个大厂语言风格转换专家。请将以下文本改写为${this.getCompanyName(
      targetStyle
    )}风格。

## 目标风格特征
- 核心关键词：${keywords.slice(0, 10).join('、')}
- 典型句式：${patterns.slice(0, 3).join('；')}
- 语气特征：${this.getToneDescription(targetStyle)}

## 强度要求
${intensityGuide}

## 原始文本
${text}

## 转换要求
${preserveMeaning ? '1. 保留原始核心语义' : '1. 根据风格重新表达'}
2. 完全采用目标公司的词汇习惯
3. 使用目标公司的典型句式
4. 体现目标公司的语气态度
5. 自然融入目标公司的标志性表达

请直接输出转换后的文本，不要添加任何解释或说明。`;
  }

  /**
   * 获取强度指导
   */
  private getIntensityGuide(intensity: JargonIntensity): string {
    const guides: Record<JargonIntensity, string> = {
      none: '不要使用任何黑话词汇，用普通语言表达。',
      light: '偶尔使用黑话词汇点缀，整体保持自然流畅。',
      medium: '适量使用黑话词汇，明显体现风格特征。',
      heavy: '大量使用黑话词汇，形成强烈的风格特征。',
      extreme: '满篇使用黑话词汇，形成极致的风格表达。',
    };

    return guides[intensity];
  }

  /**
   * 获取公司名称
   */
  private getCompanyName(company: CompanyType): string {
    const names: Record<CompanyType, string> = {
      ali: '阿里巴巴',
      tencent: '腾讯',
      bytedance: '字节跳动',
      meituan: '美团',
      huawei: '华为',
      baidu: '百度',
      netease: '网易',
    };

    return names[company];
  }

  /**
   * 获取语气描述
   */
  private getToneDescription(company: CompanyType): string {
    const tones: Record<CompanyType, string> = {
      ali: '激进、紧迫、层级感强，强调赋能、闭环、沉淀',
      tencent: '务实、中立、数据驱动，强调赛道、赛马、产品经理',
      bytedance: '直接、高效、扁平，强调Doc、Double、Context',
      meituan: '稳健、长远、低调凶猛，强调长期、耐心、ROI',
      huawei: '紧迫、集体主义、危机感，强调奋斗、战役、胶片',
      baidu: '理性、技术化，强调结果、交付、简单可依赖',
      netease: '从容、情感化、佛系，强调态度、匠心、品质',
    };

    return tones[company];
  }

  /**
   * 详细转换（包含变化分析）
   */
  async convertWithAnalysis(
    text: string,
    options: ConversionOptions
  ): Promise<StyleConversionResult> {
    const { targetStyle, sourceStyle } = options;

    // 执行转换
    const convertedText = await this.convert(text, options);

    // 分析变化
    const changes = this.analyzeChanges(text, convertedText, targetStyle);

    // 计算统计信息
    const originalDensity = this.calculateJargonDensity(text, sourceStyle);
    const convertedDensity = this.calculateJargonDensity(convertedText, targetStyle);

    return {
      convertedText,
      changes,
      statistics: {
        originalDensity,
        convertedDensity,
        changeRate: convertedDensity - originalDensity,
      },
    };
  }

  /**
   * 分析文本变化
   */
  private analyzeChanges(
    original: string,
    converted: string,
    targetStyle: CompanyType
  ): StyleConversionResult['changes'] {
    const changes: StyleConversionResult['changes'] = [];
    const keywords = getCompanyKeywords(targetStyle);

    // 简单的变化检测（实际实现可以更复杂）
    const originalWords = original.split(/\s+/);
    const convertedWords = converted.split(/\s+/);

    // 检测新增的黑话词汇
    for (const word of convertedWords) {
      if (keywords.includes(word) && !originalWords.includes(word)) {
        changes.push({
          original: '',
          converted: word,
          type: 'keyword',
        });
      }
    }

    return changes;
  }

  /**
   * 计算黑话浓度
   */
  private calculateJargonDensity(text: string, company?: CompanyType): number {
    if (!text) return 0;

    const words = text.split(/\s+/);
    if (words.length === 0) return 0;

    const allJargonWords = company ? getCompanyKeywords(company) : [];
    const jargonCount = words.filter((word) => allJargonWords.includes(word)).length;

    return Math.round((jargonCount / words.length) * 100);
  }
}

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 转换文本风格
 */
export async function convertStyle(
  text: string,
  targetStyle: CompanyType,
  options?: Partial<ConversionOptions>
): Promise<string> {
  const converter = new StyleConverter();
  return converter.convert(text, { targetStyle, ...options });
}

/**
 * 转换文本风格（带分析）
 */
export async function convertStyleWithAnalysis(
  text: string,
  targetStyle: CompanyType,
  options?: Partial<ConversionOptions>
): Promise<StyleConversionResult> {
  const converter = new StyleConverter();
  return converter.convertWithAnalysis(text, { targetStyle, ...options });
}
