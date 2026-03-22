/**
 * 导出所有公共 API
 *
 * @description
 * 统一导出入口，形成 API 闭环。
 */

// 分析器
export * from './analyzers/style.js';
export * from './analyzers/density.js';

// 转换器
export * from './converters/style.js';

// 生成器
export * from './generators/pua.js';

// 模式管理
export { getModeManager, switchMode, getCurrentMode } from './modes/manager.js';

// LLM
export { createLLMAdapter, getLLMManager, initializeDefaultAdapter } from './llm/adapter.js';

// Agent
export { AgentManager, createDefaultAgentManager } from './agents/manager.js';

// Loop
export { LoopController, createLoopController } from './loop/controller.js';

// 数据
export * from './data/vocabularies/jargon.js';
export * from './data/formulas/pua.js';
