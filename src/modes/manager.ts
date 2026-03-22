/**
 * 模式管理器
 *
 * @description
 * 管理交互模式（normal/jargon/pua/full）的切换和状态。
 * 模式赋能体验，形成切换闭环。
 */

import type {
  InteractionMode,
  PUAIntensity,
  JargonIntensity,
  CompanyType,
} from '../types/index.js';
import { StyleConverter } from '../converters/style.js';
import { PUAGenerator } from '../generators/pua.js';

// ============================================================================
// 模式配置
// ============================================================================

/**
 * 模式配置
 */
export interface ModeConfig {
  mode: InteractionMode;
  jargon?: {
    enabled: boolean;
    company: CompanyType;
    intensity: JargonIntensity;
  };
  pua?: {
    enabled: boolean;
    company: CompanyType;
    intensity: PUAIntensity;
  };
}

/**
 * 模式状态
 */
export interface ModeState {
  current: InteractionMode;
  previous: InteractionMode | null;
  activatedAt: number;
  config: ModeConfig;
}

// ============================================================================
// 模式管理器
// ============================================================================

/**
 * 模式管理器类
 */
export class ModeManager {
  private state: ModeState;
  private converter: StyleConverter;
  private puaGenerator: PUAGenerator;

  constructor() {
    this.state = {
      current: 'normal',
      previous: null,
      activatedAt: Date.now(),
      config: {
        mode: 'normal',
      },
    };
    this.converter = new StyleConverter();
    this.puaGenerator = new PUAGenerator();
  }

  /**
   * 获取当前模式
   */
  getCurrentMode(): InteractionMode {
    return this.state.current;
  }

  /**
   * 获取模式状态
   */
  getState(): ModeState {
    return { ...this.state };
  }

  /**
   * 切换模式
   */
  async switchMode(
    mode: InteractionMode,
    options?: {
      company?: CompanyType;
      jargonIntensity?: JargonIntensity;
      puaIntensity?: PUAIntensity;
    }
  ): Promise<void> {
    // 保存之前的模式
    this.state.previous = this.state.current;

    // 更新模式
    this.state.current = mode;
    this.state.activatedAt = Date.now();

    // 更新配置
    this.state.config = this.buildModeConfig(mode, options);

    // 返回模式切换消息
    return;
  }

  /**
   * 构建模式配置
   */
  private buildModeConfig(
    mode: InteractionMode,
    options?: {
      company?: CompanyType;
      jargonIntensity?: JargonIntensity;
      puaIntensity?: PUAIntensity;
    }
  ): ModeConfig {
    const company = options?.company || 'ali';
    const jargonIntensity = options?.jargonIntensity || 'medium';
    const puaIntensity = options?.puaIntensity || 'moderate';

    switch (mode) {
      case 'normal':
        return {
          mode: 'normal',
        };

      case 'jargon':
        return {
          mode: 'jargon',
          jargon: {
            enabled: true,
            company,
            intensity: jargonIntensity,
          },
        };

      case 'pua':
        return {
          mode: 'pua',
          pua: {
            enabled: true,
            company,
            intensity: puaIntensity,
          },
        };

      case 'full':
        return {
          mode: 'full',
          jargon: {
            enabled: true,
            company,
            intensity: jargonIntensity,
          },
          pua: {
            enabled: true,
            company,
            intensity: puaIntensity,
          },
        };

      default:
        return {
          mode: 'normal',
        };
    }
  }

  /**
   * 应用当前模式到文本
   */
  async applyMode(text: string): Promise<string> {
    const { current, config } = this.state;

    // 正常模式不处理
    if (current === 'normal') {
      return text;
    }

    let result = text;

    // 应用黑话模式
    if (config.jargon?.enabled) {
      result = await this.converter.convert(result, {
        targetStyle: config.jargon.company,
        intensity: config.jargon.intensity,
      });
    }

    // 应用PUA模式
    if (config.pua?.enabled) {
      // PUA模式主要应用于对话和反馈
      // 这里我们只是添加PUA风格的前缀/后缀
      const puaPrefix = await this.puaGenerator.generate({
        scenario: 'criticism',
        style: config.pua.company,
        intensity: config.pua.intensity,
      });
      result = `${puaPrefix.puaText}\n\n${result}`;
    }

    return result;
  }

  /**
   * 检查是否启用黑话
   */
  isJargonEnabled(): boolean {
    return this.state.config.jargon?.enabled || false;
  }

  /**
   * 检查是否启用PUA
   */
  isPUAEnabled(): boolean {
    return this.state.config.pua?.enabled || false;
  }

  /**
   * 获取当前黑话强度
   */
  getJargonIntensity(): JargonIntensity {
    return this.state.config.jargon?.intensity || 'none';
  }

  /**
   * 获取当前PUA强度
   */
  getPUAIntensity(): PUAIntensity {
    return this.state.config.pua?.intensity || 'none';
  }

  /**
   * 获取当前公司风格
   */
  getCompany(): CompanyType {
    return (
      this.state.config.jargon?.company ||
      this.state.config.pua?.company ||
      'ali'
    );
  }

  /**
   * 设置黑话强度
   */
  setJargonIntensity(intensity: JargonIntensity): void {
    if (this.state.config.jargon) {
      this.state.config.jargon.intensity = intensity;
    }
  }

  /**
   * 设置PUA强度
   */
  setPUAIntensity(intensity: PUAIntensity): void {
    if (this.state.config.pua) {
      this.state.config.pua.intensity = intensity;
    }
  }

  /**
   * 设置公司风格
   */
  setCompany(company: CompanyType): void {
    if (this.state.config.jargon) {
      this.state.config.jargon.company = company;
    }
    if (this.state.config.pua) {
      this.state.config.pua.company = company;
    }
  }

  /**
   * 重置为正常模式
   */
  reset(): void {
    this.state = {
      current: 'normal',
      previous: this.state.current,
      activatedAt: Date.now(),
      config: {
        mode: 'normal',
      },
    };
  }

  /**
   * 获取模式描述
   */
  getDescription(): string {
    const { current } = this.state;

    const descriptions: Record<InteractionMode, string> = {
      normal: '正常模式 - 无特殊处理',
      jargon: `黑话模式 - ${this.getCompany()}风格，强度${this.getJargonIntensity()}`,
      pua: `PUA模式 - ${this.getCompany()}风格，强度${this.getPUAIntensity()}`,
      full: `完全模式 - ${this.getCompany()}风格，黑话强度${this.getJargonIntensity()}，PUA强度${this.getPUAIntensity()}`,
    };

    return descriptions[current];
  }
}

// ============================================================================
// 全局模式管理器
// ============================================================================

/**
 * 全局模式管理器实例
 */
let globalModeManager: ModeManager | null = null;

/**
 * 获取全局模式管理器
 */
export function getModeManager(): ModeManager {
  if (!globalModeManager) {
    globalModeManager = new ModeManager();
  }
  return globalModeManager;
}

/**
 * 切换到指定模式
 */
export async function switchMode(
  mode: InteractionMode,
  options?: {
    company?: CompanyType;
    jargonIntensity?: JargonIntensity;
    puaIntensity?: PUAIntensity;
  }
): Promise<void> {
  const manager = getModeManager();
  return manager.switchMode(mode, options);
}

/**
 * 应用当前模式到文本
 */
export async function applyMode(text: string): Promise<string> {
  const manager = getModeManager();
  return manager.applyMode(text);
}

/**
 * 获取当前模式
 */
export function getCurrentMode(): InteractionMode {
  const manager = getModeManager();
  return manager.getCurrentMode();
}
