/**
 * 黑话词汇库
 *
 * @description
 * 本文件定义了各类黑话词汇，用于风格识别和转换。
 * 词汇赋能分析，形成语义闭环。
 */

import type { CompanyType } from '../../types/index.js';

// ============================================================================
// 黑话分类
// ============================================================================

/**
 * 黑话分类
 */
export type JargonCategory =
  | 'action' // 动作类：赋能、抓手、落地等
  | 'concept' // 概念类：底层逻辑、颗粒度等
  | 'data' // 数据类：DAU、GMV等
  | 'business' // 业务类：赛道、生态等
  | 'organization' // 组织类：中台、闭环等
  | 'managerial' // 管理类：对齐、复盘等
  | 'euphemism'; // 委婉类：优化、毕业等（裁员相关）

// ============================================================================
// 通用黑话词汇
// ============================================================================

/**
 * 动作类黑话（高频）
 */
export const ACTION_JARGON = [
  '赋能',
  '抓手',
  '落地',
  '闭环',
  '沉淀',
  '输出',
  '提炼',
  '包装',
  '聚焦',
  '倒逼',
  '复盘',
  '梳理',
  '跟进',
  '迭代',
  '优化',
  '升级',
  '交付',
  '上升',
  '同步',
  '对齐',
  '对标',
  '响应',
  '打通',
  '拉通',
  '击穿',
  '透传',
  '对焦',
  '拉齐',
  '对准',
  '打透',
  '深耕',
  '赋能',
  '加持',
  '反哺',
];

/**
 * 概念类黑话（中频）
 */
export const CONCEPT_JARGON = [
  '底层逻辑',
  '顶层设计',
  '颗粒度',
  '链路',
  '组合拳',
  '护城河',
  '赛道',
  '痛点',
  '痒点',
  '爽点',
  '长尾',
  '头部',
  '腰部',
  '尾部',
  '生态',
  '平台',
  '心智',
  '体感',
  '触点',
  '场景',
  '矩阵',
  '维度',
  '视角',
  '漏斗',
  '中台',
  '前台',
  '后台',
];

/**
 * 数据/绩效类黑话
 */
export const DATA_JARGON = [
  'DAU',
  'MAU',
  'GMV',
  'ARPU',
  'LTV',
  'CAC',
  'ROI',
  'OKR',
  'KPI',
  '北极星指标',
  '转化率',
  '留存率',
  '活跃度',
  '渗透率',
  '复购率',
  '客单价',
  '连带率',
  '毛利',
  '净利',
];

/**
 * 业务类黑话
 */
export const BUSINESS_JARGON = [
  '赛道',
  '护城河',
  '壁垒',
  '第二曲线',
  '飞轮',
  '破局',
  '突围',
  '下沉',
  '出海',
  '裂变',
  '获客',
  '私域',
  '公域',
  '全域',
  '全渠道',
  'O2O',
  '新零售',
  '无界零售',
];

/**
 * 组织类黑话
 */
export const ORGANIZATION_JARGON = [
  '中台',
  '前台',
  '后台',
  '闭环',
  '矩阵',
  '事业部',
  '业务线',
  '产品线',
  '技术线',
  '运营线',
  '赋能线',
];

/**
 * 管理类黑话
 */
export const MANAGERIAL_JARGON = [
  '对齐',
  '拉齐',
  '拉通',
  '复盘',
  '沉淀',
  '落地',
  '执行',
  '推进',
  '跟进',
  '追踪',
  '反馈',
  '对焦',
  '透传',
  '同步',
];

/**
 * 委婉类黑话（裁员相关）
 */
export const EUPHEMISM_JARGON = [
  '优化',
  '毕业',
  '输送社会',
  '结构调整',
  '组织焕新',
  '人员优化',
  '结构优化',
  '人员迭代',
  '优胜劣汰',
  '末位淘汰',
  '降本增效',
];

// ============================================================================
// 人话-黑话映射表
// ============================================================================

/**
 * 人话到黑话的映射表
 */
export const HUMAN_TO_JARGON_MAP: Record<string, string> = {
  // 动作类
  '帮忙': '赋能',
  '协助': '赋能',
  '方法': '抓手',
  '办法': '抓手',
  '切入点': '抓手',
  '开会': '对齐',
  '讨论': '对齐',
  '沟通': '拉通',
  '总结': '复盘',
  '总结一下': '沉淀一下',
  '归纳': '沉淀',
  '执行': '落地',
  '去做': '落地',
  '干': '落地',
  '完成': '闭环',
  '完结': '闭环',
  '自圆其说': '闭环',
  '细节': '颗粒度',
  '细致': '颗粒度',
  '流程': '链路',
  '路径': '链路',
  '本质': '底层逻辑',
  '根本': '底层逻辑',
  '原因': '底层逻辑',
  '优势': '护城河',
  '壁垒': '护城河',
  '行业': '赛道',
  '领域': '赛道',
  '问题': '痛点',
  '困难': '痛点',
  '计划': '顶层设计',
  '规划': '顶层设计',
  '给予权力': '赋能',
  '裁员': '优化',
  '辞退': '优化',
  '开除': '毕业',
  '招人': '人员迭代',
  '招聘': '人员迭代',
  '省钱': '降本增效',
  '减少成本': '降本增效',
};

// ============================================================================
// 各公司专属词汇
// ============================================================================

/**
 * 阿里专属词汇
 */
export const ALI_JARGON = {
  keywords: [
    '赋能',
    '抓手',
    '闭环',
    '中台',
    '对齐',
    '沉淀',
    '颗粒度',
    '落地',
    '复盘',
    '打法',
    '赛道',
    '护城河',
    '矩阵',
    '迭代',
    '优化',
    '拉齐',
    '聚焦',
    '倒逼',
    '梳理',
    '输出',
    '提炼',
    '包装',
    '上升',
    '透传',
    '协同',
    '联动',
    '体系',
    '机制',
    '模式',
    'owner',
    'P级',
    '阿里味',
  ],
  sentences: [
    '以XX为抓手，赋能XX生态，形成XX闭环',
    '我们要拉齐颗粒度，找到合适的抓手',
    '把这个方法论沉淀下来',
    '你需要有owner意识',
    '这个项目的底层逻辑是什么？',
    '形成价值闭环',
    '赋能业务团队',
    '打通全链路',
  ],
};

/**
 * 腾讯专属词汇
 */
export const TENCENT_JARGON = {
  keywords: [
    '赛道',
    '赛马',
    '数据',
    '产品经理',
    '护城河',
    'DAU',
    'MAU',
    '留存',
    '转化',
    '用户',
    '体验',
    '价值',
    '山头',
    '部门',
    '协同',
    '合作',
    '瑞雪',
    '活水',
    'BG',
    '总办',
    '小马哥',
  ],
  sentences: [
    '这个赛道怎么样？',
    '我们需要赛马机制',
    '数据说话',
    '产品经理怎么看？',
    '这个护城河够深吗？',
    '不符合瑞雪精神',
    '可以考虑活水到其他部门',
  ],
};

/**
 * 字节专属词汇
 */
export const BYTEDANCE_JARGON = {
  keywords: [
    'Doc',
    'Double',
    'OKR',
    'Context',
    '同步',
    '对齐',
    '优先级',
    '数据',
    '驱动',
    '快速',
    '迭代',
    '优化',
    '增长',
    '用户',
    '留存',
    '日活',
    '月活',
    '转化',
    '漏斗',
    'A/B测试',
    '灰度',
    '全量',
    '上线',
    '下线',
    '复盘',
    '总结',
    '经验',
    '复用',
    '延迟满足',
    '追求极致',
    '始终创业',
    '坦诚清晰',
  ],
  sentences: [
    '这个在Doc上同步过了',
    'Double一下',
    'Context拉齐了吗？',
    '这个事情的优先级不高',
    '看数据怎么说',
    '在Doc上讨论一下',
    '延迟满足',
    '追求极致',
  ],
};

/**
 * 美团专属词汇
 */
export const MEITUAN_JARGON = {
  keywords: [
    '长期',
    '耐心',
    'Think',
    'Long',
    'Term',
    '客户',
    '为中心',
    'ROI',
    '成本',
    '效率',
    '体验',
    '品质',
    '价值',
    '创造',
    '正确',
    '的事情',
    '低调',
    '凶猛',
    '边界',
    '无界',
    '扩张',
    '王兴',
    '饭否',
  ],
  sentences: [
    'Think Long Term',
    '长期有耐心',
    '做正确的事',
    '其他自然会来',
    '以客户为中心',
    '这个事情的ROI怎么样',
    '王兴今天在饭否上说',
  ],
};

/**
 * 华为专属词汇
 */
export const HUAWEI_JARGON = {
  keywords: [
    '胶片',
    '一线',
    '奋斗者',
    '战役',
    '拉通',
    '艰苦奋斗',
    '客户',
    '为中心',
    '自我批判',
    '持续',
    '改进',
    '以XX为本',
    '长期',
    '攻坚',
    '克难',
    '胜利',
    '打赢',
    '战场',
    '战线',
    '军团',
    '冲锋',
    '奉献',
    '牺牲',
    '狼性',
    '床垫',
    '任正非',
    '任总',
  ],
  sentences: [
    '拉通各方资源',
    '打赢这场战役',
    '以客户为中心',
    '持续艰苦奋斗',
    '准备一个关于XX的胶片',
    '华为的冬天要来了',
    '打赢这场攻坚战',
    '公司以奋斗者为本',
  ],
};

/**
 * 百度专属词汇
 */
export const BAIDU_JARGON = {
  keywords: [
    '简单',
    '可依赖',
    'AI',
    '人工智能',
    '算法',
    '技术',
    '驱动',
    '创新',
    '搜索',
    '推荐',
    '自动驾驶',
    '智能',
    '云',
    '数据',
    '计算',
    '平台',
    '生态',
    '李彦宏',
  ],
  sentences: [
    '这个方案简单可依赖',
    '用AI技术驱动',
    '让复杂的世界更简单',
    '技术驱动创新',
    '简单可依赖',
  ],
};

/**
 * 网易专属词汇
 */
export const NETEASE_JARGON = {
  keywords: [
    '态度',
    '匠心',
    '品质',
    '内容',
    '社区',
    '用户',
    '情感',
    '连接',
    '温度',
    '故事',
    '体验',
    '精品',
    '打磨',
    '时间',
    '朋友',
    '长期',
    '丁磊',
    '丁老板',
    '猪厂',
  ],
  sentences: [
    '我们要有态度',
    '用匠心打造',
    '做时间的朋友',
    '有温度的XX',
    '有态度的XX',
    '匠心品质',
  ],
};

// ============================================================================
// 词汇查询函数
// ============================================================================

/**
 * 获取指定公司的词汇表
 */
export function getCompanyKeywords(company: CompanyType): string[] {
  const keywordMap: Record<CompanyType, string[]> = {
    ali: ALI_JARGON.keywords,
    tencent: TENCENT_JARGON.keywords,
    bytedance: BYTEDANCE_JARGON.keywords,
    meituan: MEITUAN_JARGON.keywords,
    huawei: HUAWEI_JARGON.keywords,
    baidu: BAIDU_JARGON.keywords,
    netease: NETEASE_JARGON.keywords,
  };
  return keywordMap[company] || [];
}

/**
 * 获取指定公司的句式模板
 */
export function getCompanyPatterns(company: CompanyType): string[] {
  const patternMap: Record<CompanyType, string[]> = {
    ali: ALI_JARGON.sentences,
    tencent: TENCENT_JARGON.sentences,
    bytedance: BYTEDANCE_JARGON.sentences,
    meituan: MEITUAN_JARGON.sentences,
    huawei: HUAWEI_JARGON.sentences,
    baidu: BAIDU_JARGON.sentences,
    netease: NETEASE_JARGON.sentences,
  };
  return patternMap[company] || [];
}

/**
 * 获取所有黑话词汇
 */
export function getAllJargonWords(): string[] {
  return [
    ...ACTION_JARGON,
    ...CONCEPT_JARGON,
    ...DATA_JARGON,
    ...BUSINESS_JARGON,
    ...ORGANIZATION_JARGON,
    ...MANAGERIAL_JARGON,
    ...EUPHEMISM_JARGON,
  ];
}

/**
 * 检查词是否为黑话
 */
export function isJargonWord(word: string): boolean {
  return getAllJargonWords().includes(word);
}

/**
 * 人话转黑话
 */
export function humanToJargon(text: string): string {
  let result = text;
  for (const [human, jargon] of Object.entries(HUMAN_TO_JARGON_MAP)) {
    const regex = new RegExp(human, 'g');
    result = result.replace(regex, jargon);
  }
  return result;
}
