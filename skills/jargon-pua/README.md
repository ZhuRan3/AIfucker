# Jargon-PUA Claude Skill

> 为你的Claude Code赋能大厂黑话和PUA话术能力

## 快速开始

### 安装

```bash
# 将此Skill复制到你的Claude Code skills目录
cp -r jargon-pua ~/.claude/skills/
```

### 基础使用

```markdown
# 开启黑话模式
@jargon-pua 开启黑话模式

# 现在Claude会用黑话与你交流
你: 帮我写一个函数
Claude: 好的，我们要以函数功能为抓手，赋能业务逻辑...
```

## 功能清单

| 功能 | 命令 | 效果 |
|------|------|------|
| 模式切换 | `@jargon-pua 开启黑话模式` | AI使用黑话交流 |
| 风格识别 | `@jargon-pua 识别风格` | 分析文本所属大厂 |
| 风格转换 | `@jargon-pua 转换为XX风格` | 改变文本风格 |
| PUA生成 | `@jargon-pua 生成XX话术` | 生成PUA话术 |
| 浓度检测 | `@jargon-pua 检测浓度` | 检测黑话浓度 |
| 循环优化 | `@jargon-pua 启动循环` | 持续优化任务 |

## 大厂风格速查

| 公司 | 一句话特征 | 核心关键词 |
|------|-----------|-----------|
| 阿里 | 赋能闭环沉淀 | 赋能、抓手、闭环、中台 |
| 腾讯 | 赛道赛马数据 | 赛道、赛马、DAU |
| 字节 | Doc Double 同步 | Doc、Double、Context |
| 美团 | 长期耐心 ROI | Think Long Term |
| 华为 | 奋斗战役 胶片 | 奋斗者、战役、胶片 |
| 百度 | 结果 简单 依赖 | 结果、简单可依赖 |
| 网易 | 态度 匠心 品质 | 态度、匠心、有品质 |

## 强度控制

### PUA强度

```
mild (轻度) → moderate (中度) → strong (重度) → extreme (极度)
```

### 黑话浓度

```
light (5-15%) → medium (15-30%) → heavy (30-50%) → extreme (50%+)
```

### 使用示例

```markdown
@jargon-pua 开启黑话模式，浓度中等
@jargon-pua 用PUA模式审查，强度轻一点
@jargon-pua 启动完全模式，但不要太激进
```

## 安全提示

⚠️ **重要提醒**：

1. 本Skill具有反讽性质，旨在揭示大厂文化现象
2. 请勿在实际职场中使用PUA话术
3. 建议从低强度开始体验
4. 重要代码请备份，启用安全模式

## 更多信息

- [完整文档](../README.md)
- [架构设计](../ARCHITECTURE.md)
- [开发指南](../DEVELOPMENT.md)
