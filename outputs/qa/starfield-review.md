# 全屏 3D 星空与鼠标视差检查

## 本轮改动

- `BackgroundScene.svelte` 保留能量星环，新增远、中、近三层独立 Points 星场，最多 4000 星点。各层具有不同深度、尺寸、亮度与鼠标视差，近星包含少量十字星光。
- `star-field.ts` 使用固定种子生成星点，按视口面积调整 drawRange；normalized 坐标在 shader 中按深度投影，预留四边余量。
- 指针移出窗口时平滑回中；失焦、页面隐藏、系统 reduced-motion 时清除视差并重绘。事件监听与手动创建的 GPU 资源在销毁时释放。
- `App.svelte` 按用户明确要求移除暂停/播放开关；保留形态、配色及 2× PNG 导出。关闭设置面板后恢复动画，系统 reduced-motion 和后台停止条件继续生效。
- 简历首屏遮罩限定为 100svh，正文遮罩调整为 desktop .84 / mobile .88；保留可读性并增加星光透出。

## 实际执行

- `npm run check`：0 errors / 0 warnings，退出码 0。
- `npm run build`：成功，退出码 0；主 JS 847.25 kB（gzip 226.53 kB），保留 Vite 的 >500 kB chunk 告警。
- 当前 Vite 的 `/src/lib/BackgroundScene.svelte` 编译请求：HTTP 200。
- 源码搜索：`src` 中没有 `motion-toggle`、`paused` 或 Pause / Play 图标引用。
- 子代理只读复核：播放条件、指针回中、reduce、监听与资源清理未发现阻断问题。
- 离线 Three.js 投影检查：375×844、768×1024、1280×900、1920×1080，9 个指针位置 × 3 个时间，共 108 个样本。四边 10% 区域、四象限及 6×4 网格均有星点。原始数据见 `star-projection.json`。

离线投影仅证明生成坐标和变换数学上的覆盖，不证明 GLSL 在 GPU 上编译成功、实际亮度、正文对比度或性能。

## 未完成的浏览器验收

本轮没有浏览器截图或实际鼠标交互验证。此前 headless Chrome 启动失败（SIGABRT / TargetClosedError / EPERM），Chrome Computer Use 操作也未获批准；未重复启动或通过其他入口绕过拒绝。失败记录保留在 `headless/report.json`。

375 / 768 / 1280 / 1920 的 normal / reduce 真实截图、鼠标视差观感、首屏及履历/联系区的星光亮度、运行时 reduce 切换、窗口离开/返回和 PNG 导出仍待浏览器检查。本轮只做源码与数学复核，不计作完成视觉自检轮次。

在浏览器可运行的环境可执行：

```bash
uv run .agents/skills/tender-ui-skill/scripts/shoot.py 'http://[::1]:5174/' --audit --full --reduced-motion --sections '#experience,#projects,#contact' --ready-js 'document.querySelector(".resume-background")?.dataset.ready === "true"' --out shots/starfield
```

截图之后仍需手动移动指针、失焦/返回、切换系统 reduce 并导出 PNG。
