# 全屏 3D 动态背景

使用 Svelte 5、Threlte 与 Three.js 实现的全屏能量星环背景。包含流光轨道、分层 3D 星场、核心脉冲与鼠标视差，不需要外部图片或 HDR 素材。

```bash
npm install
npm run dev
```

远、中、近三层星点随鼠标产生不同幅度的空间视差。右下角仅保留背景设置，可切换形态、配色并导出当前画幅的 2× PNG，已移除暂停开关。系统启用 `prefers-reduced-motion`、切换到后台或背景离屏时，连续动画和鼠标跟随会停止；在设置面板内操作及导出时临时停止动画。

背景由 `src/lib/BackgroundScene.svelte` 绘制，`src/App.svelte` 负责全屏容器和控制。`src/lib/Resume.svelte` 展示 AI 全栈开发简历，真实资料与内容结构集中在 `src/lib/resume.ts` 的 `resume` 对象；替换数据即可更新页面内容。页面以“AI 辅助 → 代码 coding → 需求交付”为主线，包含技能、项目、经历、教育和联系我分区。

简历放在 `.resume-content` 层，背景固定在视口中，不拦截鼠标或触屏操作。深色正文面板保证可读性，手机使用单栏布局。

```bash
npm run check
npm run build
```
