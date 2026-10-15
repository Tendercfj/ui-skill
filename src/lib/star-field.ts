import { BufferAttribute, BufferGeometry } from 'three';

export interface StarFieldSettings {
  count: number;
  seed: number;
  depth: [number, number];
  size: [number, number];
  sparkle: number;
}

export function createStarField(settings: StarFieldSettings) {
  let seed = settings.seed;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const positions = new Float32Array(settings.count * 3);
  const seeds = new Float32Array(settings.count);
  const sizes = new Float32Array(settings.count);
  const sparkles = new Float32Array(settings.count);

  for (let index = 0; index < settings.count; index++) {
    // The shader projects these normalized coordinates at each star's depth.
    // Overscan keeps the frame populated at maximum pointer displacement.
    positions[index * 3] = (random() * 2 - 1) * 1.2;
    positions[index * 3 + 1] = (random() * 2 - 1) * 1.2;
    positions[index * 3 + 2] = -settings.depth[0] - random() * (settings.depth[1] - settings.depth[0]);
    seeds[index] = random();
    sparkles[index] = random() < settings.sparkle ? 1 : 0;
    sizes[index] = settings.size[0] + Math.pow(random(), 2) * (settings.size[1] - settings.size[0]);
    if (sparkles[index]) sizes[index] *= 2.8;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));
  geometry.setAttribute('aSize', new BufferAttribute(sizes, 1));
  geometry.setAttribute('aSparkle', new BufferAttribute(sparkles, 1));
  geometry.computeBoundingSphere();
  return geometry;
}

export function getStarDrawCount(count: number, width: number, height: number) {
  const areaRatio = Math.min(1, Math.max(0, width) * Math.max(0, height) / (1920 * 1080));
  const density = areaRatio * (width < 768 ? 0.72 : 1);
  return Math.min(count, Math.max(Math.round(count * density), Math.min(count, 24)));
}
