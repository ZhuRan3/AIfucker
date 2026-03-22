/**
 * PUA 话术生成器
 *
 * @description
 * 根据场景和风格生成 PUA 话术。
 * 生成赋能操控，形成 PUA 闭环。
 */

import type {
  CompanyType,
  PUAIntensity,
  PUAScenario,
  PUAGenerationConfig,
  PUAGenerationResult,
} from '../types/index.js';
import { generate } from '../llm/adapter.js';
import {
  getFormulasByScenario,
  getFormulasByCompany,
  getFormulasByIntensity,
  type PUAFormula,
} from '../data/formulas/pua.js';

// ============================================================================
// PUA 生成器
// ============================================================================

/**
 * PUA 话术生成器类
 */
export class PUAGenerator {
  /**
   * 生成 PUA 话术
   */
  async generate(config: PUAGenerationConfig): Promise<PUAGenerationResult> {
    const { scenario, style, intensity, target } = config;

    // 选择合适的公式
    const formula = this.selectFormula(scenario, style, intensity);

    // 构建生成提示词
    const prompt = this.buildGenerationPrompt(formula, {
      scenario,
      style,
      intensity,
      target,
    });

    // 调用 LLM 生成
    const response = await generate(prompt);

    // 清理响应
    let puaText = response.content.trim();

    // 移除可能的引号包裹
    if (puaText.startsWith('"') && puaText.endsWith('"')) {
      puaText = puaText.slice(1, -1);
    }
    if (puaText.startsWith("'") && puaText.endsWith("'")) {
      puaText = puaText.slice(1, -1);
    }

    // 提取元素
    const elements = this.extractElements(puaText, formula);

    // 生成警告（如果需要）
    const warning = this.generateWarning(intensity);

    return {
      puaText,
      formula: formula.name,
      elements,
      warning,
    };
  }

  /**
   * 批量生成
   */
  async generateBatch(
    configs: PUAGenerationConfig[]
  ): Promise<PUAGenerationResult[]> {
    return Promise.all(configs.map((config) => this.generate(config)));
  }

  /**
   * 选择合适的公式
   */
  private selectFormula(
    scenario: PUAScenario,
    style: CompanyType,
    intensity: PUAIntensity
  ): PUAFormula {
    // 按场景筛选
    let formulas = getFormulasByScenario(scenario);

    // 按公司筛选
    formulas = formulas.filter((f) => !f.companies || f.companies.includes(style));

    // 按强度筛选
    const intensityFormulas = getFormulasByIntensity(intensity);
    formulas = formulas.filter((f) => intensityFormulas.includes(f));

    // 如果没有合适的，返回该场景的第一个公式
    if (formulas.length === 0) {
      const scenarioFormulas = getFormulasByScenario(scenario);
      return scenarioFormulas[0];
    }

    // 随机选择一个公式
    return formulas[Math.floor(Math.random() * formulas.length)];
  }

  /**
   * 构建生成提示词
   */
  private buildGenerationPrompt(
    formula: PUAFormula,
    options: {
      scenario: PUAScenario;
      style: CompanyType;
      intensity: PUAIntensity;
      target?: string;
    }
  ): string {
    const { scenario, style, intensity, target } = options;

    return `你是一个大厂PUA话术专家。请根据以下要求生成PUA话术。

## 使用公式
${formula.name}
模板：${formula.template}

## 场景
${this.getScenarioDescription(scenario)}

## 目标风格
${this.getCompanyName(style)} - ${this.getStyleDescription(style)}

## 强度要求
${this.getIntensityDescription(intensity)}

${target ? `## 对象描述\n${target}\n` : ''}

## 生成要求
1. 严格按照公式的模板结构生成
2. 完全采用目标公司的语言风格
3. 体现目标公司的语气特点
4. 强度符合要求
5. 自然流畅，不要生硬

请直接输出PUA话术，不要添加任何解释或说明。`;
  }

  /**
   * 获取场景描述
   */
  private getScenarioDescription(scenario: PUAScenario): string {
    const descriptions: Record<PUAScenario, string> = {
      criticism: '批评下属工作不达标',
      motivation: '激励下属更努力工作',
      rejection: '拒绝下属的涨薪要求',
      overtime: '要求下属加班完成任务',
      salary_refuse: '拒绝下属的升职加薪请求',
      blame: '将问题责任推给下属',
      praise: '表扬下属（反向PUA，实际上是在施压）',
      custom: '自定义场景',
    };

    return descriptions[scenario];
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
   * 获取风格描述
   */
  private getStyleDescription(style: CompanyType): string {
    const descriptions: Record<CompanyType, string> = {
      ali: '强调赋能、闭环、沉淀，使用大量黑话词汇',
      tencent: '强调赛道、赛马、数据，相对务实',
      bytedance: '强调Doc、Double、OKR，直接高效',
      meituan: '强调长期、耐心、ROI，理性稳健',
      huawei: '强调奋斗、战役、胶片，军事化色彩',
      baidu: '强调结果、交付、效率，冷血直接',
      netease: '强调态度、匠心、品质，温和从容',
    };

    return descriptions[style];
  }

  /**
   * 获取强度描述
   */
  private getIntensityDescription(intensity: PUAIntensity): string {
    const descriptions: Record<PUAIntensity, string> = {
      none: '正常交流，无PUA成分',
      mild: '委婉建议，语气温和',
      moderate: '正常批评，语气适中',
      strong: '严厉批评，语气强烈',
      extreme: '情绪施压，语气极重，可能造成心理压力',
    };

    return descriptions[intensity];
  }

  /**
   * 提取PUA元素
   */
  private extractElements(text: string, formula: PUAFormula): PUAGenerationResult['elements'] {
    const elements: PUAGenerationResult['elements'] = [];

    // 提取起始词
    const starters = ['其实', '说实话', '讲真', '坦白讲', '直接说'];
    for (const starter of starters) {
      if (text.startsWith(starter)) {
        elements.push({ type: 'starter', content: starter });
        break;
      }
    }

    // 提取否定词
    const negatives = ['失望', '太差', '不够', '缺乏', '辜负'];
    for (const negative of negatives) {
      if (text.includes(negative)) {
        elements.push({ type: 'negative', content: negative });
      }
    }

    // 提取要求词
    const requirements = ['要有', '需要', '应该', '必须'];
    for (const requirement of requirements) {
      if (text.includes(requirement)) {
        elements.push({ type: 'requirement', content: requirement });
      }
    }

    return elements;
  }

  /**
   * 生成警告
   */
  private generateWarning(intensity: PUAIntensity): string | undefined {
    if (intensity === 'extreme') {
      return '⚠️ 警告：此话术强度极高，可能造成心理压力，请谨慎使用。';
    }
    if (intensity === 'strong') {
      return '⚠️ 提示：此话术强度较高，请注意使用场合。';
    }
    return undefined;
  }

  /**
   * 生成多个变体
   */
  async generateVariants(
    config: PUAGenerationConfig,
    count: number = 3
  ): Promise<PUAGenerationResult[]> {
    const results: PUAGenerationResult[] = [];

    for (let i = 0; i < count; i++) {
      const result = await this.generate(config);
      results.push(result);
    }

    return results;
  }

  /**
   * 生成渐进式PUA序列
   */
  async generateProgressiveSequence(
    config: Omit<PUAGenerationConfig, 'intensity'>,
    startIntensity: PUAIntensity = 'mild',
    endIntensity: PUAIntensity = 'strong',
    steps: number = 3
  ): Promise<PUAGenerationResult[]> {
    const intensities: PUAIntensity[] = ['mild', 'moderate', 'strong', 'extreme'];
    const startIndex = intensities.indexOf(startIntensity);
    const endIndex = intensities.indexOf(endIntensity);

    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Invalid intensity range');
    }

    const selectedIntensities = intensities.slice(
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex) + 1
    );

    const results: PUAGenerationResult[] = [];

    for (const intensity of selectedIntensities) {
      const result = await this.generate({ ...config, intensity });
      results.push(result);
    }

    return results;
  }
}

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 生成PUA话术
 */
export async function generatePUA(config: PUAGenerationConfig): Promise<PUAGenerationResult> {
  const generator = new PUAGenerator();
  return generator.generate(config);
}

/**
 * 批量生成PUA话术
 */
export async function generatePUABatch(
  configs: PUAGenerationConfig[]
): Promise<PUAGenerationResult[]> {
  const generator = new PUAGenerator();
  return generator.generateBatch(configs);
}

/**
 * 生成PUA话术变体
 */
export async function generatePUAVariants(
  config: PUAGenerationConfig,
  count: number = 3
): Promise<PUAGenerationResult[]> {
  const generator = new PUAGenerator();
  return generator.generateVariants(config, count);
}
