export const resume = {
  name: '曹福晶',
  englishName: 'FUJING CAO',
  title: 'AI 全栈开发工程师',
  intro: '用 AI 工程方法加速从需求理解、代码实现到测试交付，把复杂业务落成可维护的产品体验。',
  location: '杭州',
  phone: '17384340081',
  email: '1805150751@qq.com',
  availability: '期望城市：杭州',
  workflow: [
    { number: '01', label: 'AI 辅助', detail: 'Context / Prompt / Loop Engineering，结合 RAG、MCP、LangChain、LangGraph 与 Codex、Claude。', accent: '理解需求' },
    { number: '02', label: '代码 coding', detail: 'React、TypeScript、微前端、服务端 API 与 Harness 工程化流程协同实现。', accent: '快速实现' },
    { number: '03', label: '需求交付', detail: '围绕业务迭代、问题排查与测试验证，交付可用、可维护、能持续演进的功能。', accent: '验证上线' },
  ],
  skills: [
    { id: 'ai', title: 'AI 工程', note: '工作流与智能应用', items: ['Context Engineering', 'Prompt Engineering', 'Loop Engineering', 'RAG', 'MCP', 'LangChain / LangGraph', 'Claude Code', 'Codex'] },
    { id: 'server', title: '服务端', note: '接口与业务服务', items: ['Express / Koa', 'Java', 'FastAPI', 'Spring Boot', 'RESTful API', '微服务', 'Git'] },
    { id: 'frontend', title: '前端', note: '体验与工程实现', items: ['React', 'Vue', 'TypeScript', 'React Native', 'Flutter', 'Next.js', '微前端'] },
    { id: 'data', title: '数据库 / 中间件', note: '稳定的数据基础', items: ['MySQL', 'PostgreSQL', 'Redis', 'MongoDB', 'RabbitMQ', 'Kafka', 'Elasticsearch'] },
  ],
  experiences: [
    {
      id: 'xiaoying', organization: '杭州小影创新科技股份有限公司', role: 'AI 全栈开发工程师', period: '2026.04 — 至今',
      description: '在真实业务中把 AI 辅助编码融入前后端开发，连接需求理解、方案实现与测试验证。',
      highlights: ['参与 VCM 微前端管理平台功能开发、迭代维护，按现有架构完成业务需求交付、功能优化与问题排查。', '参与 WiseMeal、VivaVideo 服务端功能开发维护，完成接口开发、业务逻辑实现与问题排查。', '结合 Codex、Claude 与 Harness 工程化流程辅助代码分析、方案实现、调试和测试验证。'],
      tags: ['VCM', 'WiseMeal', 'VivaVideo', 'Codex / Claude', 'Harness'],
    },
    {
      id: 'mita', organization: '杭州米塔碳智能科技有限公司', role: '前端开发工程师', period: '2026.01 — 2026.04',
      description: '独立负责前端项目开发维护，也与后端协作推进多个项目，持续把产品需求落成响应式页面。',
      highlights: ['负责页面设计、React 编写与调试，按产品需求实现多个响应式页面。', '参与多个项目的前端开发，与后端协作保证项目进度与交付质量。'],
      tags: ['React', '响应式页面', '协作交付'],
    },
  ],
  projects: [
    {
      id: 'vcm', name: 'VCM 微前端后台', type: '内部管理平台 / AI 全栈开发工程师', period: '2026.04 — 至今', url: null,
      description: '面向内部平台与相关产品的后台业务，通过 React、Node.js 和微前端串联界面、服务端接口与业务需求，以 AI 辅助开发推进全栈交付。',
      stack: 'React + Node.js + Koa + 微前端 + AI',
      highlights: ['使用 Node.js 的 Koa 框架开发内部平台服务端接口，承接平台业务逻辑。', '负责微前端项目架构的实现，将相关产品的后台业务接入平台。', '负责相关产品的后台业务需求实现，结合 AI 辅助完成代码理解、开发与调试。'],
      tags: ['Koa 接口开发', '微前端架构', '后台业务', 'AI 辅助开发'],
    },
    {
      id: 'wisemeal', name: 'WiseMeal', type: 'AI 健康管理 App / Java 开发', period: '2026.07 — 至今', url: 'https://www.wisemeal.org/',
      description: '一款 AI 饮食与运动管理应用，通过食物拍照识别、卡路里与营养记录，以及个性化饮食和运动建议，帮助用户记录摄入与消耗，持续进行体重管理。',
      stack: 'Java + AI 算法服务集成 + AI 辅助开发 + Harness',
      highlights: ['承担 Java 服务端开发，围绕产品业务需求实现服务端接口与业务逻辑。', '对接上游算法服务，将相关 AI 能力整合到产品业务流程中。', '通过 AI 辅助开发结合 Harness 工程化流程，推进业务实现、调试与测试验证。'],
      tags: ['Java 服务端', 'AI 服务集成', '卡路里管理', 'Harness'],
    },
    {
      id: 'power-forecast', name: '新能源功率预测系统', type: '项目经历 / 前端开发工程师', period: '2026.01 — 2026.04', url: null,
      description: '面向新能源功率预测业务，负责页面布局、交互实现和前端性能优化，把 vibe-coding 变成可控的开发流程。',
      stack: 'React + umi/max.js + TypeScript + Ant Design + Ant Design Pro + Zustand',
      highlights: ['使用 React、Less、Tailwind CSS 完成前端页面设计布局与交互。', '配合 Gemini 3 Pro 与 GPT-5 进行 vibe-coding，手动编写提示词，优化 AI 编程准确率与效率。', '压缩静态资源，并借助 AI 工具抽离公共组件，提高开发效率与复用性。'],
      tags: ['vibe-coding', 'Gemini 3 Pro', 'GPT-5', '性能优化'],
    },
  ],
  education: [
    { school: '杭州师范大学', degree: '硕士 · 软件工程', period: '2023 — 2026', detail: '两次研究生三等奖学金；担任“发归处”助理；发表路径规划相关会议论文 1 篇。' },
    { school: '铜陵学院', degree: '本科 · 计算机科学与技术', period: '2019 — 2023', detail: '多次校级一等奖学金；全国大学生数学竞赛省级三等奖；大创“移动边缘计算环境下无人驾驶物流车的任务卸载策略研究”获国奖；创业计划书设计大赛“饭包”获三等奖；任大学生创业协会实践策划部部长。' },
  ],
} as const;

export type Resume = typeof resume;
