/**
 * 黑话浓度检测器
 *
 * @description
 * 检测文本中的黑话词汇浓度。
 * 检测赋能量化，形成度量闭环。
 */

import type {
  CompanyType,
  DensityCheckMode,
  DensityCheckResult,
  JargonCategory,
} from '../types/index.js';
import {
  getAllJargonWords,
  getCompanyKeywords,
} from '../data/vocabularies/jargon.js';

// ============================================================================
// 浓度级别
// ============================================================================

/**
 * 浓度级别
 */
type DensityLevel = 'low' | 'medium' | 'high' | 'extreme';

/**
 * 浓度范围
 */
interface DensityRange {
  min: number;
  max: number;
  level: DensityLevel;
}

// ============================================================================
// 黑话浓度检测器
// ============================================================================

/**
 * 黑话浓度检测器类
 */
export class DensityChecker {
  private densityRanges: DensityRange[] = [
    { min: 0, max: 10, level: 'low' },
    { min: 10, max: 25, level: 'medium' },
    { min: 25, max: 50, level: 'high' },
    { min: 50, max: 100, level: 'extreme' },
  ];

  /**
   * 检测文本黑话浓度
   */
  check(text: string, mode: DensityCheckMode = 'overall'): DensityCheckResult {
    const overall = this.checkOverall(text);

    if (mode === 'overall') {
      return { overall };
    }

    if (mode === 'by_category') {
      return {
        overall,
        byCategory: this.checkByCategory(text),
      };
    }

    if (mode === 'detailed') {
      return {
        overall,
        byCategory: this.checkByCategory(text),
        details: this.checkDetailed(text),
        suggestions: this.generateSuggestions(overall.score),
      };
    }

    return { overall };
  }

  /**
   * 检查整体浓度
   */
  private checkOverall(text: string): DensityCheckResult['overall'] {
    const jargonWords = this.extractJargonWords(text);
    const totalWords = this.countWords(text);

    const score = totalWords > 0 ? Math.round((jargonWords.length / totalWords) * 100) : 0;
    const level = this.getDensityLevel(score);

    return { score, level };
  }

  /**
   * 按类别检查浓度
   */
  private checkByCategory(text: string): DensityCheckResult['byCategory'] {
    const categories: JargonCategory[] = [
      'action',
      'concept',
      'data',
      'business',
      'organization',
      'managerial',
      'euphemism',
    ];

    return categories.map((category) => {
      const words = this.extractJargonWordsByCategory(text, category);
      const totalWords = this.countWords(text);
      const count = words.length;
      const percentage = totalWords > 0 ? Math.round((count / totalWords) * 100) : 0;

      return {
        category,
        count,
        percentage,
      };
    });
  }

  /**
   * 详细检查
   */
  private checkDetailed(text: string): DensityCheckResult['details'] {
    const jargonWords = this.extractJargonWords(text);
    const details: DensityCheckResult['details'] = [];

    for (const word of jargonWords) {
      const positions = this.findWordPositions(text, word);
      for (const position of positions) {
        details.push({
          word,
          category: this.categorizeWord(word),
          position,
        });
      }
    }

    return details;
  }

  /**
   * 提取黑话词汇
   */
  private extractJargonWords(text: string): string[] {
    const allJargonWords = getAllJargonWords();
    const words = text.split(/\s+/);
    const jargonWords: string[] = [];

    for (const word of words) {
      const cleanWord = word.replace(/[，。！？、；：""''（）《》【】]/g, '');
      if (allJargonWords.includes(cleanWord)) {
        jargonWords.push(cleanWord);
      }
    }

    return jargonWords;
  }

  /**
   * 按类别提取黑话词汇
   */
  private extractJargonWordsByCategory(text: string, category: JargonCategory): string[] {
    // 这里简化处理，实际可以按类别分组
    return this.extractJargonWords(text).filter((word) =>
      this.categorizeWord(word) === category
    );
  }

  /**
   * 词汇分类
   */
  private categorizeWord(word: string): JargonCategory {
    // 动作类
    const actionWords = [
      '赋能',
      '抓手',
      '落地',
      '闭环',
      '沉淀',
      '输出',
      '提炼',
      '包装',
      '聚焦',
      '倒逼',
    ];
    if (actionWords.includes(word)) return 'action';

    // 概念类
    const conceptWords = [
      '底层逻辑',
      '顶层设计',
      '颗粒度',
      '链路',
      '组合拳',
      '护城河',
    ];
    if (conceptWords.includes(word)) return 'concept';

    // 数据类
    const dataWords = ['DAU', 'MAU', 'GMV', 'ARPU', 'LTV', 'CAC', 'ROI', 'OKR', 'KPI'];
    if (dataWords.includes(word)) return 'data';

    // 业务类
    const businessWords = ['赛道', '护城河', '第二曲线', '飞轮', '破局'];
    if (businessWords.includes(word)) return 'business';

    // 组织类
    const orgWords = ['中台', '前台', '后台', '闭环', '矩阵'];
    if (orgWords.includes(word)) return 'organization';

    // 管理类
    const mgmtWords = ['对齐', '拉齐', '拉通', '复盘', '沉淀', '落地'];
    if (mgmtWords.includes(word)) return 'managerial';

    // 委婉类
    const euphWords = ['优化', '毕业', '输送社会', '降本增效'];
    if (euphWords.includes(word)) return 'euphemism';

    return 'action'; // 默认
  }

  /**
   * 计算词数
   */
  private countWords(text: string): number {
    return text.split(/\s+/).length;
  }

  /**
   * 查找词位置
   */
  private findWordPositions(text: string, word: string): number[] {
    const positions: number[] = [];
    let index = text.indexOf(word);

    while (index !== -1) {
      positions.push(index);
      index = text.indexOf(word, index + 1);
    }

    return positions;
  }

  /**
   * 获取浓度级别
   */
  private getDensityLevel(score: number): DensityLevel {
    for (const range of this.densityRanges) {
      if (score >= range.min && score < range.max) {
        return range.level;
      }
    }
    return 'low';
  }

  /**
   * 生成优化建议
   */
  private generateSuggestions(score: number): string[] {
    const suggestions: string[] = [];

    if (score < 10) {
      suggestions.push('黑话浓度较低，建议适当增加黑话词汇以增强风格特征');
    } else if (score < 25) {
      suggestions.push('黑话浓度适中，风格特征明显');
    } else if (score < 50) {
      suggestions.push('黑话浓度较高，风格特征强烈');
      suggestions.push('注意保持文本可读性');
    } else {
      suggestions.push('⚠️ 黑话浓度极高，可能影响理解');
      suggestions.push('建议降低黑话使用频率');
    }

    return suggestions;
  }

  /**
   * 检测指定公司的风格浓度
   */
  checkCompanyDensity(text: string, company: CompanyType): number {
    const keywords = getCompanyKeywords(company);
    const words = text.split(/\s+/);
    const totalWords = words.length;

    if (totalWords === 0) return 0;

    const matchedWords = words.filter((word) => keywords.includes(word));
    return Math.round((matchedWords.length / totalWords) * 100);
  }

  /**
   * 比较两个文本的黑话浓度差异
   */
  compare(text1: string, text2: string): {
    text1: DensityCheckResult['overall'];
    text2: DensityCheckResult['overall'];
    diff: number;
  } {
    const result1 = this.checkOverall(text1);
    const result2 = this.checkOverall(text2);

    return {
      text1: result1,
      text2: result2,
      diff: result2.score - result1.score,
    };
  }

  /**
   * 生成浓度报告
   */
  generateReport(text: string): string {
    const result = this.check(text, 'detailed');

    let report = `## 黑话浓度检测报告\n\n`;
    report += `**整体浓度**: ${result.overall.score}% (${result.overall.level})\n\n`;

    if (result.byCategory) {
      report += `### 分类统计\n\n`;
      report += `| 类别 | 数量 | 占比 |\n`;
      report += `|------|------|------|\n`;

      for (const category of result.byCategory) {
        report += `| ${category.category} | ${category.count} | ${category.percentage}% |\n`;
      }

      report += `\n`;
    }

    if (result.details && result.details.length > 0) {
      report += `### 详细位置\n\n`;
      report += `| 词汇 | 类别 | 位置 |\n`;
      report += `|------|------|------|\n`;

      for (const detail of result.details.slice(0, 20)) {
        // 限制显示数量
        report += `| ${detail.word} | ${detail.category} | ${detail.position} |\n`;
      }

      if (result.details.length > 20) {
        report += `| ... | ... | ... |\n`;
      }

      report += `\n`;
    }

    if (result.suggestions && result.suggestions.length > 0) {
      report += `### 优化建议\n\n`;
      for (const suggestion of result.suggestions) {
        report += `- ${suggestion}\n`;
      }
    }

    return report;
  }
}

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 检测黑话浓度
 */
export function checkDensity(
  text: string,
  mode: DensityCheckMode = 'overall'
): DensityCheckResult {
  const checker = new DensityChecker();
  return checker.check(text, mode);
}

/**
 * 检测公司风格浓度
 */
export function checkCompanyDensity(text: string, company: CompanyType): number {
  const checker = new DensityChecker();
  return checker.checkCompanyDensity(text, company);
}

/**
 * 生成浓度报告
 */
export function generateDensityReport(text: string): string {
  const checker = new DensityChecker();
  return checker.generateReport(text);
}
