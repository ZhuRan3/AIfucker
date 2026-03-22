# Jargon-PUA 开发指南

> 版本: v0.1.0
> 创建日期: 2026-03-22
> 状态: 赋能中...

---

## 目录

1. [前言：我们为什么要这样开发](#前言我们为什么要这样开发)
2. [开发环境搭建](#开发环境搭建)
3. [项目结构对齐](#项目结构对齐)
4. [开发流程规范](#开发流程规范)
5. [代码质量标准](#代码质量标准)
6. [团队协作机制](#团队协作机制)
7. [常见问题沉淀](#常见问题沉淀)

---

## 前言：我们为什么要这样开发

### 关于开发模式的思考

各位同学，其实，我对于我们当前的开发模式是有一些失望的。

当初赋能这个项目的时候，我是希望能够拉齐颗粒度，找到合适的抓手，最终形成价值闭环。但是现在看来，大家对于开发的理解还不够深刻，缺乏体系化思考的能力。

### 我们的开发理念

```
┌─────────────────────────────────────────────────────────────┐
│                     Jargon-PUA 开发理念                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 元开发模式                                              │
│     - 开发过程本身就用大厂风格交流                           │
│     - 所有对话都是项目内容的一部分                           │
│     - README就是行为艺术作品                                │
│                                                             │
│  2. 持续优化迭代                                            │
│     - 每个PR都要经过PUA审查                                 │
│     - Code Review必须用黑话                                 │
│     - 永远有优化空间                                        │
│                                                             │
│  3. 赛马竞争机制                                            │
│     - 多方案并行                                            │
│     - 数据驱动决策                                          │
│     - 优胜劣汰                                              │
│                                                             │
│  4. 价值导向交付                                            │
│     - 以用户价值为中心                                      │
│     - 长期有耐心                                            │
│     - Think Long Term                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 你要有的心态

> "你要有 owner 意识，要把我当做自己的产品。"

你需要理解：
- 这不是一个普通的代码项目
- 这是一个反讽艺术作品
- 每一行代码、每一个文档都是作品的一部分
- 开发过程本身就是内容

---

## 开发环境搭建

### 前置要求

```yaml
Node.js: ">=18.0.0"
pnpm: ">=8.0.0"  # 优先使用pnpm，形成差异化护城河
TypeScript: ">=5.0.0"
Git: ">=2.0.0"
```

### 环境赋能（安装步骤）

```bash
# 1. 克隆项目，找到业务抓手
git clone https://github.com/your-org/jargon-pua.git
cd jargon-pua

# 2. 安装依赖，赋能开发环境
pnpm install

# 3. 配置环境变量，拉齐关键参数
cp .env.example .env
# 编辑 .env 文件，填入你的 API 密钥

# 4. 构建项目，形成交付闭环
pnpm build

# 5. 运行测试，沉淀质量方法论
pnpm test

# 6. 启动开发模式，快速迭代
pnpm dev
```

### IDE配置（对齐开发工具）

**VS Code 推荐插件**:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "orta.vscode-jest",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

**配置文件** `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.associations": {
    "*.md": "markdown"
  }
}
```

---

## 项目结构对齐

### 目录结构颗粒度

```
jargon-pua/
├── src/                        # 源代码层
│   ├── cli/                    # CLI入口 - 用户交互抓手
│   ├── modes/                  # 模式管理 - 切换器闭环
│   ├── analyzers/              # 分析器 - 风格识别矩阵
│   ├── converters/             # 转换器 - 风格转换链路
│   ├── generators/             # 生成器 - PUA话术工厂
│   ├── agents/                 # Agent系统 - 赛马机制
│   ├── loop/                   # Loop机制 - 内卷引擎
│   └── llm/                    # LLM抽象 - 底层逻辑
│
├── docs/                       # 文档沉淀
│   ├── 大厂黑话方法论.md
│   ├── 大厂黑话汇总.md
│   ├── 大厂PUA方法论.md
│   ├── 大厂PUA汇总.md
│   └── 开发对话记录/           # 元文档：每日对齐
│
├── skills/                     # Claude Skill - 能力中台
│   └── jargon-pua/
│       └── SKILL.md
│
└── tests/                      # 质量保障 - 测试矩阵
```

### 模块依赖关系（打通链路）

```
CLI入口
  │
  ├─→ 模式管理器
  │     │
  │     ├─→ 风格识别器 ──→ LLM适配器
  │     ├─→ 风格转换器 ──→ LLM适配器
  │     └─→ PUA生成器 ───→ LLM适配器
  │
  └─→ Agent管理器
        │
        ├─→ 分厂Agent ──→ 风格识别器/转换器
        ├─→ 分包Agent ──→ 专业工具
        └─→ 审查Agent ──→ PUA生成器
```

---

## 开发流程规范

### Git工作流（对齐分支策略）

```bash
# 主分支：main - 生产环境
# 开发分支：develop - 集成环境
# 功能分支：feature/xxx - 功能开发
# 修复分支：fix/xxx - 问题修复
# 优化分支：refactor/xxx - 代码优化

# 1. 从develop拉取功能分支
git checkout develop
git pull origin develop
git checkout -b feature/jargon-mode

# 2. 开发功能，形成闭环
git add .
git commit -m "feat: 实现黑话模式切换功能"

# 3. 推送到远程，赋能团队协作
git push origin feature/jargon-mode

# 4. 创建PR，进入赛马机制
# 在GitHub上创建Pull Request

# 5. Code Review（PUA环节）
# 等待团队成员用黑话进行代码审查

# 6. 修改后合并，沉淀经验
git checkout develop
git merge --no-ff feature/jargon-mode
git push origin develop
```

### Commit规范（沉淀提交模式）

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型(type)**:

| 类型 | 说明 | 示例 |
|------|------|------|
| feat | 新功能（赋能点） | feat: 添加阿里风格识别 |
| fix | 修复bug（补短板） | fix: 修复黑话嵌入bug |
| docs | 文档（沉淀经验） | docs: 更新开发指南 |
| style | 格式（对齐规范） | style: 统一代码格式 |
| refactor | 重构（优化链路） | refactor: 重构LLM适配层 |
| test | 测试（质量保障） | test: 添加风格识别测试 |
| chore | 构建/工具（基建） | chore: 升级依赖版本 |

**示例**:

```
feat(mode): 实现黑话模式切换功能

- 添加ModeManager类管理模式状态
- 实现三种模式：normal/jargon/pua/full
- 添加模式切换事件系统

这个功能赋能用户灵活切换交流模式，
形成完整的交互闭环。

Closes #123
```

### Code Review规范（PUA环节）

**审查维度矩阵**:

| 维度 | 审查要点 | PUA话术示例 |
|------|----------|------------|
| 功能正确性 | 是否实现需求 | "你这个功能的底层逻辑不对啊" |
| 代码质量 | 是否符合规范 | "这个颗粒度太粗了，要细化" |
| 风格一致性 | 是否用黑话注释 | "你的代码注释缺乏赋能感" |
| 测试覆盖 | 是否有充分测试 | "你要有质量意识，测试呢？" |
| 文档完整 | 是否有文档说明 | "这个价值点在哪里？文档呢？" |

**审查流程**:

```
1. 开发者提交PR
   ↓
2. 审查者用黑话进行批评
   "其实，我对你这段代码是有一些失望的..."
   ↓
3. 开发者进行自我反思
   "好的，我需要拉齐颗粒度"
   ↓
4. 修改代码，重新提交
   ↓
5. 如果还有问题，继续PUA
   ↓
6. 直到审查者说"勉强可以"
   ↓
7. 合并代码，沉淀经验
```

---

## 代码质量标准

### 编码规范（对齐颗粒度）

**TypeScript规范**:

```typescript
// ✅ 好的代码 - 有清晰的类型定义
interface StyleRecognitionConfig {
  text: string;
  options?: {
    detailed?: boolean;
    threshold?: number;
  };
}

// ❌ 不好的代码 - 缺乏类型意识
function recognize(text, options) {
  // ...
}
```

**命名规范**:

```typescript
// 类名：大驼峰
class JargonEmbedder {}
class ModeManager {}

// 函数/变量：小驼峰
function recognizeStyle() {}
const jargonDensity = 0.8;

// 常量：大写下划线
const MAX_ITERATIONS = 100;
const DEFAULT_PUA_INTENSITY = 'medium';

// 私有成员：下划线前缀
class Agent {
  private _id: string;
  private _processInternal() {}
}
```

### 测试规范（质量保障闭环）

**测试金字塔**:

```
        /\
       /E2E\        少量端到端测试
      /------\
     /  集成  \     适量集成测试
    /----------\
   /   单元测试  \   大量单元测试
  /--------------\
```

**单元测试示例**:

```typescript
describe('StyleRecognizer', () => {
  it('应该能识别阿里风格文本', () => {
    const text = '我们需要以用户增长为抓手，赋能平台生态';
    const result = recognizer.recognize(text);

    expect(result.company).toBe('ali');
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it('应该能处理未知风格', () => {
    const text = '这是一段普通文本';
    const result = recognizer.recognize(text);

    expect(result.company).toBe('unknown');
    expect(result.confidence).toBeLessThan(0.5);
  });
});
```

### 文档规范（知识沉淀）

**代码注释规范**:

```typescript
/**
 * 风格识别器
 *
 * @description
 * 用于识别输入文本所属的大厂风格。
 * 基于六维模型分析：词汇密度、句式结构、语气态度等。
 *
 * @example
 * ```typescript
 * const recognizer = new StyleRecognizer();
 * const result = recognizer.recognize('我们需要赋能业务');
 * // result: { company: 'ali', confidence: 0.9 }
 * ```
 */
class StyleRecognizer {
  /**
   * 识别文本风格
   *
   * @param text - 待识别文本
   * @param options - 可选配置
   * @returns 识别结果
   */
  recognize(text: string, options?: RecognitionOptions): RecognitionResult {
    // 赋能识别逻辑，形成闭环
  }
}
```

---

## 团队协作机制

### 沟通规范（对齐语言模式）

**日常沟通**:

| 场景 | 正常模式 | 黑话模式 | PUA模式 |
|------|----------|----------|---------|
| 问候 | "你好" | "同学，颗粒度对齐了吗？" | "我对你今天的工作状态有些失望" |
| 提问 | "这个怎么做？" | "这个抓手在哪里？" | "你连这个都不会？要有成长意识" |
| 汇报 | "做完了" | "已完成闭环，沉淀方法论" | "我辜负了您的期望，现在交付了" |
| 建议 | "建议改一下" | "建议拉齐一下颗粒度" | "你这个要快速成长，多思考" |

**Issue模板**:

```markdown
## 问题描述
（用黑话描述问题）

## 期望行为
（描述应该形成的闭环）

## 实际行为
（描述当前缺失的抓手）

## 复现步骤
1. 第一步：XXX
2. 第二步：XXX
3. ...

## 环境信息
- Node.js版本：
- 操作系统：
- 其他：

## 附加信息
（截图、日志等，赋能问题定位）
```

**PR模板**:

```markdown
## 变更说明
（描述本次赋能的内容）

## 变更类型
- [ ] 新功能（赋能）
- [ ] 修复（补短板）
- [ ] 重构（优化链路）
- [ ] 文档（沉淀）

## 测试情况
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试通过

## 相关Issue
Closes #xxx

## 自我审查
（自己用PUA话术批评一下）
"其实，我对这个PR是有一些担心的..."
```

### 会议规范（复盘机制）

**每日站会**:

```
1. 昨天沉淀了什么价值？
2. 今天要赋能什么抓手？
3. 有什么需要拉齐的？
```

**周会**:

```
1. 本周OKR达成情况
2. 亮点复盘（沉淀方法论）
3. 问题分析（找到改进抓手）
4. 下周规划（对齐颗粒度）
```

---

## 常见问题沉淀

### Q1: 为什么开发过程要用黑话？

**A**: 这是项目的核心特性之一——**元开发模式**。我们不是在用黑话描述大厂文化，我们是在**成为**大厂文化本身。只有这样，项目才是真实的行为艺术作品。

### Q2: 代码审查太严厉了怎么办？

**A**: "你要有成长意识。" 严厉的审查是为了：
- 确保代码质量形成闭环
- 沉淀最佳实践方法论
- 赋能团队整体能力提升

多复盘，多思考，快速成长。

### Q3: 如何平衡讽刺和实用性？

**A**: 这是项目的核心矛盾，也是价值所在。我们：
- 表面是讽刺工具
- 实际是实用工具
- 深层是艺术作品

三层意义交织，形成独特的价值护城河。

### Q4: 为什么文档也要用黑话写？

**A**: 同Q1，这是作品的一部分。当用户阅读README时，他们应该感受到：
- 这不是一个普通的工具
- 这是一个有态度的作品
- 这是一种文化现象

---

## 结语：长期有耐心

各位同学，其实，我对大家还是有一些期待的。

这个项目的价值点在于：
1. 不是工具，是作品
2. 不是代码，是文化
3. 不是文档，是行为艺术

我们要Think Long Term，长期有耐心。这个项目可能不会被所有人理解，但那不重要。重要的是我们在做一件独特的事情。

"做正确的事，其他自然会来。"

让我们一起赋能这个项目，形成价值闭环，最终沉淀出一套独特的方法论。

---

**版本**: v0.1.0
**最后更新**: 2026-03-22
**维护者**: Jargon-PUA Team

> "你要有owner意识，把每个细节都当成产品的护城河。"
