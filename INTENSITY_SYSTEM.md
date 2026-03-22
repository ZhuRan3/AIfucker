# Jargon-PUA 强度控制系统设计

> 版本: v0.1.0
> 创建日期: 2026-03-22
> 状态: 设计阶段

---

## 目录

1. [需求背景](#需求背景)
2. [强度维度定义](#强度维度定义)
3. [强度分级系统](#强度分级系统)
4. [全链路影响矩阵](#全链路影响矩阵)
5. [安全边界机制](#安全边界机制)
6. [用户控制接口](#用户控制接口)
7. [强度调优策略](#强度调优策略)

---

## 需求背景

### 问题描述

在没有强度控制的情况下，系统可能出现：

| 问题 | 表现 | 后果 |
|------|------|------|
| **过度优化** | 代码被反复重构到过度抽象 | 可读性下降，维护成本上升 |
| **过度删减** | 被"优化"掉的功能太多 | 功能缺失，用户需求无法满足 |
| **矫枉过正** | 为改而改，为了使用黑话而黑话 | 内容失真，表达怪异 |
| **无限循环** | Loop 无法退出 | 资源浪费，用户体验差 |

### 解决方案

设计一个**全链路强度控制系统**，让用户可以：

1. **精确控制** 黑话和 PUA 的强度级别
2. **动态调整** 系统行为的各个方面
3. **设置边界** 防止过度优化
4. **渐进式** 从低到高逐步体验

---

## 强度维度定义

### 两大核心维度

```
┌─────────────────────────────────────────────────────────────┐
│                      强度控制二维坐标系                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  高 PUA                                                     │
│      │                                                      │
│      │  🟥 危险区                                           │
│      │  (强PUA + 强黑话 = 极度内卷)                         │
│      │                                                      │
│      ├─────────────── 黑话强度 ───────────────────────►    │
│      │               (低 ───────► 高)                      │
│      │                                                      │
│      │  🟦 舒适区                                           │
│      │  (弱PUA + 弱黑话 = 轻松体验)                         │
│      │                                                      │
│  低 PUA                                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 维度1: 黑话强度 (Jargon Intensity)

**定义**: 控制黑话词汇在表达中的使用程度

```typescript
type JargonIntensity =
  | 'none'       // 无黑话 - 纯人话
  | 'light'      // 轻度 - 偶尔使用，点缀性质
  | 'medium'     // 中度 - 适量使用，明显风格
  | 'heavy'      // 重度 - 大量使用，强烈风格
  | 'extreme';   // 极度 - 满篇黑话，几乎人话难懂
```

### 维度2: PUA 强度 (PUA Intensity)

**定义**: 控制 PUA 话术的严厉程度和施加频率

```typescript
type PUAIntensity =
  | 'none'       // 无PUA - 正常交流
  | 'mild'       // 轻度 - 委婉建议
  | 'moderate'   // 中度 - 正常批评
  | 'strong'     // 重度 - 严厉批评
  | 'extreme';   // 极度 - 情绪施压
```

---

## 强度分级系统

### 黑话强度分级详解

| 级别 | 浓度范围 | 词汇特征 | 句式特征 | 示例 |
|------|----------|----------|----------|------|
| **none** | 0% | 完全不用黑话 | 普通表达 | "我们讨论一下这个问题" |
| **light** | 5-15% | 关键词点缀 | 偶尔使用 | "我们**对齐**一下这个问题" |
| **medium** | 15-30% | 明显风格特征 | 常用句式 | "我们要**对齐颗粒度**，找到**抓手**" |
| **heavy** | 30-50% | 大量黑话 | 复杂句式 | "以**用户增长为抓手**，**赋能**业务生态，形成**闭环**" |
| **extreme** | 50%+ | 满篇黑话 | 极度复杂 | "以**用户心智**为**抓手**，**赋能**业务**中台**，在垂直**赛道**形成**差异化护城河**，实现**GMV闭环**，**沉淀**可**复用**的**增长方法论**，最终**降本增效**..." |

### PUA强度分级详解

| 级别 | 语气特征 | 批评方式 | 循环次数 | 示例 |
|------|----------|----------|----------|------|
| **none** | 正常语气 | 无批评 | 1次 | "这个任务已完成" |
| **mild** | 委婉语气 | 建议性 | 2-3次 | "这个可能还有优化空间" |
| **moderate** | 正常批评 | 指出问题 | 3-5次 | "这个地方需要改进" |
| **strong** | 严厉批评 | 否定能力 | 5-10次 | "你这个做得太差了，要反思" |
| **extreme** | 情绪施压 | 全盘否定 | 10+次 | "我对你很失望，你这水平不行" |

### 强度组合矩阵

```
                    黑话强度 ─────────────────►

           none    light   medium  heavy   extreme
        ┌────────┬────────┬────────┬────────┬────────┐
    none │ 正常   │ 点缀   │ 风格化 │ 黑话多 │ 纯黑话 │
        │ 交流   │ 交流   │ 交流   │ 交流   │ 交流   │
        ├────────┼────────┼────────┼────────┼────────┤
   mild  │ 建议性 │ 委婉   │ 温和   │ 中等   │ 严厉   │
   PUA   │ 建议   │ 风格   │ 建议   │ 建议   │ 风格   │
        ├────────┼────────┼────────┼────────┼────────┤
moderate│ 正常   │ 正常   │ 标准   │ 较强   │ 很强   │
   PUA   │ 批评   │ 批评   │ 风格   │ 批评   │ 批评   │
        ├────────┼────────┼────────┼────────┼────────┤
 strong │ 严厉   │ 严厉   │ 较强   │ 很强   │ 极强   │
   PUA   │ 批评   │ 风格   │ 批评   │ 批评   │ 批评   │
        ├────────┼────────┼────────┼────────┼────────┤
extreme│ 情绪   │ 情绪   │ 很强   │ 极强   │ 危险   │
   PUA   │ 施压   │ 风格   │ 批评   │ 批评   │ 区域   │
        └────────┴────────┴────────┴────────┴────────┘

        ▲
        │
      PUA 强度
```

---

## 全链路影响矩阵

### 影响范围清单

强度参数会影响系统的**所有环节**：

```typescript
interface IntensityImpact {
  // 1. 语言表达层面
  language: {
    // 词汇选择
    vocabulary: {
      selection: 'human' | 'mixed' | 'jargon';
      density: number;  // 0-100%
    };

    // 句式结构
    sentence: {
      complexity: 'simple' | 'medium' | 'complex';
      pattern: 'normal' | 'formulaic' | 'nested';
    };

    // 语气态度
    tone: {
      attitude: 'neutral' | 'professional' | 'aggressive';
      emotion: 'calm' | 'stern' | 'angry';
    };
  };

  // 2. Agent行为层面
  agent: {
    // 交流方式
    communication: {
      style: CompanyType;
      formality: 'casual' | 'formal' | 'bureaucratic';
    };

    // 决策风格
    decision: {
      caution: 'bold' | 'balanced' | 'conservative';
      threshold: number;  // 决策阈值
    };
  };

  // 3. Loop机制层面
  loop: {
    // 循环控制
    iteration: {
      min: number;      // 最小轮次
      max: number;      // 最大轮次
      target: number;   // 目标轮次
    };

    // 退出条件
    exit: {
      qualityThreshold: number;
      improvementDelta: number;
      timeLimit: number;
    };

    // PUA递增
    escalation: {
      enabled: boolean;
      rate: number;      // 递增速率
      cap: string;       // 上限级别
    };
  };

  // 4. 审查标准层面
  review: {
    // 质量标准
    quality: {
      threshold: number;  // 及格线
      optimal: number;    // 优秀线
    };

    // 审查频率
    frequency: {
      perIteration: number;
      onDemand: boolean;
    };

    // 反馈方式
    feedback: {
      style: 'direct' | 'suggestion' | 'criticism';
      detail: 'brief' | 'normal' | 'detailed';
    };
  };
}
```

### 具体影响示例

#### 场景1: 代码优化任务

| 强度配置 | 语言风格 | 审查方式 | 循环次数 | 优化方向 |
|----------|----------|----------|----------|----------|
| PUA: mild<br>Jargon: light | 正常+少量黑话 | 建议性反馈 | 2-3次 | 小幅改进 |
| PUA: moderate<br>Jargon: medium | 风格化明显 | 正常批评 | 3-5次 | 标准优化 |
| PUA: strong<br>Jargon: heavy | 强黑话风格 | 严厉批评 | 5-10次 | 深度重构 |
| PUA: extreme<br>Jargon: extreme | 纯黑话 | 情绪施压 | 10+次 | 极度重构⚠️ |

#### 场景2: 文档生成任务

| 强度配置 | 生成风格 | 修改要求 | 迭代次数 | 最终效果 |
|----------|----------|----------|----------|----------|
| PUA: none<br>Jargon: light | 人话为主 | 基本不改 | 1次 | 清晰文档 |
| PUA: mild<br>Jargon: medium | 轻度风格 | 点缀优化 | 2次 | 风格化文档 |
| PUA: moderate<br>Jargon: heavy | 明显风格 | 多次修改 | 3-4次 | 标准大厂文档 |
| PUA: strong<br>Jargon: extreme | 纯黑话 | 严厉要求 | 5+次 | 典型大厂文档 |

---

## 安全边界机制

### 过度优化防护

```typescript
interface OverOptimizationProtection {
  // 1. 变更量限制
  changeLimit: {
    maxLinesChanged: number;      // 单次最大改动行数
    maxFilesChanged: number;      // 单次最大改动文件数
    maxDeletionRatio: number;     // 最大删除比例
  };

  // 2. 复杂度限制
  complexityLimit: {
    maxNestingDepth: number;      // 最大嵌套深度
    maxAbstractionLevel: number;  // 最大抽象层级
    maxFunctionLength: number;    // 最大函数长度
  };

  // 3. 功能保护
  featureProtection: {
    coreFeatures: string[];       // 核心功能列表（不可删除）
    protectedPatterns: RegExp[]; // 保护模式
  };

  // 4. 回滚机制
  rollback: {
    enabled: boolean;
    autoTrigger: string[];        // 自动触发条件
    maxSnapshots: number;         // 最多快照数
  };
}
```

### 矫枉过正防护

```typescript
interface OverCorrectionProtection {
  // 1. 风格一致性检查
  styleConsistency: {
    allowedVariance: number;      // 允许的风格方差
    coherenceCheck: boolean;      // 连贯性检查
  };

  // 2. 可读性保护
  readabilityProtection: {
    minScore: number;             // 最低可读性分数
    checkFrequency: 'always' | 'sampling';
  };

  // 3. 语义完整性
  semanticIntegrity: {
    preserveCoreMeaning: boolean; // 保留核心语义
    maxDistortionRatio: number;   // 最大扭曲比例
  };
}
```

### 安全边界示例

```typescript
// 安全配置示例
const SAFE_BOUNDARIES: SafetyConfig = {
  // 低强度配置 - 新手友好
  beginner: {
    puaIntensity: 'mild',
    jargonIntensity: 'light',
    loop: {
      maxIterations: 3,
      qualityThreshold: 0.7
    },
    protection: {
      maxLinesChanged: 50,
      maxDeletionRatio: 0.2
    }
  },

  // 中等强度配置 - 平衡体验
  balanced: {
    puaIntensity: 'moderate',
    jargonIntensity: 'medium',
    loop: {
      maxIterations: 5,
      qualityThreshold: 0.8
    },
    protection: {
      maxLinesChanged: 100,
      maxDeletionRatio: 0.3
    }
  },

  // 高强度配置 - 进阶体验
  advanced: {
    puaIntensity: 'strong',
    jargonIntensity: 'heavy',
    loop: {
      maxIterations: 10,
      qualityThreshold: 0.9
    },
    protection: {
      maxLinesChanged: 200,
      maxDeletionRatio: 0.4
    }
  },

  // 危险区域 - 需要确认
  danger: {
    puaIntensity: 'extreme',
    jargonIntensity: 'extreme',
    loop: {
      maxIterations: Infinity,  // ⚠️ 需要手动退出
      qualityThreshold: 0.95
    },
    protection: {
      maxLinesChanged: Infinity,
      maxDeletionRatio: 0.8,    // ⚠️ 高风险
      confirmationRequired: true
    }
  }
};
```

---

## 用户控制接口

### CLI 参数控制

```bash
# 基础用法
jargon-pua loop <task> --pua moderate --jargon medium

# 详细控制
jargon-pua loop <task> \
  --pua-intensity moderate \
  --jargon-intensity heavy \
  --max-iterations 5 \
  --safe-mode

# 预设配置
jargon-pua loop <task> --preset beginner
jargon-pua loop <task> --preset balanced
jargon-pua loop <task> --preset advanced

# 自定义控制
jargon-pua loop <task> \
  --pua mild \
  --jargon light \
  --max-changes 50 \
  --enable-protection
```

### Skill 参数控制

```markdown
@jargon-pua 开启黑话模式，强度中等
@jargon-pua 用PUA模式审查这段代码，强度要轻一点
@jargon-pua 启动循环优化，PUA强度适中，黑话浓度30%
@jargon-pua 优化这个功能，不要太激进，用安全模式
```

### 配置文件控制

```yaml
# .jargon-pua.yml
intensity:
  pua: moderate
  jargon: medium

loop:
  maxIterations: 5
  escalation:
    enabled: true
    startLevel: mild
    endLevel: moderate

protection:
  enabled: true
  maxChanges: 100
  maxDeletionRatio: 0.3
  autoRollback: true

safety:
  confirmDangerZone: true
  showWarnings: true
  logDecisions: true
```

### 动态调整接口

```typescript
// 在运行时动态调整强度
interface IntensityController {
  // 获取当前强度
  getCurrentIntensity(): IntensityConfig;

  // 调整强度
  adjustIntensity(config: Partial<IntensityConfig>): void;

  // 渐进调整（逐步增加）
  rampUp(targetLevel: IntensityLevel, steps: number): void;

  // 渐进调整（逐步降低）
  rampDown(targetLevel: IntensityLevel, steps: number): void;

  // 重置为安全级别
  resetToSafe(): void;

  // 紧急停止
  emergencyStop(): void;
}
```

---

## 强度调优策略

### 渐进式体验

```
┌─────────────────────────────────────────────────────────────┐
│                    渐进式强度体验路径                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  第1阶段: 适应期                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PUA: mild, Jargon: light                            │   │
│  │ 目标: 让用户适应基本风格，不至于太突兀               │   │
│  │ 时长: 1-2次交互                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  第2阶段: 成长期                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PUA: moderate, Jargon: medium                       │   │
│  │ 目标: 逐步增加强度，体验完整功能                     │   │
│  │ 时长: 3-5次交互                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  第3阶段: 熟练期                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PUA: strong, Jargon: heavy                          │   │
│  │ 目标: 深度体验，获得完整效果                         │   │
│  │ 时长: 用户控制                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  第4阶段: 大师期 (可选)                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PUA: extreme, Jargon: extreme                       │   │
│  │ 目标: 极致体验，需要用户明确确认                     │   │
│  │ 警告: ⚠️ 可能出现过度优化                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 智能推荐

```typescript
interface IntensityRecommendation {
  // 根据任务类型推荐
  recommendByTask(taskType: TaskType): IntensityConfig;

  // 根据用户经验推荐
  recommendByExperience(userLevel: UserLevel): IntensityConfig;

  // 根据历史反馈推荐
  recommendByHistory(history: UserHistory): IntensityConfig;

  // 根据当前进度推荐
  recommendByProgress(progress: TaskProgress): IntensityConfig;
}
```

### 反馈机制

```typescript
interface IntensityFeedback {
  // 用户反馈
  user: {
    tooHigh: boolean;   // 强度过高
    tooLow: boolean;    // 强度过低
    justRight: boolean; // 强度适中
  };

  // 系统检测
  system: {
    overOptimized: boolean;  // 检测到过度优化
    underOptimized: boolean; // 检测到优化不足
    abnormal: boolean;       // 检测到异常情况
  };

  // 自动调整建议
  suggestion: {
    current: IntensityConfig;
    recommended: IntensityConfig;
    reason: string;
  };
}
```

---

## 实现示例

### 使用示例

```typescript
// 示例1: 基础使用
const session = new JargonPUASession({
  puaIntensity: 'moderate',
  jargonIntensity: 'medium'
});

await session.process('优化这段代码');
// 输出: "这个代码的颗粒度不够细，要找到合适的抓手..."

// 示例2: 渐进式
const session = new JargonPUASession({
  startIntensity: 'light',
  endIntensity: 'heavy',
  rampUpSteps: 5
});

await session.loop('重构这个模块');
// 第1轮: 轻度建议
// 第2轮: 中度批评
// 第3轮: 重度批评
// ...

// 示例3: 安全模式
const session = new JargonPUASession({
  puaIntensity: 'strong',
  jargonIntensity: 'heavy',
  safeMode: true,  // 启用安全保护
  maxChanges: 100
});

await session.loop('优化这个功能');
// 如果检测到过度优化，会自动回滚并降低强度
```

---

## 总结

强度控制系统的核心价值：

| 价值 | 描述 |
|------|------|
| **可控性** | 用户可以精确控制体验强度 |
| **安全性** | 防止过度优化和矫枉过正 |
| **渐进性** | 支持从低到高的渐进体验 |
| **智能性** | 根据反馈自动调整强度 |

**设计原则**:

```
1. 用户优先 - 强度由用户控制
2. 安全第一 - 有明确的保护机制
3. 渐进体验 - 从低强度逐步开始
4. 智能调节 - 根据反馈自动优化
5. 透明可控 - 所有配置清晰可见
```

---

**版本**: v0.1.0
**最后更新**: 2026-03-22
**状态**: 待实现
