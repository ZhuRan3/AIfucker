/**
 * CLI 入口文件
 *
 * @description
 * 命令行界面入口，赋能用户交互。
 * CLI赋能操作，形成使用闭环。
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import Table from 'cli-table3';
import figlet from 'figlet';
import type {
  CompanyType,
  InteractionMode,
  PUAIntensity,
  JargonIntensity,
  LoopConfig,
} from './types/index.js';
import {
  recognizeStyle,
  convertStyle,
  generatePUA,
  checkDensity,
} from './exports/index.js';
import { getModeManager, switchMode } from './modes/manager.js';
import { createLoopController } from './loop/controller.js';
import { initializeDefaultAdapter, getLLMManager } from './llm/adapter.js';
import { loadConfig } from './utils/config.js';

// ============================================================================
// CLI 程序
// ============================================================================

const program = new Command();

program
  .name('jargon-pua')
  .description('大厂黑话和PUA话术生成与转换工具')
  .version('0.1.0');

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 显示欢迎信息
 */
function showWelcome(): void {
  console.log(chalk.cyan(figlet.textSync('Jargon-PUA', { horizontalLayout: 'full' })));
  console.log(chalk.gray('大厂黑话和PUA话术生成与转换工具\n'));
}

/**
 * 显示模式状态
 */
function showModeStatus(): void {
  const modeManager = getModeManager();
  const mode = modeManager.getCurrentMode();
  const description = modeManager.getDescription();

  console.log(chalk.yellow('当前模式:'), description);
}

/**
 * 创建加载动画
 */
function createSpinner(text: string): Ora {
  return ora({
    text,
    color: 'cyan',
  });
}

// ============================================================================
// 模式命令
// ============================================================================

program
  .command('mode <mode>')
  .description('切换交互模式')
  .option('-c, --company <company>', '目标大厂风格')
  .option('--pua-intensity <intensity>', 'PUA强度 (mild/moderate/strong/extreme)')
  .option('--jargon-intensity <intensity>', '黑话强度 (light/medium/heavy/extreme)')
  .action(async (mode: string, options) => {
    showWelcome();

    const modeValue = mode as InteractionMode;
    const validModes: InteractionMode[] = ['normal', 'jargon', 'pua', 'full'];

    if (!validModes.includes(modeValue)) {
      console.log(chalk.red('错误: 无效的模式'));
      console.log(chalk.gray('可用模式: normal, jargon, pua, full'));
      process.exit(1);
    }

    const spinner = createSpinner('正在切换模式...');
    spinner.start();

    try {
      await switchMode(modeValue, {
        company: options.company as CompanyType,
        puaIntensity: options.puaIntensity as PUAIntensity,
        jargonIntensity: options.jargonIntensity as JargonIntensity,
      });

      spinner.succeed('模式切换成功');
      showModeStatus();
    } catch (error) {
      spinner.fail('模式切换失败');
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  });

// ============================================================================
// 分析命令
// ============================================================================

program
  .command('analyze <text>')
  .description('识别文本风格')
  .option('-d, --detailed', '显示详细分析')
  .action(async (text: string, options) => {
    const spinner = createSpinner('正在分析风格...');
    spinner.start();

    try {
      const result = await recognizeStyle(text, {
        detailed: options.detailed,
      });

      spinner.succeed('分析完成');

      // 显示结果
      const table = new Table({
        head: [chalk.cyan('项目'), chalk.cyan('值')],
      });

      table.push(
        [chalk.yellow('公司风格'), chalk.green(result.company)],
        [chalk.yellow('置信度'), chalk.green(`${(result.confidence * 100).toFixed(1)}%`)]
      );

      console.log('\n' + table.toString());

      if (result.analysis) {
        console.log(chalk.cyan('\n详细分析:'));
        console.log(`  关键词: ${result.analysis.keywords.join(', ')}`);
        console.log(`  黑话浓度: ${result.analysis.density}%`);
        console.log(`  语气: ${result.analysis.tone}`);
        console.log(`  句式: ${result.analysis.patterns.join(', ')}`);
      }
    } catch (error) {
      spinner.fail('分析失败');
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  });

// ============================================================================
// 转换命令
// ============================================================================

program
  .command('convert <text>')
  .description('转换文本风格')
  .requiredOption('-t, --to <company>', '目标大厂风格')
  .option('-i, --intensity <intensity>', '黑话强度')
  .action(async (text: string, options) => {
    const spinner = createSpinner('正在转换风格...');
    spinner.start();

    try {
      const result = await convertStyle(text, options.to as CompanyType, {
        intensity: options.intensity as JargonIntensity,
      });

      spinner.succeed('转换完成');
      console.log(chalk.green('\n转换结果:'));
      console.log(result);
    } catch (error) {
      spinner.fail('转换失败');
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  });

// ============================================================================
// PUA 命令
// ============================================================================

program
  .command('pua <scenario>')
  .description('生成PUA话术')
  .option('-s, --style <company>', '大厂风格 (默认: ali)')
  .option('-i, --intensity <intensity>', 'PUA强度 (默认: moderate)')
  .action(async (scenario: string, options) => {
    const spinner = createSpinner('正在生成PUA话术...');
    spinner.start();

    try {
      const result = await generatePUA({
        scenario: scenario as any,
        style: (options.style as CompanyType) || 'ali',
        intensity: (options.intensity as PUAIntensity) || 'moderate',
      });

      spinner.succeed('生成完成');
      console.log(chalk.green('\nPUA话术:'));
      console.log(chalk.yellow(result.puaText));

      if (result.warning) {
        console.log(chalk.red('\n' + result.warning));
      }
    } catch (error) {
      spinner.fail('生成失败');
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  });
// ============================================================================
// 检测命令
// ============================================================================

program
  .command('check <text>')
  .description('检测黑话浓度')
  .option('-m, --mode <mode>', '检测模式 (overall/by_category/detailed)')
  .action(async (text: string, options) => {
    const spinner = createSpinner('正在检测浓度...');
    spinner.start();

    try {
      const result = checkDensity(text, options.mode as any);

      spinner.succeed('检测完成');

      const table = new Table({
        head: [chalk.cyan('项目'), chalk.cyan('值')],
      });

      table.push(
        [chalk.yellow('浓度'), chalk.green(`${result.overall.score}%`)],
        [chalk.yellow('级别'), chalk.green(result.overall.level)]
      );

      console.log('\n' + table.toString());

      if (result.byCategory) {
        console.log(chalk.cyan('\n分类统计:'));
        const categoryTable = new Table({
          head: [chalk.cyan('类别'), chalk.cyan('数量'), chalk.cyan('占比')],
        });

        for (const cat of result.byCategory) {
          categoryTable.push([
            chalk.yellow(cat.category),
            chalk.green(cat.count.toString()),
            chalk.green(`${cat.percentage}%`),
          ]);
        }

        console.log(categoryTable.toString());
      }

      if (result.suggestions) {
        console.log(chalk.cyan('\n优化建议:'));
        for (const suggestion of result.suggestions) {
          console.log(`  ${chalk.gray('•')} ${suggestion}`);
        }
      }
    } catch (error) {
      spinner.fail('检测失败');
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  });

// ============================================================================
// Loop 命令
// ============================================================================

program
  .command('loop <task>')
  .description('启动内卷循环')
  .option('--max-iterations <number>', '最大循环次数', '5')
  .option('--pua-intensity <intensity>', 'PUA强度', 'moderate')
  .option('--jargon-intensity <intensity>', '黑话强度', 'medium')
  .option('--safe', '启用安全模式')
  .action(async (task: string, options) => {
    showWelcome();
    showModeStatus();

    console.log(chalk.cyan('\n启动内卷循环...'));
    console.log(chalk.gray(`任务: ${task}\n`));

    // 初始化 LLM
    const config = await loadConfig();
    await initializeDefaultAdapter(config.llm);

    // 创建 Loop 控制器
    const loopConfig: LoopConfig = {
      maxIterations: parseInt(options.maxIterations),
      puaIntensity: options.puaIntensity as PUAIntensity,
      jargonIntensity: options.jargonIntensity as JargonIntensity,
      safety: {
        enabled: options.safe,
      },
    };

    const controller = createLoopController(loopConfig, config.llm);

    // 运行 Loop
    const spinner = createSpinner('循环进行中...');
    spinner.start();

    try {
      const result = await controller.start(task);

      spinner.succeed('循环完成');

      // 显示结果
      console.log(chalk.cyan('\n循环结果:'));
      console.log(`  总轮次: ${chalk.green(result.totalIterations.toString())}`);
      console.log(`  最终质量: ${chalk.green(result.quality.toFixed(1))}`);
      console.log(`  用时: ${chalk.green(`${(result.elapsedTime / 1000).toFixed(1)}s`)}`);
      console.log(`  退出原因: ${chalk.yellow(result.exitReason)}`);

      if (result.history.results.length > 0) {
        console.log(chalk.cyan('\n迭代历史:'));
        const historyTable = new Table({
          head: [chalk.cyan('轮次'), chalk.cyan('阶段'), chalk.cyan('质量')],
        });

        for (let i = 0; i < result.history.results.length; i++) {
          const r = result.history.results[i];
          historyTable.push([
            chalk.green((i + 1).toString()),
            chalk.yellow(r.stage),
            chalk.cyan(r.quality.toFixed(1)),
          ]);
        }

        console.log(historyTable.toString());
      }
    } catch (error) {
      spinner.fail('循环失败');
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }
  });

// ============================================================================
// Agent 命令
// ============================================================================

program
  .command('agent')
  .description('Agent 管理命令')
  .action(async () => {
    showWelcome();

    const config = await loadConfig();
    await initializeDefaultAdapter(config.llm);

    const manager = getLLMManager();
    const available = manager.getAvailable();

    console.log(chalk.cyan('\n可用的 LLM 适配器:'));
    const table = new Table({
      head: [chalk.cyan('提供商'), chalk.cyan('模型'), chalk.cyan('状态')],
    });

    for (const adapter of available) {
      const info = adapter.getInfo();
      table.push([
        chalk.yellow(info.provider),
        chalk.green(info.model),
        chalk.green(info.available ? '✓' : '✗'),
      ]);
    }

    console.log(table.toString());
  });

// ============================================================================
// 配置命令
// ============================================================================

program
  .command('config')
  .description('配置管理')
  .option('-s, --set <key> <value>', '设置配置项')
  .option('-g, --get <key>', '获取配置项')
  .action(async (options) => {
    showWelcome();

    const config = await loadConfig();

    if (options.get) {
      const keys = options.get.split('.');
      let value: any = config;
      for (const key of keys) {
        value = value[key];
      }
      console.log(chalk.cyan(`${options.get}:`), chalk.green(JSON.stringify(value, null, 2)));
    } else if (options.set) {
      console.log(chalk.yellow('配置设置功能即将推出'));
    } else {
      console.log(chalk.cyan('\n当前配置:'));
      console.log(JSON.stringify(config, null, 2));
    }
  });

// ============================================================================
// 解析参数
// ============================================================================

program.parse();

// 如果没有参数，显示帮助
if (!process.argv.slice(2).length) {
  showWelcome();
  program.outputHelp();
}
