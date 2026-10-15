<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { Canvas } from '@threlte/core';
  import { ArrowDownToLine, Check, RotateCcw, SlidersHorizontal, X } from '@lucide/svelte';
  import { Vector2, WebGLRenderer, type Camera, type Scene } from 'three';
  import BackgroundScene from './lib/BackgroundScene.svelte';
  import Resume from './lib/Resume.svelte';

  const forms = [
    { id: 'orbit', name: '星环' },
    { id: 'ribbon', name: '涡流' },
    { id: 'stack', name: '脉冲' },
  ] as const;
  const palettes = [
    { name: '极光青蓝', color: '#5eead4' },
    { name: '电光紫', color: '#b495ff' },
    { name: '冰川蓝', color: '#64b9ff' },
    { name: '熔岩橙', color: '#ff9966' },
  ];

  let variant = $state<'orbit' | 'ribbon' | 'stack'>('orbit');
  let palette = $state(palettes[0]!);
  let reducedMotion = $state(false);
  let pageVisible = $state(true);
  let inView = $state(true);
  let hovered = $state(false);
  let focused = $state(false);
  let settingsOpen = $state(false);
  let supported = $state(false);
  let ready = $state(false);
  let failed = $state(false);
  let exporting = $state(false);
  let status = $state('');
  let background: HTMLElement;
  let controls: HTMLElement;
  let settingsToggle: HTMLButtonElement;
  let renderContext: { renderer: WebGLRenderer; scene: Scene; camera: Camera } | undefined;
  let statusTimer: ReturnType<typeof setTimeout>;
  const playing = $derived(!reducedMotion && pageVisible && inView && !failed && !(settingsOpen && (hovered || focused)) && !exporting);

  function createRenderer(canvas: HTMLCanvasElement) {
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true });
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      failed = true;
      ready = false;
    });
    canvas.addEventListener('webglcontextrestored', () => {
      if (!renderContext) return;
      try {
        renderer.render(renderContext.scene, renderContext.camera);
        failed = false;
        ready = true;
      } catch {
        failed = true;
        ready = false;
      }
    });
    return renderer;
  }

  function handleReady(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
    renderContext = { renderer, scene, camera };
    renderer.render(scene, camera);
    ready = true;
  }

  function announce(message: string) {
    clearTimeout(statusTimer);
    status = message;
    statusTimer = setTimeout(() => { status = ''; }, 4000);
  }

  async function exportBackground() {
    if (!renderContext || !ready || exporting) return;
    exporting = true;
    await tick();
    const { renderer, scene, camera } = renderContext;
    const size = renderer.getSize(new Vector2());
    const pixelRatio = renderer.getPixelRatio();
    try {
      renderer.setPixelRatio(1);
      renderer.setSize(Math.round(size.x * 2), Math.round(size.y * 2), false);
      renderer.render(scene, camera);
      const blob = await new Promise<Blob | null>((resolve) => renderer.domElement.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('PNG encoding failed');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume-background-${variant}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      announce('已导出高清 PNG 背景');
    } catch {
      announce('导出失败，请重试或换一个浏览器');
    } finally {
      const currentSize = background.getBoundingClientRect();
      renderer.setSize(currentSize.width || size.x, currentSize.height || size.y, false);
      renderer.setPixelRatio(pixelRatio);
      renderer.render(scene, camera);
      exporting = false;
    }
  }

  async function toggleSettings() {
    settingsOpen = !settingsOpen;
    if (settingsOpen) {
      await tick();
      controls.querySelector<HTMLButtonElement>('.form-option')?.focus();
    }
  }

  function closeSettings() {
    settingsOpen = false;
    settingsToggle.focus();
  }

  function reset() {
    variant = 'orbit';
    palette = palettes[0]!;
    announce('已恢复默认背景');
  }

  onMount(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => { reducedMotion = preference.matches; };
    const updateVisibility = () => { pageVisible = !document.hidden; };
    updatePreference();
    updateVisibility();
    preference.addEventListener('change', updatePreference);
    document.addEventListener('visibilitychange', updateVisibility);
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      supported = !!context;
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { supported = false; }
    const observer = new IntersectionObserver(([entry]) => { inView = entry?.isIntersecting ?? false; });
    observer.observe(background);
    return () => {
      clearTimeout(statusTimer);
      preference.removeEventListener('change', updatePreference);
      document.removeEventListener('visibilitychange', updateVisibility);
      observer.disconnect();
    };
  });
</script>

<svelte:window
  onkeydown={(event) => { if (event.key === 'Escape' && settingsOpen) closeSettings(); }}
  onpointerdown={(event) => { if (settingsOpen && !controls.contains(event.target as Node)) settingsOpen = false; }}
/>

<main class="background-page">
  <div class="resume-background" bind:this={background} data-ready={ready} data-playing={playing && ready} data-variant={variant} data-color={palette.color} aria-hidden="true">
    <div class="scene-fallback" style:--glow-color={palette.color}><div class="fallback-orbit"></div></div>
    <div class="canvas-layer" class:canvas-ready={ready && !failed}>
      {#if supported}
        <svelte:boundary onerror={() => { failed = true; ready = false; }}>
          <Canvas {createRenderer} dpr={1.5} renderMode="on-demand">
            <BackgroundScene color={palette.color} {variant} {playing} onready={handleReady} />
          </Canvas>
          {#snippet failed()}<span class="sr-only">3D 渲染不可用</span>{/snippet}
        </svelte:boundary>
      {/if}
    </div>
  </div>

  <div class="resume-content"><Resume /></div>
</main>

<aside class="background-controls" bind:this={controls} aria-label="背景控制"
  onpointerenter={() => { hovered = true; }}
  onpointerleave={() => { hovered = false; }}
  onfocusin={() => { focused = true; }}
  onfocusout={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) focused = false; }}>
  {#if settingsOpen}
    <section id="background-settings" class="settings-panel" aria-labelledby="settings-title">
      <div class="settings-heading"><h2 id="settings-title">背景设置</h2><button class="icon-button close-button" onclick={closeSettings} aria-label="关闭背景设置"><X size={17} /></button></div>
      <fieldset><legend>形态</legend><div class="form-options">{#each forms as form}<button class="form-option" class:selected={variant === form.id} aria-pressed={variant === form.id} onclick={() => { variant = form.id; }}>{form.name}</button>{/each}</div></fieldset>
      <fieldset><legend>配色<span>{palette.name}</span></legend><div class="palette-options">{#each palettes as item}<button class="color-option" class:selected={palette.color === item.color} style:--swatch={item.color} aria-label={item.name} aria-pressed={palette.color === item.color} onclick={() => { palette = item; }}><span>{#if palette.color === item.color}<Check size={16} strokeWidth={1.8} />{/if}</span></button>{/each}</div></fieldset>
      <div class="settings-actions"><button class="export-button" onclick={exportBackground} disabled={!ready || exporting || failed}><ArrowDownToLine size={15} />{exporting ? '正在导出…' : '导出 PNG · 2×'}</button><button class="icon-button" onclick={reset} aria-label="恢复默认背景" title="恢复默认"><RotateCcw size={16} /></button></div>
      {#if failed || !supported}<p class="fallback-note">浏览器暂不支持 3D，已显示静态背景</p>{/if}
    </section>
  {/if}
  <div class="control-buttons">
    <button class="icon-button floating-button" class:active={settingsOpen} bind:this={settingsToggle} onclick={toggleSettings} aria-label="背景设置" aria-controls="background-settings" aria-expanded={settingsOpen} title="背景设置"><SlidersHorizontal size={17} /></button>
  </div>
</aside>

<div class="toast" class:visible={status !== ''} role="status" aria-live="polite">{#if status}<Check size={16} />{status}{/if}</div>
