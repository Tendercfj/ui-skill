<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { T, useTask, useThrelte } from '@threlte/core';
  import { createStarField, getStarDrawCount, type StarFieldSettings } from './star-field';
  import {
    BufferAttribute,
    BufferGeometry,
    CatmullRomCurve3,
    Color,
    NoBlending,
    NormalBlending,
    ShaderMaterial,
    SphereGeometry,
    TubeGeometry,
    Vector2,
    Vector3,
    type Camera,
    type Group,
    type PerspectiveCamera,
    type Scene,
    type WebGLRenderer,
  } from 'three';

  interface Props {
    color?: string;
    playing?: boolean;
    variant?: 'orbit' | 'ribbon' | 'stack';
    onready?: (renderer: WebGLRenderer, scene: Scene, camera: Camera) => void;
  }

  let { color = '#d4512d', playing = false, variant = 'orbit', onready }: Props = $props();

  const { renderer, scene, size, invalidate } = useThrelte();
  const background = new Color('#faf9f7');
  const pointer = new Vector2();
  const pointerTarget = new Vector2();
  const drawingBufferSize = new Vector2();
  let camera = $state.raw<PerspectiveCamera>();
  let sculpture = $state.raw<Group>();
  let reducedMotion = $state(false);
  let pageVisible = $state(true);
  let inView = $state(true);
  let elapsed = 0;

  const aspect = $derived($size.width / Math.max($size.height, 1));
  const cameraDistance = $derived(Math.max(11.5, 6 / Math.max(aspect, 0.35)));
  const halfHeight = $derived(Math.tan(22.5 * Math.PI / 180) * cameraDistance);
  const halfWidth = $derived(halfHeight * aspect);
  const centerX = $derived(halfWidth * (aspect >= 1.3 ? 0.34 : 0.12));
  const centerY = $derived(aspect < 1.3 ? -halfHeight * 0.42 : 0);
  const sculptureScale = $derived(aspect < 0.6 ? 0.67 : aspect < 1.3 ? 0.76 : 1);

  const noise = `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise2(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
    }
    float cloud(vec2 p) {
      return noise2(p) * 0.57 + noise2(p * 2.07) * 0.28 + noise2(p * 4.13) * 0.15;
    }
  `;
  const surfaceVertex = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vView;
    varying vec3 vLocal;
    void main() {
      vUv = uv;
      vLocal = position;
      vec4 world = modelMatrix * vec4(position, 1.0);
      vNormal = normalize(mat3(modelMatrix) * normal);
      vView = normalize(cameraPosition - world.xyz);
      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `;
  const tubeFragment = `
    uniform float uTime;
    uniform float uOffset;
    uniform float uSpeed;
    uniform float uGlow;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      float facing = pow(abs(dot(normalize(vNormal), normalize(vView))), 1.7);
      float travel = fract(vUv.x * 3.0 - uTime * uSpeed + uOffset);
      float streak = exp(-travel * 28.0);
      float fine = pow(0.5 + 0.5 * sin(vUv.x * 301.59 - uTime * 2.0), 5.0);
      float pulse = 0.82 + 0.18 * sin(uTime * 1.1 + uOffset * 6.28);
      vec3 ember = vec3(0.84, 0.22, 0.09);
      vec3 accent = mix(uColor, ember, 0.24 + uOffset * 0.18);
      vec3 base = mix(vec3(0.13, 0.105, 0.09), accent, 0.38);
      vec3 light = mix(base, vec3(1.0, 0.72, 0.49), streak * 0.72);
      float strength = 0.18 + streak * 1.15 + fine * 0.07;
      float alpha = mix(0.48, facing * 0.14, uGlow) * pulse;
      gl_FragColor = vec4(light * strength * mix(1.0, 0.58, uGlow), alpha);
      #include <colorspace_fragment>
    }
  `;

  function shader(fragmentShader: string, uniforms: ShaderMaterial['uniforms'], vertexShader = surfaceVertex) {
    return new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: NormalBlending,
      depthWrite: false,
      toneMapped: false,
    });
  }

  const colorUniform = () => ({ value: new Color('#d4512d') });
  const timeUniform = () => ({ value: 0 });
  const ringMaterials = Array.from({ length: 3 }, (_, index) => [0, 1].map((glow) => shader(tubeFragment, {
    uTime: timeUniform(),
    uColor: colorUniform(),
    uOffset: { value: index * 0.29 },
    uSpeed: { value: 0.12 + index * 0.038 },
    uGlow: { value: glow },
  }))).map(([core, glow]) => {
    core.blending = NormalBlending;
    return [core, glow];
  });

  const coreMaterial = shader(`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec3 vNormal;
    varying vec3 vView;
    varying vec3 vLocal;
    void main() {
      float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.4);
      float angle = atan(vLocal.z, vLocal.x);
      float bands = pow(0.5 + 0.5 * sin(vLocal.y * 19.0 + angle * 4.0 - uTime * 0.9
        + sin(vLocal.x * 8.0 + uTime * 0.35)), 5.0);
      float pulse = 0.83 + 0.17 * sin(uTime * 1.15);
      vec3 ember = mix(uColor, vec3(0.86, 0.24, 0.10), 0.34);
      vec3 energy = mix(vec3(0.12, 0.095, 0.08), ember, 0.26 + rim * 0.58);
      gl_FragColor = vec4(energy * (0.44 + rim * 1.05 + bands * 0.28) * pulse,
        0.18 + rim * 0.68 + bands * 0.10);
      #include <colorspace_fragment>
    }
  `, { uTime: timeUniform(), uColor: colorUniform() });
  coreMaterial.blending = NormalBlending;

  const haloMaterial = shader(`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      float radius = length(vUv - 0.5) * 2.0;
      float glow = exp(-radius * radius * 8.0);
      float pulse = 0.75 + 0.25 * sin(uTime * 1.15);
      gl_FragColor = vec4(uColor * 0.42, glow * 0.09 * pulse);
      #include <colorspace_fragment>
    }
  `, { uTime: timeUniform(), uColor: colorUniform() });

  const nebulaMaterial = shader(`
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uBase;
    varying vec2 vUv;
    ${noise}
    void main() {
      vec2 p = (vUv - 0.5) * vec2(3.6, 2.6);
      float mist = cloud(p * 3.0 + vec2(uTime * 0.007, -uTime * 0.004));
      float ember = exp(-length((p - vec2(0.28, -0.06)) * vec2(1.3, 1.6)) * 2.6);
      float charcoal = exp(-length((p - vec2(0.9, 0.4)) * vec2(1.2, 1.5)) * 2.0);
      vec3 atmosphere = uBase + uColor * ember * mist * 0.022
        + vec3(0.54, 0.16, 0.06) * ember * mist * 0.035
        - vec3(0.08, 0.055, 0.04) * charcoal * mist * 0.025;
      gl_FragColor = vec4(atmosphere, 1.0);
      #include <colorspace_fragment>
    }
  `, { uTime: timeUniform(), uColor: colorUniform(), uBase: { value: background.clone() } });
  nebulaMaterial.blending = NoBlending;
  nebulaMaterial.transparent = false;
  nebulaMaterial.depthTest = false;

  const pointsVertex = `
    uniform float uTime;
    uniform float uDpr;
    uniform float uVariant;
    uniform float uOrbit;
    attribute float aSeed;
    attribute float aSize;
    varying float vSeed;
    varying float vOpacity;
    void main() {
      vSeed = aSeed;
      vec3 p = position;
      if (uOrbit > 0.5) {
        float angle = uTime * (0.16 + aSeed * 0.22) * (1.0 + uVariant * 0.18);
        mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        p.xz = rotation * p.xz;
        p.y += sin(uTime * 0.48 + aSeed * 35.0) * 0.16;
        vOpacity = 0.32 + 0.58 * pow(0.5 + 0.5 * sin(uTime * 1.3 + aSeed * 60.0), 3.0);
      } else {
        vOpacity = 0.30 + 0.30 * sin(uTime * (0.3 + aSeed * 0.45) + aSeed * 70.0);
      }
      vec4 view = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * view;
      float attenuation = uOrbit > 0.5 ? clamp(13.0 / -view.z, 0.5, 2.2) : clamp(38.0 / -view.z, 0.45, 1.4);
      gl_PointSize = aSize * uDpr * attenuation;
    }
  `;
  const pointsFragment = `
    uniform vec3 uColor;
    uniform float uOrbit;
    varying float vSeed;
    varying float vOpacity;
    void main() {
      float distanceToCenter = length(gl_PointCoord - 0.5) * 2.0;
      if (distanceToCenter > 1.0) discard;
      float glow = exp(-distanceToCenter * distanceToCenter * 5.0);
      float pin = pow(max(1.0 - distanceToCenter, 0.0), 10.0);
      vec3 tint = mix(uColor, vec3(0.82, 0.20, 0.07), step(0.66, vSeed) * 0.42);
      tint = mix(tint, vec3(0.20, 0.16, 0.13), (1.0 - uOrbit) * 0.28);
      gl_FragColor = vec4(tint * (0.52 + pin * 1.22), glow * vOpacity * mix(0.36, 0.72, uOrbit));
      #include <colorspace_fragment>
    }
  `;
  const particleMaterial = shader(pointsFragment, {
    uTime: timeUniform(), uColor: colorUniform(), uDpr: { value: 1.5 }, uVariant: { value: 0 }, uOrbit: { value: 1 },
  }, pointsVertex);
  particleMaterial.blending = NormalBlending;
  const starsVertex = `
    uniform float uTime;
    uniform float uDpr;
    uniform float uAspect;
    uniform float uCameraDistance;
    uniform float uParallax;
    uniform float uOpacity;
    uniform vec2 uPointer;
    attribute float aSeed;
    attribute float aSize;
    attribute float aSparkle;
    varying float vSeed;
    varying float vOpacity;
    varying float vSparkle;
    void main() {
      vSeed = aSeed;
      vSparkle = aSparkle;
      float angle = -uPointer.x * uParallax * 0.14;
      mat2 turn = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      vec2 frame = turn * position.xy;
      frame += vec2(-uPointer.x, uPointer.y) * uParallax;
      frame += vec2(sin(uTime * 0.035 + aSeed * 34.0), cos(uTime * 0.028 + aSeed * 27.0))
        * uParallax * 0.10;
      float distanceToCamera = uCameraDistance - position.z;
      float halfHeight = distanceToCamera * 0.41421356;
      vec3 world = vec3(frame.x * halfHeight * uAspect, frame.y * halfHeight, position.z);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
      float depthSize = clamp(uCameraDistance / distanceToCamera + 0.65, 0.7, 1.3);
      gl_PointSize = aSize * uDpr * depthSize;
      float shimmer = 0.84 + 0.16 * sin(uTime * (0.30 + aSeed * 0.38) + aSeed * 70.0);
      vOpacity = uOpacity * (0.48 + aSeed * 0.52) * shimmer;
    }
  `;
  const starsFragment = `
    uniform vec3 uColor;
    varying float vSeed;
    varying float vOpacity;
    varying float vSparkle;
    void main() {
      vec2 p = (gl_PointCoord - 0.5) * 2.0;
      float radius = length(p);
      float glow = exp(-radius * radius * 7.5);
      float pin = exp(-radius * radius * 38.0);
      float cross = exp(-abs(p.x) * 34.0 - abs(p.y) * 4.8)
        + exp(-abs(p.y) * 34.0 - abs(p.x) * 4.8);
      float fade = 1.0 - smoothstep(0.80, 1.0, max(abs(p.x), abs(p.y)));
      float alpha = (glow * 0.75 + pin * 0.45 + cross * vSparkle * 0.38) * fade;
      vec3 tint = mix(vec3(0.18, 0.14, 0.11), vec3(0.92, 0.46, 0.23), vSeed);
      tint = mix(tint, uColor, 0.18);
      gl_FragColor = vec4(tint * (0.56 + pin * 0.62), min(alpha * vOpacity, 0.72));
      #include <colorspace_fragment>
    }
  `;
  const starConfigs: (StarFieldSettings & { name: string; parallax: number; opacity: number })[] = [
    { name: 'far', count: 2300, seed: 113, depth: [48, 78], size: [0.8, 1.5], sparkle: 0, parallax: 0.018, opacity: 0.22 },
    { name: 'middle', count: 1200, seed: 277, depth: [18, 44], size: [1.15, 2.8], sparkle: 0.004, parallax: 0.046, opacity: 0.34 },
    { name: 'near', count: 500, seed: 419, depth: [3, 14], size: [1.9, 4.8], sparkle: 0.06, parallax: 0.095, opacity: 0.46 },
  ];
  const starLayers = starConfigs.map((config) => {
    const material = shader(starsFragment, {
      uTime: timeUniform(), uColor: colorUniform(), uDpr: { value: 1.5 },
      uAspect: { value: 1 }, uCameraDistance: { value: 11.5 },
      uPointer: { value: pointer }, uParallax: { value: config.parallax }, uOpacity: { value: config.opacity },
    }, starsVertex);
    material.blending = NormalBlending;
    return { ...config, geometry: createStarField(config), material };
  });
  const materials = [...ringMaterials.flat(), coreMaterial, haloMaterial, nebulaMaterial, particleMaterial,
    ...starLayers.map((layer) => layer.material)];

  // Read the actual target size, including the temporarily enlarged PNG buffer.
  function updatePointResolution(activeRenderer: WebGLRenderer) {
    const scale = activeRenderer.getDrawingBufferSize(drawingBufferSize).y / Math.max(size.current.height, 1);
    particleMaterial.uniforms.uDpr.value = scale;
    for (const layer of starLayers) layer.material.uniforms.uDpr.value = scale;
  }

  // A seeded distribution remains stable across settings, reloads, and PNG export.
  let seed = 37;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  function createParticles(count: number) {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = random() * Math.PI * 2;
      const radius = 1.25 + random() * 1.9;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (random() - 0.5) * 2.6;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      seeds[i] = random();
      sizes[i] = 1.2 + random() * 2.8;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));
    geometry.setAttribute('aSize', new BufferAttribute(sizes, 1));
    geometry.computeBoundingSphere();
    return geometry;
  }

  type Form = NonNullable<Props['variant']>;
  type Ring = { core: TubeGeometry; glow: TubeGeometry; rotation: [number, number, number]; position: [number, number, number] };
  const forms: Record<Form, Ring[]> = { orbit: [], ribbon: [], stack: [] };
  const rotations: Record<Form, [number, number, number][]> = {
    orbit: [[0.42, 0.52, 0.2], [-0.7, -0.1, -0.45], [0.86, 0.18, 0.65]],
    ribbon: [[0, 0.25, 0.12], [0.45, -0.4, 1.1], [-0.6, 0.2, -0.45]],
    stack: [[-1.08, 0, 0.12], [-1.08, 0.12, 0.12], [-1.08, -0.12, 0.12]],
  };
  for (const form of Object.keys(forms) as Form[]) {
    for (let index = 0; index < 3; index++) {
      const radius = 1.76 + index * 0.42;
      const points = Array.from({ length: 160 }, (_, point) => {
        const angle = point / 160 * Math.PI * 2;
        return form === 'ribbon'
          ? new Vector3(Math.sin(angle) * radius, Math.sin(angle * 2) * radius * 0.58, Math.cos(angle) * radius * 0.38)
          : new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.88, Math.sin(angle * 3 + index) * 0.09);
      });
      const curve = new CatmullRomCurve3(points, true);
      forms[form].push({
        core: new TubeGeometry(curve, 192, index === 2 ? 0.013 : 0.023, 8, true),
        glow: new TubeGeometry(curve, 192, index === 2 ? 0.07 : 0.1, 8, true),
        rotation: rotations[form][index],
        position: [0, form === 'stack' ? (index - 1) * 0.64 : 0, 0],
      });
    }
  }
  const rings = $derived(forms[variant]);
  const particleGeometry = createParticles(2000);
  const coreGeometry = new SphereGeometry(0.82, 64, 40);
  const geometries = [particleGeometry, coreGeometry, ...starLayers.map((layer) => layer.geometry),
    ...Object.values(forms).flatMap((rings) => rings.flatMap((ring) => [ring.core, ring.glow]))];

  $effect(() => {
    const nextColor = new Color(color);
    for (const material of materials) material.uniforms.uColor.value.copy(nextColor);
    invalidate();
  });

  $effect(() => {
    const mode = variant === 'orbit' ? 0 : variant === 'ribbon' ? 1 : 2;
    particleMaterial.uniforms.uVariant.value = mode;
    ringMaterials.forEach((pair, index) => pair.forEach((material) => {
      material.uniforms.uSpeed.value = (0.12 + index * 0.038) * (mode === 1 ? 1.35 : mode === 2 ? 0.82 : 1);
    }));
    invalidate();
  });

  $effect(() => {
    if (!camera) return;
    camera.aspect = aspect;
    camera.position.set(0, 0, cameraDistance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    particleMaterial.uniforms.uDpr.value = renderer.getPixelRatio();
    particleGeometry.setDrawRange(0, $size.width < 768 ? 900 : 2000);
    for (const layer of starLayers) {
      layer.material.uniforms.uDpr.value = renderer.getPixelRatio();
      layer.material.uniforms.uAspect.value = aspect;
      layer.material.uniforms.uCameraDistance.value = cameraDistance;
      layer.geometry.setDrawRange(0, getStarDrawCount(layer.count, $size.width, $size.height));
    }
    invalidate();
  });

  function resetPointer(immediate = false) {
    pointerTarget.set(0, 0);
    if (!immediate) return;
    if (sculpture) {
      sculpture.rotation.x -= pointer.y * 0.04;
      sculpture.rotation.y -= pointer.x * 0.1;
    }
    pointer.set(0, 0);
    invalidate();
  }

  useTask((delta) => {
    const step = Math.min(delta, 0.05);
    elapsed += step;
    for (const material of materials) material.uniforms.uTime.value = elapsed;
    pointer.lerp(pointerTarget, 1 - Math.exp(-step * 3));
    if (sculpture) {
      sculpture.rotation.set(
        Math.sin(elapsed * 0.16) * 0.08 + pointer.y * 0.04,
        elapsed * 0.045 + pointer.x * 0.1,
        Math.sin(elapsed * 0.11) * 0.04,
      );
    }
  }, { running: () => playing && !reducedMotion && pageVisible && inView });

  onMount(() => {
    const previousBackground = scene.background;
    scene.background = background;
    renderer.setClearColor(background, 1);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      reducedMotion = preference.matches;
      if (reducedMotion) resetPointer(true);
    };
    const syncVisibility = () => {
      pageVisible = !document.hidden;
      if (!pageVisible) resetPointer(true);
    };
    const trackPointer = (event: PointerEvent) => {
      if (reducedMotion || !playing || event.pointerType === 'touch') return;
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerTarget.set(
        Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)),
        Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)),
      );
    };
    const leaveWindow = (event: PointerEvent) => {
      if (!event.relatedTarget) resetPointer();
    };
    const centerPointer = () => { resetPointer(true); };
    syncMotion();
    syncVisibility();
    preference.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    window.addEventListener('pointermove', trackPointer, { passive: true });
    window.addEventListener('pointerout', leaveWindow, { passive: true });
    window.addEventListener('blur', centerPointer);
    const observer = new IntersectionObserver(([entry]) => { inView = entry?.isIntersecting ?? false; });
    observer.observe(renderer.domElement);

    let mounted = true;
    void tick().then(() => {
      if (!mounted || !camera) return;
      renderer.render(scene, camera);
      onready?.(renderer, scene, camera);
      invalidate();
    });

    return () => {
      mounted = false;
      observer.disconnect();
      preference.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
      window.removeEventListener('pointermove', trackPointer);
      window.removeEventListener('pointerout', leaveWindow);
      window.removeEventListener('blur', centerPointer);
      scene.background = previousBackground;
      materials.forEach((material) => material.dispose());
      geometries.forEach((geometry) => geometry.dispose());
    };
  });
</script>

<T.PerspectiveCamera bind:ref={camera} makeDefault manual fov={45} near={0.1} far={120} />

<T.Mesh position={[0, 0, -32]} material={nebulaMaterial} renderOrder={-10}>
  <T.PlaneGeometry args={[130, 100]} />
</T.Mesh>
{#each starLayers as layer, index}
  <T.Points name={`forma-stars-${layer.name}`} geometry={layer.geometry} material={layer.material}
    frustumCulled={false} renderOrder={-5 + index}
    oncreate={(points) => { points.onBeforeRender = updatePointResolution; }} />
{/each}

<T.Group position={[centerX, centerY, 0]} scale={sculptureScale}>
  <T.Group bind:ref={sculpture} name="forma-sculpture">
    <T.Mesh position={[0, 0, -0.9]} material={haloMaterial} renderOrder={-2}>
      <T.PlaneGeometry args={[8, 8]} />
    </T.Mesh>
    <T.Mesh geometry={coreGeometry} material={coreMaterial} />
    {#each rings as ring, index}
      <T.Group position={ring.position} rotation={ring.rotation}>
        <T.Mesh geometry={ring.glow} material={ringMaterials[index][1]} />
        <T.Mesh geometry={ring.core} material={ringMaterials[index][0]} />
      </T.Group>
    {/each}
    <T.Points geometry={particleGeometry} material={particleMaterial} frustumCulled={false}
      oncreate={(points) => { points.onBeforeRender = updatePointResolution; }} />
  </T.Group>
</T.Group>
