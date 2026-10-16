<script lang="ts">
  import { onMount } from 'svelte';
  import { Canvas } from '@threlte/core';
  import { WebGLRenderer, type Camera, type Scene } from 'three';
  import BackgroundScene from './lib/BackgroundScene.svelte';
  import Resume from './lib/Resume.svelte';

  const variant = 'orbit' as const;
  const backgroundColor = '#cf4410';
  let reducedMotion = $state(false);
  let pageVisible = $state(true);
  let inView = $state(true);
  let supported = $state(false);
  let ready = $state(false);
  let failed = $state(false);
  let background: HTMLElement;
  let renderContext: { renderer: WebGLRenderer; scene: Scene; camera: Camera } | undefined;
  const playing = $derived(!reducedMotion && pageVisible && inView && !failed);

  function createRenderer(canvas: HTMLCanvasElement) {
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false });
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
      preference.removeEventListener('change', updatePreference);
      document.removeEventListener('visibilitychange', updateVisibility);
      observer.disconnect();
    };
  });
</script>

<main class="background-page">
  <div class="resume-background" bind:this={background} data-ready={ready} data-playing={playing && ready} data-variant={variant} data-color={backgroundColor} aria-hidden="true">
    <div class="scene-fallback" style:--glow-color={backgroundColor}><div class="fallback-orbit"></div></div>
    <div class="canvas-layer" class:canvas-ready={ready && !failed}>
      {#if supported}
        <svelte:boundary onerror={() => { failed = true; ready = false; }}>
          <Canvas {createRenderer} dpr={1.5} renderMode="on-demand">
            <BackgroundScene color={backgroundColor} {variant} {playing} onready={handleReady} />
          </Canvas>
          {#snippet failed()}<span class="sr-only">3D 渲染不可用</span>{/snippet}
        </svelte:boundary>
      {/if}
    </div>
  </div>

  <div class="resume-content"><Resume /></div>
</main>
