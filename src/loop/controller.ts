/**
 * Loop 控制器
 *
 * @description
 * 实现内卷循环机制，持续PUA和优化。
 * Loop赋能迭代，形成内卷闭环。
 */

import type {
  LoopConfig,
  LoopState,
  LoopResult,
  LoopStage,
  PUAIntensity,
  JargonIntensity,
  CompanyType,
  AgentManager,
  LLMConfig,
} from '../types/index.js';
import { createDefaultAgentManager } from '../agents/manager.js';
import { generate } from '../llm/adapter.js';

// ============================================================================
// Loop 控制器
// ============================================================================

/**
 * Loop 控制器类
 */
export class LoopController {
  private config: LoopConfig;
  private state: LoopState;
  private agentManager: AgentManager;
  private llmConfig: LLMConfig;
  private isRunning: boolean = false;
  private currentTask: string = '';

  constructor(config: LoopConfig, llmConfig: LLMConfig) {
    this.config = this.mergeWithDefaults(config);
    this.llmConfig = llmConfig;
    this.agentManager = createDefaultAgentManager(llmConfig);
    this.state = this.initializeState();
  }

  /**
   * 启动 Loop
   */
  async start(task: string): Promise<LoopResult> {
    if (this.isRunning) {
      throw new Error('Loop is already running');
    }

    this.isRunning = true;
    this.currentTask = task;
    this.state = this.initializeState();
    this.state.startTime = Date.now();

    try {
      return await this.runLoop();
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * 停止 Loop
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * 运行 Loop
   */
  private async runLoop(): Promise<LoopResult> {
    let currentIteration = 0;
    let previousQuality = 0;
    let noImprovementCount = 0;

    while (this.isRunning) {
      currentIteration++;
      this.state.currentIteration = currentIteration;

      // 检查退出条件
      if (this.shouldExit(currentIteration, previousQuality, noImprovementCount)) {
        break;
      }

      // 执行一轮循环
      const stageResult = await this.runIteration(currentIteration);
      this.state.results.push(stageResult);

      // 更新质量
      const currentQuality = stageResult.quality;
      if (currentQuality <= previousQuality) {
        noImprovementCount++;
      } else {
        noImprovementCount = 0;
      }
      previousQuality = currentQuality;

      // 更新强度（如果启用递增）
      if (this.config.increasePUAIntensity) {
        this.updateIntensities(currentIteration);
      }

      // 更新已用时间
      this.state.elapsedTime = Date.now() - this.state.startTime;
    }

    return this.buildResult(noImprovementCount);
  }

  /**
   * 运行单次迭代
   */
  private async runIteration(iteration: number): Promise<{
    stage: LoopStage;
    output: unknown;
    quality: number;
  }> {
    // 阶段1：任务分配
    this.state.currentStage = 'assignment';
    const generalAgent = this.agentManager.getById('general');
    if (!generalAgent) {
      throw new Error('General agent not found');
    }

    const taskMessage = await this.agentManager.startCommunication(
      'general',
      'all',
      {
        type: 'loop-task',
        iteration,
        task: this.currentTask,
        puaIntensity: this.state.puaIntensity,
        jargonIntensity: this.state.jargonIntensity,
      }
    );

    // 阶段2：赛马执行
    this.state.currentStage = 'racing';
    const companyAgents = this.agentManager.getByType('company');
    const racingResults = await Promise.all(
      companyAgents.map(async (agent) => {
        const response = await this.agentManager.startCommunication(
          agent.getId(),
          'general',
          taskMessage.payload
        );
        return {
          agent: agent.getId(),
          output: response.payload,
        };
      })
    );

    // 选择最优结果
    const bestResult = this.selectBestResult(racingResults);

    // 阶段3：PUA审查
    this.state.currentStage = 'review';
    const reviewResult = await this.runReview(bestResult);

    // 阶段4：记录状态
    this.state.currentStage = 'decision';
    const quality = this.assessQuality(bestResult, reviewResult);

    return {
      stage: this.state.currentStage,
      output: bestResult,
      quality,
    };
  }

  /**
   * 运行审查
   */
  private async runReview(work: unknown): Promise<unknown> {
    const puaReviewer = this.agentManager.getById('pua-reviewer');
    const qualityReviewer = this.agentManager.getById('quality-reviewer');
    const jargonReviewer = this.agentManager.getById('jargon-reviewer');

    const reviews = await Promise.all([
      puaReviewer
        ? this.agentManager.startCommunication('pua-reviewer', 'general', work)
        : Promise.resolve(null),
      qualityReviewer
        ? this.agentManager.startCommunication('quality-reviewer', 'general', work)
        : Promise.resolve(null),
      jargonReviewer
        ? this.agentManager.startCommunication('jargon-reviewer', 'general', work)
        : Promise.resolve(null),
    ]);

    return {
      pua: reviews[0]?.payload,
      quality: reviews[1]?.payload,
      jargon: reviews[2]?.payload,
    };
  }

  /**
   * 选择最优结果
   */
  private selectBestResult(results: { agent: string; output: unknown }[]): unknown {
    // 简化版：随机选择一个
    // 实际实现可以根据质量评分选择
    return results[Math.floor(Math.random() * results.length)]?.output;
  }

  /**
   * 评估质量
   */
  private assessQuality(work: unknown, review: unknown): number {
    // 简化版：返回随机分数
    // 实际实现可以根据审查结果计算
    return 70 + Math.random() * 30;
  }

  /**
   * 检查是否应该退出
   */
  private shouldExit(
    iteration: number,
    quality: number,
    noImprovementCount: number
  ): boolean {
    // 检查最大迭代次数
    if (this.config.maxIterations && iteration >= this.config.maxIterations) {
      this.state.exitReason = 'max-iterations';
      return true;
    }

    // 检查时间限制
    if (this.config.forceExitConditions?.timeLimit) {
      const elapsed = Date.now() - this.state.startTime;
      if (elapsed >= this.config.forceExitConditions.timeLimit) {
        this.state.exitReason = 'time-limit';
        return true;
      }
    }

    // 检查连续无改进次数
    if (
      this.config.forceExitConditions?.noImprovementRounds &&
      noImprovementCount >= this.config.forceExitConditions.noImprovementRounds
    ) {
      this.state.exitReason = 'no-improvement';
      return true;
    }

    // 检查质量阈值
    if (this.config.alignmentThreshold && quality >= this.config.alignmentThreshold) {
      this.state.exitReason = 'quality-threshold';
      return true;
    }

    return false;
  }

  /**
   * 更新强度
   */
  private updateIntensities(iteration: number): void {
    const intensities: (PUAIntensity | JargonIntensity)[] = [
      'mild',
      'moderate',
      'strong',
      'extreme',
    ];

    const currentIndex = intensities.indexOf(this.state.puaIntensity);
    if (currentIndex < intensities.length - 1) {
      this.state.puaIntensity = intensities[currentIndex + 1] as PUAIntensity;
    }

    const jargonIndex = intensities.indexOf(this.state.jargonIntensity);
    if (jargonIndex < intensities.length - 1) {
      this.state.jargonIntensity = intensities[jargonIndex + 1] as JargonIntensity;
    }
  }

  /**
   * 构建结果
   */
  private buildResult(noImprovementCount: number): LoopResult {
    const finalResult = this.state.results[this.state.results.length - 1];

    return {
      success: this.state.exitReason !== 'no-improvement',
      totalIterations: this.state.currentIteration,
      elapsedTime: this.state.elapsedTime,
      finalOutput: finalResult?.output,
      quality: finalResult?.quality || 0,
      history: this.state,
      exitReason: this.state.exitReason,
    };
  }

  /**
   * 初始化状态
   */
  private initializeState(): LoopState {
    return {
      currentIteration: 0,
      currentStage: 'assignment',
      startTime: Date.now(),
      elapsedTime: 0,
      results: [],
      puaIntensity: this.config.puaIntensity || 'moderate',
      jargonIntensity: this.config.jargonIntensity || 'medium',
    };
  }

  /**
   * 合并默认配置
   */
  private mergeWithDefaults(config: LoopConfig): LoopConfig {
    return {
      maxIterations: 5,
      increasePUAIntensity: true,
      rotateReviewer: true,
      logEachIteration: true,
      alignmentThreshold: 90,
      puaIntensity: 'moderate',
      jargonIntensity: 'medium',
      safety: {
        enabled: true,
        maxChanges: 100,
        maxDeletionRatio: 0.3,
      },
      ...config,
    };
  }

  /**
   * 获取当前状态
   */
  getState(): LoopState {
    return { ...this.state };
  }

  /**
   * 获取配置
   */
  getConfig(): LoopConfig {
    return { ...this.config };
  }
}

// ============================================================================
// 工厂函数
// ============================================================================

/**
 * 创建 Loop 控制器
 */
export function createLoopController(
  config: LoopConfig,
  llmConfig: LLMConfig
): LoopController {
  return new LoopController(config, llmConfig);
}
