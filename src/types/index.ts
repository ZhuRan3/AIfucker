/**
 * Jargon-PUA 核心类型定义
 *
 * @description
 * 本文件定义了整个项目的核心类型系统。
 * 严格的类型定义赋能开发，形成类型安全闭环。
 */

// ============================================================================
// 公司类型
// ============================================================================

/**
 * 支持的大厂类型
 */
export type CompanyType =
  | 'ali' // 阿里巴巴 - 赋能闭环沉淀
  | 'tencent' // 腾讯 - 赛道赛马数据
  | 'bytedance' // 字节跳动 - Doc Double OKR
  | 'meituan' // 美团 - 长期耐心 ROI
  | 'huawei' // 华为 - 奋斗战役胶片
  | 'baidu' // 百度 - 结果简单依赖
  | 'netease'; // 网易 - 态度匠心品质

/**
 * 所有公司类型列表
 */
export const ALL_COMPANIES: CompanyType[] = [
  'ali',
  'tencent',
  'bytedance',
  'meituan',
  'huawei',
  'baidu',
  'netease',
];

// ============================================================================
// 交互模式类型
// ============================================================================

/**
 * 交互模式
 *
 * @description
 * 控制AI与用户、AI与AI之间的交流方式
 */
export type InteractionMode = 'normal' | 'jargon' | 'pua' | 'full';

// ============================================================================
// 强度类型
// ============================================================================

/**
 * PUA强度
 */
export type PUAIntensity = 'none' | 'mild' | 'moderate' | 'strong' | 'extreme';

/**
 * 黑话强度
 */
export type JargonIntensity = 'none' | 'light' | 'medium' | 'heavy' | 'extreme';

/**
 * 通用强度级别
 */
export type IntensityLevel = 'none' | 'light' | 'mild' | 'medium' | 'moderate' | 'strong' | 'heavy' | 'extreme';

// ============================================================================
// LLM 相关类型
// ============================================================================

/**
 * LLM 提供商类型
 */
export type LLMProvider = 'claude' | 'openai' | 'custom';

/**
 * LLM 配置
 */
export interface LLMConfig {
  provider: LLMProvider;
  model?: string;
  apiKey?: string;
  baseURL?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * LLM 响应
 */
export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
}

// ============================================================================
// 风格分析类型
// ============================================================================

/**
 * 风格识别配置
 */
export interface StyleRecognitionConfig {
  detailed?: boolean; // 是否返回详细分析
  threshold?: number; // 置信度阈值 0-1
}

/**
 * 风格识别结果
 */
export interface StyleRecognitionResult {
  company: CompanyType | 'unknown';
  confidence: number; // 0-1
  analysis?: {
    keywords: string[]; // 检测到的关键词
    density: number; // 黑话浓度 0-100
    tone: string; // 语气分析
    patterns: string[]; // 句式模式
  };
}

/**
 * 风格转换配置
 */
export interface StyleConversionConfig {
  preserveMeaning?: boolean; // 保留原始语义
  intensity?: JargonIntensity; // 黑话强度
}

/**
 * 风格转换结果
 */
export interface StyleConversionResult {
  convertedText: string;
  changes: {
    original: string;
    converted: string;
    type: 'keyword' | 'structure' | 'tone';
  }[];
  statistics: {
    originalDensity: number;
    convertedDensity: number;
    changeRate: number;
  };
}

// ============================================================================
// PUA 相关类型
// ============================================================================

/**
 * PUA 场景类型
 */
export type PUAScenario =
  | 'criticism' // 批评
  | 'motivation' // 激励
  | 'rejection' // 拒绝
  | 'overtime' // 加班要求
  | 'salary_refuse' // 拒绝涨薪
  | 'blame' // 甩锅
  | 'praise' // 表扬（反向PUA）
  | 'custom'; // 自定义

/**
 * PUA 生成配置
 */
export interface PUAGenerationConfig {
  scenario: PUAScenario;
  style: CompanyType;
  intensity: PUAIntensity;
  target?: string; // 对象描述
}

/**
 * PUA 生成结果
 */
export interface PUAGenerationResult {
  puaText: string;
  formula: string; // 使用的PUA公式
  elements: {
    type: string;
    content: string;
  }[];
  warning?: string; // 内容警告
}

// ============================================================================
// 黑话检测类型
// ============================================================================

/**
 * 黑话检测模式
 */
export type DensityCheckMode = 'overall' | 'by_category' | 'detailed';

/**
 * 黑话检测结果
 */
export interface DensityCheckResult {
  overall: {
    score: number; // 0-100
    level: 'low' | 'medium' | 'high' | 'extreme';
  };
  byCategory?: {
    category: string;
    count: number;
    percentage: number;
  }[];
  details?: {
    word: string;
    category: string;
    position: number;
  }[];
  suggestions?: string[]; // 优化建议
}

// ============================================================================
// Agent 相关类型
// ============================================================================

/**
 * Agent 类型
 */
export type AgentType =
  | 'general' // 总包Agent
  | 'company' // 分厂Agent
  | 'specialist' // 分包Agent
  | 'reviewer'; // 审查Agent

/**
 * Agent 状态
 */
export type AgentStatus = 'idle' | 'working' | 'waiting' | 'done' | 'failed';

/**
 * Agent 消息类型
 */
export type AgentMessageType =
  | 'task' // 任务分配
  | 'result' // 结果返回
  | 'query' // 询问
  | 'response' // 回应
  | 'review' // 审查
  | 'broadcast'; // 广播

/**
 * Agent 消息
 */
export interface AgentMessage {
  id: string;
  from: string; // 发送者Agent ID
  to: string | 'all'; // 接收者Agent ID
  type: AgentMessageType;
  payload: unknown;
  timestamp: number;
  style?: CompanyType; // 消息风格
}

/**
 * Agent 配置
 */
export interface AgentConfig {
  id: string;
  type: AgentType;
  company?: CompanyType; // 分厂Agent需要指定公司
  name: string;
  description: string;
}

// ============================================================================
// Loop 相关类型
// ============================================================================

/**
 * Loop 阶段
 */
export type LoopStage =
  | 'assignment' // 任务分配
  | 'racing' // 赛马执行
  | 'review' // PUA审查
  | 'rework' // 重新执行
  | 'review_meeting' // 复盘沉淀
  | 'decision' // 判断是否继续
  | 'completed'; // 已完成

/**
 * Loop 配置
 */
export interface LoopConfig {
  // 最大循环次数
  maxIterations?: number;

  // PUA强度递增
  increasePUAIntensity?: boolean;

  // 审查Agent轮换
  rotateReviewer?: boolean;

  // 每轮输出日志
  logEachIteration?: boolean;

  // 对齐阈值（黑话浓度达标才允许退出）
  alignmentThreshold?: number;

  // 强度控制
  puaIntensity?: PUAIntensity;
  jargonIntensity?: JargonIntensity;

  // 强制退出条件
  forceExitConditions?: {
    timeLimit?: number; // 时间限制（毫秒）
    noImprovementRounds?: number; // 连续无改进轮数
    costLimit?: number; // 成本限制（token数）
  };

  // 安全保护
  safety?: {
    enabled?: boolean;
    maxChanges?: number;
    maxDeletionRatio?: number;
    autoRollback?: boolean;
  };
}

/**
 * Loop 状态
 */
export interface LoopState {
  currentIteration: number;
  currentStage: LoopStage;
  startTime: number;
  elapsedTime: number;
  results: {
    iteration: number;
    stage: LoopStage;
    output: unknown;
    quality: number;
  }[];
  puaIntensity: PUAIntensity;
  jargonIntensity: JargonIntensity;
}

/**
 * Loop 结果
 */
export interface LoopResult {
  success: boolean;
  totalIterations: number;
  elapsedTime: number;
  finalOutput: unknown;
  quality: number;
  history: LoopState;
  exitReason?: string;
}

// ============================================================================
// 配置相关类型
// ============================================================================

/**
 * 全局配置
 */
export interface GlobalConfig {
  // LLM 配置
  llm: LLMConfig;

  // 交互模式
  mode: InteractionMode;

  // 强度配置
  intensity: {
    pua: PUAIntensity;
    jargon: JargonIntensity;
  };

  // Loop 默认配置
  loop: LoopConfig;

  // 安全配置
  safety: {
    enabled: boolean;
    maxChanges: number;
    maxDeletionRatio: number;
    confirmDangerZone: boolean;
  };

  // 日志配置
  logging: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
    saveToFile: boolean;
  };
}

// ============================================================================
// 预设配置类型
// ============================================================================

/**
 * 预设配置类型
 */
export type PresetType = 'beginner' | 'balanced' | 'advanced' | 'danger';

/**
 * 预设配置
 */
export interface PresetConfig {
  name: string;
  description: string;
  config: Partial<GlobalConfig>;
}

// ============================================================================
// 错误类型
// ============================================================================

/**
 * Jargon-PUA 错误基类
 */
export class JargonPUAError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'JargonPUAError';
  }
}

/**
 * LLM 调用错误
 */
export class LLMError extends JargonPUAError {
  constructor(message: string, details?: unknown) {
    super(message, 'LLM_ERROR', details);
    this.name = 'LLMError';
  }
}

/**
 * 强度超出范围错误
 */
export class IntensityError extends JargonPUAError {
  constructor(message: string, details?: unknown) {
    super(message, 'INTENSITY_ERROR', details);
    this.name = 'IntensityError';
  }
}

/**
 * 安全限制触发错误
 */
export class SafetyLimitError extends JargonPUAError {
  constructor(message: string, details?: unknown) {
    super(message, 'SAFETY_LIMIT', details);
    this.name = 'SafetyLimitError';
  }
}

// ============================================================================
// CLI 相关类型
// ============================================================================

/**
 * CLI 命令类型
 */
export type CLICommand =
  | 'mode'
  | 'analyze'
  | 'convert'
  | 'pua'
  | 'check'
  | 'loop'
  | 'agent'
  | 'config'
  | 'version'
  | 'help';

/**
 * CLI 选项
 */
export interface CLIOptions {
  verbose?: boolean;
  config?: string;
  output?: string;
  force?: boolean;
}

// ============================================================================
// 工具类型
// ============================================================================

/**
 * 深度只读
 */
export type DeepReadOnly<T> = {
  readonly [P in keyof T]: DeepReadOnly<T[P]>;
};

/**
 * 可选包装
 */
export type Maybe<T> = T | null | undefined;

/**
 * 异步结果
 */
export type AsyncResult<T, E = Error> = Promise<[E, null] | [null, T]>;
