import type { PoolableObject } from '../utils/ObjectPooler.ts';
import type { ParticleBehaviour } from './behaviours/particle/ParticleBehaviour.ts';
import type { ParticleData } from '../data/particleData.ts';

import type { ParticleSpawnOptions } from '../managers/ParticleSpawnOptions.ts';

export type ParticleUpdateContext = void;

const DEFAULT_BASE_SIZE = 4;

export class Particle implements PoolableObject<ParticleUpdateContext> {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lifetime: number;
  age: number;
  size: number;
  private baseSize: number;
  color: string;
  gravity: {
    x: number;
    y: number;
  };
  active: boolean;
  private behaviour: ParticleBehaviour | undefined;
  fade: boolean;
  private shrink: boolean;
  shape: string;
  image?: string;

  constructor() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.lifetime = 1;
    this.age = 0;
    this.baseSize = DEFAULT_BASE_SIZE;
    this.size = this.baseSize;
    this.fade = false;
    this.shrink = false;
    this.color = '#fff';
    this.gravity = {
      x: 0,
      y: 0,
    };
    this.behaviour = undefined;
    this.shape = 'rectangle';
    this.image = undefined;
  }

  update(deltaTime: number) {
    if (!this.active) return;

    this.age += deltaTime;
    if (this.age >= this.lifetime) {
      this.active = false;
      return;
    }

    if (this.shrink) {
      this.size = this.baseSize * (1 - this.age / this.lifetime);
    }

    this.behaviour?.update(this, deltaTime);
  }

  reset(): void {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.age = 0;
    this.lifetime = 0;
    this.baseSize = DEFAULT_BASE_SIZE;
    this.size = this.baseSize;
    this.color = '#fff';
    this.fade = false;
    this.shrink = false;
    this.gravity.x = 0;
    this.gravity.y = 0;
    this.behaviour = undefined;
    this.shape = 'rectangle';
    this.image = undefined;
  }

  spawn(
    data: ParticleData,
    x: number,
    y: number,
    angle: number,
    speed: number,
    behaviour: ParticleBehaviour,
    options: ParticleSpawnOptions | undefined,
  ) {
    this.active = true;
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.lifetime = data.lifetime;
    this.age = 0;
    this.size = data.size;
    this.baseSize = data.size;
    this.fade = data.fade;
    this.shrink = data.shrink;
    this.color = options?.color ?? data.color;
    this.gravity.x = data.gravity.x;
    this.gravity.y = data.gravity.y;
    this.behaviour = behaviour;

    this.shape = data.shape;
    this.image = data.shape === 'image' ? data.image : undefined;
  }

  centerX() {
    return this.x + this.size / 2;
  }

  centerY() {
    return this.y + this.size / 2;
  }
}
