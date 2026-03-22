/**
 * 风格识别器
 *
 * @description
 * 识别文本所属的大厂风格。
 * 识别赋能分析，形成判断闭环。
 */

import type {
  CompanyType,
  StyleRecognitionConfig,
  StyleRecognitionResult,
} from '../types/index.js';
import { generate } from '../llm/adapter.js';
import { getCompanyKeywords } from '../data/vocabularies/jargon.js';

// ============================================================================
// 风格特征
// ============================================================================

/**
 * 公司风格特征
 */
interface CompanyStyleFeatures {
  company: CompanyType;
  keywords: string[];
  patterns: string[];
  tone: string;
}

// ============================================================================
// 风格识别器
// ============================================================================

/**
 * 风格识别器类
 */
export class StyleRecognizer {
  private styleFeatures: Map<CompanyType, CompanyStyleFeatures>;

  constructor() {
    this.styleFeatures = new Map();
    this.initializeFeatures();
  }

  /**
   * 初始化风格特征
   */
  private initializeFeatures(): void {
    const features: CompanyStyleFeatures[] = [
      {
        company: 'ali',
        keywords: ['赋能', '抓手', '闭环', '中台', '对齐', '沉淀', '颗粒度'],
        patterns: [
          '以XX为抓手',
          '赋能XX生态',
          '形成XX闭环',
          '沉淀XX方法论',
          '拉齐颗粒度',
        ],
        tone: '激进、紧迫、层级感强',
      },
      {
        company: 'tencent',
        keywords: ['赛道', '赛马', 'DAU', '产品经理', '瑞雪', '活水'],
        patterns: ['这个赛道', '赛马机制', '数据说话', '产品经理怎么看'],
        tone: '务实、中立、数据驱动',
      },
      {
        company: 'bytedance',
        keywords: ['Doc', 'Double', 'OKR', 'Context', '同步', '优先级'],
        patterns: ['在Doc上', 'Double一下', 'Context拉齐', '看数据'],
        tone: '直接、高效、扁平',
      },
      {
        company: 'meituan',
        keywords: ['长期', '耐心', 'ROI', 'Think', 'Long', 'Term'],
        patterns: ['长期有耐心', 'Think Long Term', '做正确的事'],
        tone: '稳健、长远、理性',
      },
      {
        company: 'huawei',
        keywords: ['奋斗', '战役', '胶片', '一线', '拉通', '艰苦奋斗'],
        patterns: ['打赢XX战役', '拉通XX', '持续艰苦奋斗'],
        tone: '紧迫、集体主义、危机感',
      },
      {
        company: 'baidu',
        keywords: ['结果', '交付', '简单', '可依赖', 'AI', '算法'],
        patterns: ['简单可依赖', '只看结果', '及时交付'],
        tone: '理性、冷血、直接',
      },
      {
        company: 'netease',
        keywords: ['态度', '匠心', '品质', '有温度', '有态度'],
        patterns: ['要有态度', '用匠心打造', '做时间的朋友'],
        tone: '温和、从容、情感化',
      },
    ];

    for (const feature of features) {
      this.styleFeatures.set(feature.company, feature);
    }
  }

  /**
   * 识别文本风格
   */
  async recognize(
    text: string,
    config?: StyleRecognitionConfig
  ): Promise<StyleRecognitionResult> {
    // 快速检测：基于关键词的初步判断
    const quickResult = this.quickRecognition(text);
    if (quickResult.confidence > 0.8) {
      return quickResult;
    }

    // 深度分析：使用 LLM 进行精确识别
    return this.deepRecognition(text, config);
  }

  /**
   * 快速识别（基于关键词）
   */
  private quickRecognition(text: string): StyleRecognitionResult {
    const scores: Map<CompanyType, number> = new Map();

    // 初始化分数
    for (const company of this.styleFeatures.keys()) {
      scores.set(company, 0);
    }

    // 统计各公司关键词出现次数
    const words = text.split(/\s+/);
    for (const word of words) {
      for (const [company, features] of this.styleFeatures) {
        if (features.keywords.includes(word)) {
          scores.set(company, (scores.get(company) || 0) + 1);
        }
      }
    }

    // 检查句式模式
    for (const [company, features] of this.styleFeatures) {
      for (const pattern of features.patterns) {
        if (text.includes(pattern)) {
          scores.set(company, (scores.get(company) || 0) + 2); // 句式权重更高
        }
      }
    }

    // 找出最高分
    let maxScore = 0;
    let bestCompany: CompanyType | 'unknown' = 'unknown';

    for (const [company, score] of scores) {
      if (score > maxScore) {
        maxScore = score;
        bestCompany = company;
      }
    }

    // 计算置信度
    const totalScore = Array.from(scores.values()).reduce((sum, score) => sum + score, 0);
    const confidence = totalScore > 0 ? maxScore / totalScore : 0;

    // 如果分数太低，返回 unknown
    if (maxScore < 2) {
      return {
        company: 'unknown',
        confidence: 0,
      };
    }

    return {
      company: bestCompany,
      confidence: Math.min(confidence * 1.5, 1), // 放大置信度
    };
  }

  /**
   * 深度识别（使用 LLM）
   */
  private async deepRecognition(
    text: string,
    config?: StyleRecognitionConfig
  ): Promise<StyleRecognitionResult> {
    const prompt = this.buildRecognitionPrompt(text, config);

    const response = await generate(prompt);

    // 解析响应
    return this.parseRecognitionResult(response.content, text, config);
  }

  /**
   * 构建识别提示词
   */
  private buildRecognitionPrompt(
    text: string,
    config?: StyleRecognitionConfig
  ): string {
    const companies = Array.from(this.styleFeatures.keys());

    return `你是一个大厂语言风格识别专家。请分析以下文本的风格特征，并判断其属于哪家互联网大厂的风格。

## 支持的公司风格
${companies
  .map(
    (company) => `
### ${this.getCompanyName(company)}
- 关键词：${this.styleFeatures.get(company)!.keywords.join('、')}
- 句式：${this.styleFeatures.get(company)!.patterns.join('；')}
- 语气：${this.styleFeatures.get(company)!.tone}
`
  )
  .join('\n')}

## 待分析文本
${text}

## 输出格式
请严格按照以下JSON格式输出，不要添加任何其他内容：
\`\`\`json
{
  "company": "公司代码(ali/tencent/bytedance/meituan/huawei/baidu/netease/unknown)",
  "confidence": 0-1之间的数字,
  "analysis": {
    "keywords": ["检测到的关键词1", "关键词2"],
    "density": 黑话浓度0-100,
    "tone": "语气分析",
    "patterns": ["检测到的句式1", "句式2"]
  }
}
\`\`\`

请输出JSON格式的分析结果。`;
  }

  /**
   * 解析识别结果
   */
  private parseRecognitionResult(
    response: string,
    originalText: string,
    config?: StyleRecognitionConfig
  ): StyleRecognitionResult {
    try {
      // 尝试提取 JSON
      let jsonStr = response.trim();

      // 移除可能的 markdown 代码块标记
      if (jsonStr.startsWith('```')) {
        const lines = jsonStr.split('\n');
        lines.shift(); // 移除第一行 ```
        if (lines[lines.length - 1] === '```') {
          lines.pop(); // 移除最后一行 ```
        }
        jsonStr = lines.join('\n');
      }

      // 解析 JSON
      const result = JSON.parse(jsonStr);

      return {
        company: result.company || 'unknown',
        confidence: result.confidence || 0,
        analysis: config?.detailed ? result.analysis : undefined,
      };
    } catch (error) {
      // 解析失败，使用快速识别作为后备
      return this.quickRecognition(originalText);
    }
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
   * 批量识别
   */
  async recognizeBatch(
    texts: string[],
    config?: StyleRecognitionConfig
  ): Promise<StyleRecognitionResult[]> {
    return Promise.all(texts.map((text) => this.recognize(text, config)));
  }

  /**
   * 比较两个文本的风格相似度
   */
  async compareSimilarity(text1: string, text2: string): Promise<number> {
    const [result1, result2] = await Promise.all([
      this.recognize(text1),
      this.recognize(text2),
    ]);

    // 如果是同一公司
    if (result1.company === result2.company && result1.company !== 'unknown') {
      // 基于置信度计算相似度
      return (result1.confidence + result2.confidence) / 2;
    }

    // 不同公司
    return 0;
  }
}

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 识别文本风格
 */
export async function recognizeStyle(
  text: string,
  config?: StyleRecognitionConfig
): Promise<StyleRecognitionResult> {
  const recognizer = new StyleRecognizer();
  return recognizer.recognize(text, config);
}

/**
 * 批量识别文本风格
 */
export async function recognizeStyleBatch(
  texts: string[],
  config?: StyleRecognitionConfig
): Promise<StyleRecognitionResult[]> {
  const recognizer = new StyleRecognizer();
  return recognizer.recognizeBatch(texts, config);
}

/**
 * 比较文本风格相似度
 */
export async function compareStyleSimilarity(
  text1: string,
  text2: string
): Promise<number> {
  const recognizer = new StyleRecognizer();
  return recognizer.compareSimilarity(text1, text2);
}
