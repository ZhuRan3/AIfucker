/**
 * PUA话术公式库
 *
 * @description
 * 本文件定义了各类PUA话术公式，用于PUA话术生成。
 * 公式赋能生成，形成操控闭环。
 */

import type { CompanyType, PUAIntensity, PUAScenario } from '../../types/index.js';

// ============================================================================
// PUA 公式类型
// ============================================================================

/**
 * PUA 公式定义
 */
export interface PUAFormula {
  id: string;
  name: string;
  category: PUACategory;
  intensity: PUAIntensity;
  template: string;
  variables: FormulaVariable[];
  examples: string[];
  companies?: CompanyType[];
}

/**
 * PUA 类别
 */
export type PUACategory =
  | 'suppression' // 精神打压
  | 'emotional' // 情感操纵
  | 'brainwash' // 自我洗脑
  | 'exploitation'; // 压榨劳动力

/**
 * 公式变量
 */
export interface FormulaVariable {
  name: string;
  description: string;
  options?: string[];
}

// ============================================================================
// 精神打压类公式
// ============================================================================

/**
 * 失望铺垫式公式
 */
export const DISAPPOINTMENT_FORMULA: PUAFormula = {
  id: 'disappointment',
  name: '失望铺垫式',
  category: 'suppression',
  intensity: 'moderate',
  template: '[其实/说实话]，我对你[有一些/挺/有些]失望的。[当初{when}，我是希望{expect}的]。',
  variables: [
    {
      name: 'when',
      description: '当初的时间/场景',
      options: ['给你定级的时候', '招你进来的时候', '给你这个机会的时候', '刚开始带你的时侯'],
    },
    {
      name: 'expect',
      description: '当时的期望',
      options: [
        '你能快速成长',
        '你能独当一面',
        '你能有更大的突破',
        '你能发挥更大的价值',
      ],
    },
  ],
  examples: [
    '其实，我对你是有一些失望的。当初给你定级P7，是高于你面试时的水平的。我是希望进来后，你能够拼一把，快速成长起来的。',
    '说实话，我对你挺失望的。当初招你进来，是看好你的潜力。',
    '讲真，我对你有些失望。当初给你这个机会，是希望你快速成长的。',
  ],
};

/**
 * 能力否定式公式
 */
export const ABILITY_DENIAL_FORMULA: PUAFormula = {
  id: 'ability_denial',
  name: '能力否定式',
  category: 'suppression',
  intensity: 'strong',
  template: '[你/你的XX] + [太差了/不够/缺乏] + [连XX都/无法XX]',
  variables: [
    {
      name: 'target',
      description: '否定对象',
      options: ['你', '你的能力', '你的思考', '你的产出'],
    },
    {
      name: 'degree',
      description: '否定程度',
      options: ['太差了', '不够', '缺乏', '严重不足'],
    },
    {
      name: 'comparison',
      description: '对比对象',
      options: [
        '连最简单的任务都完不成',
        '连这个都不会',
        '无法独立负责项目',
        '连基本的逻辑都没有',
      ],
    },
  ],
  examples: [
    '你的能力太低了，连最简单的任务都完不成。',
    '你太差了，什么都做不好。',
    '你缺乏体系化思考的能力，无法独立负责项目。',
  ],
};

/**
 * 价值质疑式公式
 */
export const VALUE_QUESTIONING_FORMULA: PUAFormula = {
  id: 'value_questioning',
  name: '价值质疑式',
  category: 'suppression',
  intensity: 'moderate',
  template: '[你做的事情/你的产出] + [价值点在哪里/意义是什么] + [你要有XX意识]',
  variables: [
    {
      name: 'subject',
      description: '被质疑的对象',
      options: ['你做的事情', '你的产出', '你写的文档', '你的代码'],
    },
    {
      name: 'question',
      description: '质疑的问题',
      options: ['价值点在哪里', '意义是什么', '产生了什么价值'],
    },
    {
      name: 'awareness',
      description: '要求的意识',
      options: ['owner意识', '结果导向意识', '用户视角意识', '商业价值意识'],
    },
  ],
  examples: [
    '你做的事情，价值点在哪里？你要有owner意识。',
    '你这些产出的价值点在哪里？你要有结果导向的意识。',
    '你写这个文档的价值在哪里？你要有用户视角的意识。',
  ],
};

// ============================================================================
// 情感操纵类公式
// ============================================================================

/**
 * 辜负期待式公式
 */
export const BETRAYAL_FORMULA: PUAFormula = {
  id: 'betrayal',
  name: '辜负期待式',
  category: 'emotional',
  intensity: 'moderate',
  template: '[你真是/你真的] + [辜负了我的期望/让我很失望/我很看好你]',
  variables: [
    {
      name: 'emphasis',
      description: '强调词',
      options: ['真是', '真的', '确实', '实在是太'],
    },
    {
      name: 'betrayal',
      description: '辜负的表达',
      options: [
        '辜负了我的期望',
        '让我很失望',
        '对不起公司的培养',
        '浪费了这个机会',
      ],
    },
  ],
  examples: [
    '你真是辜负了我的期待。',
    '你真的让我很失望。',
    '你辜负了公司对你的期望。',
  ],
};

/**
 * 为你好式公式
 */
export const FOR_YOUR_GOOD_FORMULA: PUAFormula = {
  id: 'for_your_good',
  name: '为你好式',
  category: 'emotional',
  intensity: 'moderate',
  template: '[我骂你/批评你/严格要求你] + [是为了你好] + [希望你XX]',
  variables: [
    {
      name: 'action',
      description: '施加的行为',
      options: ['我骂你', '批评你', '严格要求你', '给你压力'],
    },
    {
      name: 'hope',
      description: '期望的结果',
      options: ['快速成长', '能有进步', '变得更优秀', '能独当一面'],
    },
  ],
  examples: [
    '我骂你是为了你好，希望你快速成长。',
    '批评你是为了你好，希望你能进步。',
    '严格要求你是为了你好，希望你变得更优秀。',
  ],
};

/**
 * 同甘共苦式公式
 */
export const SHARE_WEAL_WOE_FORMULA: PUAFormula = {
  id: 'share_weal_woe',
  name: '同甘共苦式',
  category: 'emotional',
  intensity: 'mild',
  template: '[靠谱的领导/优秀的团队] + [一定要] + [同甘共苦/一起奋斗]',
  variables: [
    {
      name: 'subject',
      description: '主体',
      options: ['靠谱的老板', '优秀的团队', '我们', '公司'],
    },
    {
      name: 'necessity',
      description: '必要性表达',
      options: ['一定要', '需要', '应该'],
    },
    {
      name: 'action',
      description: '共同行动',
      options: ['同甘共苦', '一起奋斗', '共渡难关', '一起拼搏'],
    },
  ],
  examples: [
    '靠谱的老板一定要跟员工一起同甘共苦。',
    '优秀的团队一定要一起奋斗，同甘共苦。',
    '在公司困难的时候，我们更要同甘共苦。',
  ],
};

// ============================================================================
// 自我洗脑类公式
// ============================================================================

/**
 * 成长绑架式公式
 */
export const GROWTH_COERCION_FORMULA: PUAFormula = {
  id: 'growth_coercion',
  name: '成长绑架式',
  category: 'brainwash',
  intensity: 'mild',
  template: '[这是个/这是] + [很好的成长机会] + [你应该XX]',
  variables: [
    {
      name: 'description',
      description: '机会描述',
      options: ['一个很好的', '一个难得的', '一个宝贵的', '一个重要的'],
    },
    {
      name: 'opportunity',
      description: '机会类型',
      options: ['成长机会', '学习机会', '锻炼机会', '展示机会'],
    },
    {
      name: 'action',
      description: '应该做什么',
      options: ['好好把握', '珍惜', '主动承担', '全力以赴'],
    },
  ],
  examples: [
    '这是个很好的成长机会，你应该好好把握。',
    '这是难得的成长机会，你要多学习。',
    '这个项目能给你很好的成长，你应该主动承担。',
  ],
};

/**
 * 磨砺考验式公式
 */
export const GRINDING_FORMULA: PUAFormula = {
  id: 'grinding',
  name: '磨砺考验式',
  category: 'brainwash',
  intensity: 'moderate',
  template: '[你要多磨練/你要经受考验] + [才能XX]',
  variables: [
    {
      name: 'process',
      description: '磨砺过程',
      options: ['多磨練', '经受住考验', '在困难中成长', '多经历挑战'],
    },
    {
      name: 'result',
      description: '磨砺后的结果',
      options: ['快速成长', '变得更强大', '承担更大责任', '独当一面'],
    },
  ],
  examples: [
    '你要多磨練，才能快速成长。',
    '你要经受住考验，才能承担更大责任。',
    '你要在困难中磨練自己，才能变得更强大。',
  ],
};

/**
 * 奉献要求式公式
 */
export const DEDICATION_FORMULA: PUAFormula = {
  id: 'dedication',
  name: '奉献要求式',
  category: 'brainwash',
  intensity: 'strong',
  template: '[公司现在XX] + [需要你/大家] + [多XX/辛苦一下]',
  variables: [
    {
      name: 'situation',
      description: '当前情况',
      options: [
        '公司现在比较困难',
        '公司现在处于关键时期',
        '公司现在正在转型',
        '现在是发展的重要阶段',
      ],
    },
    {
      name: 'target',
      description: '要求对象',
      options: ['需要你', '需要大家', '需要团队', '需要每一位员工'],
    },
    {
      name: 'dedication',
      description: '奉献内容',
      options: ['多奉献一些', '辛苦一下', '多做贡献', '共渡难关'],
    },
  ],
  examples: [
    '公司现在比较困难，需要你多奉献一些。',
    '公司现在处于关键时期，大家要辛苦一下。',
    '公司发展需要你多做贡献，共渡难关。',
  ],
};

// ============================================================================
// 压榨劳动力类公式
// ============================================================================

/**
 * 虚假承诺式公式
 */
export const FALSE_PROMISE_FORMULA: PUAFormula = {
  id: 'false_promise',
  name: '虚假承诺式',
  category: 'exploitation',
  intensity: 'moderate',
  template: '[绝对不会/一定] + [亏待你/给你回报] + [现在XX]',
  variables: [
    {
      name: 'promise',
      description: '承诺词',
      options: ['绝对不会', '一定', '肯定', '绝对不会亏待'],
    },
    {
      name: 'content',
      description: '承诺内容',
      options: ['亏待你', '给你回报', '补偿你', '让你吃亏'],
    },
    {
      name: 'condition',
      description: '当前条件',
      options: ['现在好好努力', '先好好干', '目前先做好本职', '现在先专注工作'],
    },
  ],
  examples: [
    '绝对不会亏待你的，先好好干。',
    '公司一定不会亏待你，现在好好努力。',
    '我不会亏待你的，以后有机会的。',
  ],
  companies: ['ali', 'tencent', 'meituan'],
};

/**
 * 重点培养式公式
 */
export const KEY_TALENT_FORMULA: PUAFormula = {
  id: 'key_talent',
  name: '重点培养式',
  category: 'exploitation',
  intensity: 'mild',
  template: '[你是我] + [重点培养对象/看好的员工] + [这个XX给你做]',
  variables: [
    {
      name: 'position',
      description: '定位',
      options: ['重点培养对象', '看好的员工', '核心员工', '未来的骨干'],
    },
    {
      name: 'task',
      description: '给予的任务',
      options: ['这个项目给你做', '这个机会给你', '这个任务交给你', '让你负责'],
    },
  ],
  examples: [
    '你是我重点的培养对象，这个项目给你做。',
    '我很看好你，这个机会给你。',
    '你是核心员工，这个任务交给你。',
  ],
};

/**
 * 感情绑架式公式
 */
export const EMOTIONAL_BLACKMAIL_FORMULA: PUAFormula = {
  id: 'emotional_blackmail',
  name: '感情绑架式',
  category: 'exploitation',
  intensity: 'moderate',
  template: '[在公司XX年了] + [都有感情了] + [希望XX]',
  variables: [
    {
      name: 'time',
      description: '时间',
      options: ['在公司那么多年', '工作XX年', '和公司一起XX年'],
    },
    {
      name: 'emotion',
      description: '感情描述',
      options: ['都有感情了', '有感情', '感情深厚', '有深厚的感情'],
    },
    {
      name: 'hope',
      description: '希望',
      options: [
        '希望留下来',
        '不要轻易离职',
        '继续和公司一起成长',
        '珍惜这段感情',
      ],
    },
  ],
  examples: [
    '你在公司那么多年都有感情了，希望留下来。',
    '我们一起工作这么多年，有感情了，别轻易离职。',
    '公司和你有感情了，不要轻易走。',
  ],
};

// ============================================================================
// 公式集合
// ============================================================================

/**
 * 所有PUA公式
 */
export const ALL_PUA_FORMULAS: PUAFormula[] = [
  DISAPPOINTMENT_FORMULA,
  ABILITY_DENIAL_FORMULA,
  VALUE_QUESTIONING_FORMULA,
  BETRAYAL_FORMULA,
  FOR_YOUR_GOOD_FORMULA,
  SHARE_WEAL_WOE_FORMULA,
  GROWTH_COERCION_FORMULA,
  GRINDING_FORMULA,
  DEDICATION_FORMULA,
  FALSE_PROMISE_FORMULA,
  KEY_TALENT_FORMULA,
  EMOTIONAL_BLACKMAIL_FORMULA,
];

/**
 * 按类别获取公式
 */
export function getFormulasByCategory(category: PUACategory): PUAFormula[] {
  return ALL_PUA_FORMULAS.filter((f) => f.category === category);
}

/**
 * 按强度获取公式
 */
export function getFormulasByIntensity(intensity: PUAIntensity): PUAFormula[] {
  return ALL_PUA_FORMULAS.filter((f) => {
    if (intensity === 'none') return false;
    if (intensity === 'mild') {
      return f.intensity === 'mild';
    }
    if (intensity === 'moderate') {
      return f.intensity === 'mild' || f.intensity === 'moderate';
    }
    if (intensity === 'strong') {
      return (
        f.intensity === 'mild' || f.intensity === 'moderate' || f.intensity === 'strong'
      );
    }
    return true; // extreme 包含所有
  });
}

/**
 * 按公司获取公式
 */
export function getFormulasByCompany(company: CompanyType): PUAFormula[] {
  return ALL_PUA_FORMULAS.filter((f) => !f.companies || f.companies.includes(company));
}

/**
 * 获取公式 by ID
 */
export function getFormulaById(id: string): PUAFormula | undefined {
  return ALL_PUA_FORMULAS.find((f) => f.id === id);
}

// ============================================================================
// 场景-公式映射
// ============================================================================

/**
 * 场景到公式的映射
 */
export const SCENARIO_FORMULA_MAP: Record<PUAScenario, PUAFormula[]> = {
  criticism: [
    DISAPPOINTMENT_FORMULA,
    ABILITY_DENIAL_FORMULA,
    VALUE_QUESTIONING_FORMULA,
    BETRAYAL_FORMULA,
  ],
  motivation: [
    FOR_YOUR_GOOD_FORMULA,
    GROWTH_COERCION_FORMULA,
    KEY_TALENT_FORMULA,
    SHARE_WEAL_WOE_FORMULA,
  ],
  rejection: [
    DISAPPOINTMENT_FORMULA,
    VALUE_QUESTIONING_FORMULA,
    BETRAYAL_FORMULA,
  ],
  overtime: [
    DEDICATION_FORMULA,
    FOR_YOUR_GOOD_FORMULA,
    SHARE_WEAL_WOE_FORMULA,
  ],
  salary_refuse: [
    DISAPPOINTMENT_FORMULA,
    VALUE_QUESTIONING_FORMULA,
    FALSE_PROMISE_FORMULA,
    DEDICATION_FORMULA,
  ],
  blame: [
    ABILITY_DENIAL_FORMULA,
    VALUE_QUESTIONING_FORMULA,
    BETRAYAL_FORMULA,
  ],
  praise: [
    KEY_TALENT_FORMULA,
    FALSE_PROMISE_FORMULA,
  ],
  custom: ALL_PUA_FORMULAS,
};

/**
 * 根据场景获取公式
 */
export function getFormulasByScenario(scenario: PUAScenario): PUAFormula[] {
  return SCENARIO_FORMULA_MAP[scenario] || ALL_PUA_FORMULAS;
}
