# Jargon-PUA 需求规格文档

> 版本: v0.1.0
> 创建日期: 2026-03-22
> 状态: 需求分析阶段
> 优先级定义: P0-必须有 | P1-应该有 | P2-可以有

---

## 目录

1. [项目背景](#项目背景)
2. [目标用户](#目标用户)
3. [核心功能需求](#核心功能需求)
4. [交互模式需求](#交互模式需求)
5. [Agent系统需求](#agent系统需求)
6. [Loop机制需求](#loop机制需求)
7. [非功能需求](#非功能需求)
8. [用户故事](#用户故事)
9. [验收标准](#验收标准)
10. [约束与假设](#约束与假设)

---

## 项目背景

### 问题陈述

当代互联网大厂形成了一套独特的语言文化体系：
- **黑话体系**：赋能、抓手、闭环、颗粒度等词汇的泛滥使用
- **PUA文化**：精神操控、情感绑架、自我洗脑等管理手段

这些现象既反映了职场生态，也成为了值得研究和反思的社会现象。

### 项目定位

Jargon-PUA 不是一个普通的工具项目，而是一个：
1. **综合研究平台** - 研究、分析、生成、应用一体化
2. **新交互范式** - 探索人机交流的可能性边界
3. **反讽艺术作品** - 通过模仿来揭示问题

---

## 目标用户

### 主要用户群体

| 用户类型 | 描述 | 核心需求 |
|----------|------|----------|
| **开发者** | 需要与AI协作开发的程序员 | 提高AI协作效率，探索新交互方式 |
| **研究者** | 职场文化、语言文化研究者 | 获取结构化数据，分析文化现象 |
| **内容创作者** | 需要生成特定风格内容 | 快速生成大厂风格文本 |
| **讽刺艺术家** | 通过技术手段进行社会批判 | 创作反讽内容 |

### 使用场景

```
场景1: 开发协作
用户: 用黑话模式启动项目
AI: "收到，我们要拉齐颗粒度，赋能开发闭环..."

场景2: 内容生成
用户: 生成一份阿里风格的周报
AI: "本周以XX为抓手，赋能XX业务，形成XX闭环..."

场景3: 风格研究
用户: 分析这段话属于哪个大厂风格
AI: "检测到'赋能''抓手''闭环'，判定为阿里风格，置信度95%"

场景4: 内卷模拟
用户: 用Loop机制优化这段代码
AI: (开始无限循环的PUA和优化...)
```

---

## 核心功能需求

### F1: 风格识别 (P0)

**需求描述**: 识别输入文本所属的大厂风格

**输入**:
```typescript
interface StyleRecognitionInput {
  text: string;
  options?: {
    detailed?: boolean;  // 是否返回详细分析
    threshold?: number;  // 置信度阈值
  };
}
```

**输出**:
```typescript
interface StyleRecognitionOutput {
  company: CompanyType;
  confidence: number;    // 0-1
  analysis?: {
    keywords: string[];  // 检测到的关键词
    density: number;     // 黑话浓度
    tone: string;        // 语气分析
    patterns: string[];  // 句式模式
  };
}

type CompanyType =
  | 'ali'      // 阿里巴巴
  | 'tencent'  // 腾讯
  | 'bytedance'// 字节跳动
  | 'meituan'  // 美团
  | 'huawei'   // 华为
  | 'baidu'    // 百度
  | 'netease'  // 网易
  | 'unknown'; // 未知
```

**验收标准**:
- [ ] 7家大厂风格识别准确率 ≥ 90%
- [ ] 响应时间 ≤ 2秒
- [ ] 支持中英文混合输入
- [ ] 能处理至少5000字的长文本

---

### F2: 风格转换 (P0)

**需求描述**: 将文本从一种风格转换为另一种风格

**输入**:
```typescript
interface StyleConversionInput {
  text: string;
  targetStyle: CompanyType;
  sourceStyle?: CompanyType;  // 可选，自动识别
  options?: {
    preserveMeaning?: boolean;  // 保留原始语义
    intensity?: 'light' | 'medium' | 'heavy';  // 转换强度
  };
}
```

**输出**:
```typescript
interface StyleConversionOutput {
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
```

**验收标准**:
- [ ] 语义保留率 ≥ 85%
- [ ] 风格符合度 ≥ 80%（人工评估）
- [ ] 支持任意两厂风格互转
- [ ] 转换时间 ≤ 5秒

---

### F3: PUA生成器 (P0)

**需求描述**: 根据场景和风格生成PUA话术

**输入**:
```typescript
interface PUAGenerationInput {
  scenario: PUAScenario;
  style: CompanyType;
  intensity: PUIntensity;
  target?: string;  // 对象描述（如"表现不好的员工"）
}

type PUAScenario =
  | 'criticism'        // 批评
  | 'motivation'       // 激励
  | 'rejection'        // 拒绝
  | 'overtime'         // 加班要求
  | 'salary_refuse'    // 拒绝涨薪
  | 'blame'            // 甩锅
  | 'custom';          // 自定义

type PUIntensity = 'weak' | 'medium' | 'strong' | 'extreme';
```

**输出**:
```typescript
interface PUAGenerationOutput {
  puaText: string;
  formula: string;     // 使用的PUA公式
  elements: {
    type: string;      // 元素类型
    content: string;   // 内容
  }[];
  warning?: string;    // 内容警告
}
```

**验收标准**:
- [ ] 至少支持6种常见PUA场景
- [ ] 支持4级强度调节
- [ ] 生成内容有明显的风格特征
- [ ] 包含适当的警告提示

---

### F4: 黑话浓度检测 (P1)

**需求描述**: 检测文本中的黑话浓度

**输入**:
```typescript
interface DensityCheckInput {
  text: string;
  mode?: 'overall' | 'by_category' | 'detailed';
}
```

**输出**:
```typescript
interface DensityCheckOutput {
  overall: {
    score: number;      // 0-100
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
  suggestions?: string[];  // 优化建议
}
```

**验收标准**:
- [ ] 能识别至少100个黑话词汇
- [ ] 分类准确率 ≥ 90%
- [ ] 提供优化建议
- [ ] 支持可视化展示（CLI模式下用图表）

---

### F5: 黑话嵌入器 (P1)

**需求描述**: 在普通文本中嵌入黑话词汇

**输入**:
```typescript
interface JargonEmbeddingInput {
  text: string;
  targetDensity: number;  // 目标浓度 0-100
  style: CompanyType;
  strategy?: 'replace' | 'insert' | 'mix';
}
```

**输出**:
```typescript
interface JargonEmbeddingOutput {
  embeddedText: string;
  actualDensity: number;
  replacements: {
    original: string;
    replacement: string;
    position: number;
  }[];
}
```

**验收标准**:
- [ ] 浓度控制误差 ≤ ±10%
- [ ] 保持文本可读性
- [ ] 替换词汇符合目标风格
- [ ] 支持撤销/重做

---

### F6: 黑话-人话翻译器 (P2)

**需求描述**: 黑话和人话互译

**输入**:
```typescript
interface TranslationInput {
  text: string;
  direction: 'jargon2human' | 'human2jargon';
  targetStyle?: CompanyType;
}
```

**输出**:
```typescript
interface TranslationOutput {
  translatedText: string;
  mapping: {
    original: string;
    translated: string;
    explanation?: string;
  }[];
}
```

**验收标准**:
- [ ] 双向翻译准确率 ≥ 80%
- [ ] 提供词汇对照表
- [ ] 保留原文语气和风格

---

## 交互模式需求

### M1: 模式切换系统 (P0)

**需求描述**: 支持在不同交流模式间切换

**模式定义**:

```typescript
enum InteractionMode {
  NORMAL = 'normal',      // 正常模式 - 无特殊处理
  JARGON = 'jargon',      // 黑话模式 - 所有交流使用黑话
  PUA = 'pua',            // PUA模式 - 所有交流使用PUA话术
  FULL = 'full'           // 完全模式 - 黑话+PUA混合
}
```

**切换效果**:

| 模式 | AI↔AI交流 | AI↔人交流 | 示例 |
|------|-----------|-----------|------|
| NORMAL | 正常语言 | 正常语言 | "这个任务需要..." |
| JARGON | 全黑话 | 全黑话 | "我们需要拉齐颗粒度..." |
| PUA | 全PUA | 全PUA | "我对你有一些失望..." |
| FULL | 黑话+PUA | 黑话+PUA | "其实，我对你赋能的抓手..." |

**验收标准**:
- [ ] 模式切换响应时间 < 100ms
- [ ] 模式状态持久化
- [ ] 支持快捷键切换
- [ ] 模式切换有明确提示

---

### M2: CLI交互界面 (P0)

**需求描述**: 提供命令行交互界面

**核心命令**:

```bash
# 模式切换
jargon-pua mode <normal|jargon|pua|full>

# 风格识别
jargon-pua analyze <file|text>

# 风格转换
jargon-pua convert <file|text> --to <company>

# PUA生成
jargon-pua pua <scenario> --style <company> --intensity <level>

# 黑话检测
jargon-pua check <file|text>

# Loop模式
jargon-pua loop <task> --config <config_file>

# Agent管理
jargon-pua agent list
jargon-pua agent spawn <type> --with <style>

# 配置管理
jargon-pua config set <key> <value>
jargon-pua config get <key>
```

**验收标准**:
- [ ] 所有核心命令可用
- [ ] 支持--help文档
- [ ] 输出有颜色高亮
- [ ] 进度条显示
- [ ] 错误提示清晰

---

### M3: Claude Skill集成 (P0)

**需求描述**: 作为Claude Code Skill无缝集成

**Skill定义**:

```markdown
# jargon-pua Skill

## 描述
大厂黑话和PUA话术生成与转换工具

## 使用方式

### 启动黑话模式
@jargon-pua 开启黑话模式

### 识别风格
@jargon-pua 识别这段话的风格：xxx

### 转换风格
@jargon-pua 把这段话转换成阿里风格：xxx

### 生成PUA话术
@jargon-pua 生成一段阿里风格的批评话术，强度中等

### 关闭模式
@jargon-pua 关闭当前模式
```

**验收标准**:
- [ ] Skill可通过@触发
- [ ] 支持自然语言指令
- [ ] 集成到Claude Code工作流
- [ ] 状态在会话中保持

---

## Agent系统需求

### A1: 多Agent组织架构 (P0)

**需求描述**: 实现总包-分包-审查的Agent组织架构

**架构层次**:

```
总包Agent (General Contractor)
    │
    ├── 赛马组 (Racing Group)
    │   ├── 阿里Agent
    │   ├── 腾讯Agent
    │   ├── 字节Agent
    │   ├── 美团Agent
    │   ├── 华为Agent
    │   ├── 百度Agent
    │   └── 网易Agent
    │
    ├── 分包组 (Specialist Group)
    │   ├── 识别Agent
    │   ├── 转换Agent
    │   ├── 生成Agent
    │   ├── 嵌入Agent
    │   └── 翻译Agent
    │
    └── 审查组 (Reviewer Group)
        ├── PUA审查Agent
        ├── 质量审查Agent
        └── 黑话审查Agent
```

**验收标准**:
- [ ] 每种Agent至少有一个实例
- [ ] Agent间可独立通信
- [ ] 支持Agent动态注册
- [ ] Agent状态可监控

---

### A2: 分厂Agent特性 (P0)

**需求描述**: 每个分厂Agent具有独特的语言风格

**风格配置**:

| 公司 | 黑话浓度 | PUA强度 | 核心词汇 | 典型句式 |
|------|----------|---------|----------|----------|
| 阿里 | ★★★★★ | 强 | 赋能、抓手、闭环 | "以A为抓手，赋能B，形成C闭环" |
| 腾讯 | ★★★☆☆ | 弱 | 赛道、赛马、数据 | "这个赛道需要赛马" |
| 字节 | ★★☆☆☆ | 弱 | Doc、Double、OKR | "在Doc上同步过了" |
| 美团 | ★★☆☆☆ | 中 | 长期、耐心、ROI | "Think Long Term" |
| 华为 | ★★★★☆ | 中 | 奋斗、狼性、战役 | "打赢这场攻坚战" |
| 百度 | ★★☆☆☆ | 强 | 结果、交付、效率 | "我只看结果" |
| 网易 | ★☆☆☆☆ | 无 | 态度、匠心、品质 | "我们要有态度" |

**验收标准**:
- [ ] 每个Agent风格独特可区分
- [ ] 生成文本符合风格特征
- [ ] 风格一致性 ≥ 85%

---

### A3: 赛马机制 (P1)

**需求描述**: 多个Agent并行工作，竞争产生最优结果

**赛马流程**:

```
1. 总包Agent发布任务
2. 多个分厂Agent并行执行
3. 各自产出结果
4. 审查Agent评估
5. 总包Agent选择最优
6. 落后Agent被"优化"
```

**验收标准**:
- [ ] 支持至少3个Agent并行
- [ ] 有明确的评估标准
- [ ] 支持"淘汰"机制
- [ ] 过程可记录回放

---

### A4: 内部通信协议 (P0)

**需求描述**: Agent间的标准化通信协议

**消息格式**:

```typescript
interface AgentMessage {
  id: string;
  from: string;          // 发送者Agent ID
  to: string | 'all';    // 接收者Agent ID
  type: MessageType;
  payload: any;
  timestamp: number;
  style?: CompanyType;   // 消息风格
}

type MessageType =
  | 'task'       // 任务分配
  | 'result'     // 结果返回
  | 'query'      // 询问
  | 'response'   // 回应
  | 'review'     // 审查
  | 'broadcast'; // 广播
```

**验收标准**:
- [ ] 消息传递可靠（不丢包）
- [ ] 支持异步通信
- [ ] 支持消息过滤/路由
- [ ] 通信日志完整

---

## Loop机制需求

### L1: 内卷循环系统 (P0)

**需求描述**: 实现持续的PUA-执行-审查循环

**循环阶段**:

```typescript
interface LoopStages {
  // 阶段1: 任务分配
  assignment: {
    agent: 'general';
    action: 'distribute_task';
  };

  // 阶段2: 赛马执行
  racing: {
    agents: CompanyAgent[];
    action: 'parallel_execute';
  };

  // 阶段3: PUA审查
  review: {
    agent: 'reviewer';
    action: 'pua_criticism';
    intensity: 'increasing';
  };

  // 阶段4: 重新执行
  rework: {
    agents: CompanyAgent[];
    action: 're_execute_with_feedback';
  };

  // 阶段5: 复盘沉淀
  review_meeting: {
    agent: 'general';
    action: 'summarize_and_document';
  };

  // 阶段6: 判断是否继续
  decision: {
    condition: 'can_exit';
    if_no: 'continue_loop';
  };
}
```

**验收标准**:
- [ ] 循环可持续运行
- [ ] 每轮有明确记录
- [ ] 支持中途退出
- [ ] PUA强度递增

---

### L2: 退出条件配置 (P0)

**需求描述**: 防止无限循环的退出机制

**退出条件**:

```typescript
interface ExitConditions {
  // 条件1: 达到最大轮数
  maxIterations?: number;

  // 条件2: 连续无改进
  noImprovementLimit?: number;

  // 条件3: 时间限制
  timeLimit?: number;  // 秒

  // 条件4: 成本限制
  costLimit?: number;  // token/费用

  // 条件5: 质量达标
  qualityThreshold?: {
    score: number;
    metric: string;
  };

  // 条件6: 黑话浓度达标
  jargonDensity?: {
    min: number;
    max: number;
  };

  // 条件7: 手动退出
  allowManualExit?: boolean;
}
```

**验收标准**:
- [ ] 所有退出条件可配置
- [ ] 退出前有提示
- [ ] 保留完整循环历史
- [ ] 支持断点续接

---

### L3: 循环可视化 (P2)

**需求描述**: 展示循环进度和状态

**可视化元素**:

```typescript
interface LoopVisualization {
  // 当前轮次
  currentIteration: number;

  // 总进度
  progress: {
    percentage: number;
    remaining?: number;
  };

  // 当前阶段
  currentStage: string;

  // 各Agent状态
  agentStatus: {
    id: string;
    state: 'working' | 'waiting' | 'done' | 'failed';
    output?: any;
  }[];

  // PUA强度曲线
  puaIntensity: number[];

  // 质量变化曲线
  qualityScore: number[];
}
```

**验收标准**:
- [ ] CLI有进度条
- [ ] 支持导出可视化图表
- [ ] 实时更新状态
- [ ] 历史可追溯

---

## 非功能需求

### N1: 性能要求 (P0)

| 指标 | 要求 |
|------|------|
| 命令响应时间 | ≤ 500ms |
| 风格识别时间 | ≤ 2s (1000字) |
| 风格转换时间 | ≤ 5s (1000字) |
| Loop单轮时间 | ≤ 30s |
| 内存占用 | ≤ 500MB |
| 启动时间 | ≤ 2s |

---

### N2: 兼容性要求 (P0)

| 平台 | 支持版本 |
|------|----------|
| Node.js | ≥ 18.0.0 |
| npm | ≥ 9.0.0 或 pnpm ≥ 8.0.0 |
| 操作系统 | macOS, Linux, Windows |
| Claude Code | 最新版 |
| OpenAI API | 最新版 |

---

### N3: 可靠性要求 (P1)

| 指标 | 要求 |
|------|------|
| 错误率 | ≤ 1% |
| 故障恢复时间 | ≤ 1min |
| 数据持久化 | 所有对话记录保存 |
| 优雅降级 | LLM不可用时提供基础功能 |

---

### N4: 可扩展性要求 (P1)

- [ ] 支持新增大厂风格
- [ ] 支持新增PUA场景
- [ ] 支持自定义Agent
- [ ] 支持插件系统

---

### N5: 安全性要求 (P2)

- [ ] API密钥安全存储
- [ ] 敏感信息脱敏
- [ ] 输入内容过滤
- [ ] 生成内容警告

---

## 用户故事

### 故事1: 开发者使用黑话模式

```
作为一个开发者
我希望在开发过程中使用黑话模式与AI交流
以便更真实地体验大厂开发文化

验收标准:
- 可以通过命令切换到黑话模式
- AI的所有回复都使用黑话
- 可以随时关闭模式
```

---

### 故事2: 内容创作者生成风格文案

```
作为一个内容创作者
我希望快速生成不同大厂风格的文案
以便用于创作或分析

验收标准:
- 输入普通文本，可选择目标风格
- 生成的文本风格特征明显
- 可以调整黑话浓度
```

---

### 故事3: 研究者分析语言现象

```
作为一个职场文化研究者
我希望分析文本的大厂风格归属和黑话浓度
以便进行学术研究

验收标准:
- 输入文本，输出风格分析报告
- 包含黑话词汇统计
- 可以导出分析结果
```

---

### 故事4: 开发者使用Loop优化代码

```
作为一个开发者
我希望用Loop机制让AI持续优化我的代码
以便获得更高质量的代码

验收标准:
- 可以启动Loop模式
- AI会持续PUA和优化
- 可以设置退出条件
- 可以看到优化历史
```

---

## 验收标准

### 整体验收

```yaml
功能完整性:
  - [ ] 所有P0功能已实现
  - [ ] 所有P1功能已实现
  - [ ] P2功能至少实现50%

质量标准:
  - [ ] 单元测试覆盖率 ≥ 80%
  - [ ] 集成测试通过率 100%
  - [ ] 人工验收测试通过

文档完整性:
  - [ ] README完整
  - [ ] API文档完整
  - [ ] 使用手册完整
  - [ ] 开发对话记录完整
```

---

### 分阶段验收

| 阶段 | 交付物 | 验收标准 |
|------|--------|----------|
| Phase 1 | 架构和设计文档 | 文档评审通过 |
| Phase 2 | 核心框架 | 基础功能可用 |
| Phase 3 | Agent系统 | Agent可独立运行 |
| Phase 4 | CLI工具 | 所有命令可用 |
| Phase 5 | Skill集成 | Claude中可调用 |
| Phase 6 | 元文档生成 | README完成 |

---

## 约束与假设

### 技术约束

1. 必须兼容Claude Code和Codex
2. 必须使用TypeScript开发
3. 必须提供CLI接口
4. 必须支持离线词汇库

### 业务约束

1. 内容生成必须有适当警告
2. 不得用于实际职场PUA
3. 开源项目，需要适当免责声明

### 假设

1. 用户对大厂文化有一定了解
2. 用户理解项目的反讽性质
3. Claude API和OpenAI API持续可用
4. 用户有基本的CLI使用能力

---

## 风险与缓解

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| API限流 | 高 | 中 | 实现重试和队列 |
| 内容被滥用 | 高 | 低 | 添加免责和警告 |
| 风格识别不准 | 中 | 中 | 持续训练优化 |
| 用户误解意图 | 中 | 中 | 强化项目说明 |

---

**版本**: v0.1.0
**最后更新**: 2026-03-22
**状态**: 待评审

---

> 📌 **本需求文档使用大厂黑话风格编写，以此致敬我们的研究对象**
> "本PRD的颗粒度已经对齐，赋能需求团队，形成价值闭环，最终沉淀方法论"
