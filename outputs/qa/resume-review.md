# 简历 mock 数据接入记录

- 数据：`src/lib/mockResume.ts`，示例人物、6 项技能、2 段工作经历、3 个项目、教育与 example.com 邮箱。
- 展示：`src/lib/Resume.svelte`，正文叠加在固定的全屏 Threlte 背景上；页首和页尾标注 mock 数据。
- 源码复核：标题按语义断行、正文增加深色遮罩、窄屏改为单列、底部预留控制区、链接具有焦点状态。
- 实际执行：`npm run check` 0 errors / 0 warnings；`npm run build` 成功；Vite 编译后的 Resume.svelte 请求返回 HTTP 200。
- 构建告警：包含 Three.js 的主 JS chunk 超过 500 kB，约 845 kB（gzip 约 226 kB），未额外引入依赖。

## 未完成的验证

375 / 768 / 1280 / 1920 的真实截图、normal / reduced-motion、运行时偏好切换、锚点键盘导航、邮箱复制和 WebGL PNG 导出尚未浏览器验收。

本会话的独立 Chrome 在启动时遇到 SIGABRT / TargetClosedError / EPERM，报告位于 `headless/report.json`，没有生成页面截图；Chrome Computer Use 未获批准，因此未再次操作该浏览器。源码审核不等于浏览器验收。

可在具备浏览器运行权限的环境执行：

```bash
uv run .agents/skills/tender-ui-skill/scripts/shoot.py 'http://[::1]:5174/' --audit --full --reduced-motion --sections '#experience,#projects,#contact' --ready-selector '#profile-name' --out shots/resume
```
