import type { PoolableObject } from '../utils/ObjectPooler.ts';
import type { ParticleBehaviour } from './behaviours/particle/ParticleBehaviour.ts';
import type { ParticleData } from '../data/particleData.ts';

import type { ParticleSpawnOptions } from '../managers/ParticleSpawnOptions.ts';

export type ParticleUpdateContext = void;

export class Particle implements PoolableObject<ParticleUpdateContext> {
  x: number;
  y: number;
  vx: number;
  vy: number;
  private lifetime: number;
  private age: number;
  size: number;
  private baseSize: number;
  color: string;
  gravity: {
    x: number;
    y: number;
  };
  active: boolean;
  private behaviour: ParticleBehaviour | undefined;

  constructor() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.lifetime = 1;
    this.age = 0;
    this.size = 4;
    this.baseSize = 4;
    this.color = '#fff';
    this.gravity = {
      x: 0,
      y: 0,
    };
    this.behaviour = undefined;
  }

  update(deltaTime: number) {
    if (!this.active) return;

    this.age += deltaTime;
    if (this.age >= this.lifetime) {
      this.active = false;
      return;
    }

    this.behaviour?.update(this, deltaTime);
  }

  reset(): void {
    this.active = false;
    this.vx = 0;
    this.vy = 0;
    this.age = 0;
    this.size = this.baseSize;
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
    this.color = options?.color ?? data.color;
    this.gravity = {
      x: data.gravity.x,
      y: data.gravity.y,
    };
    this.behaviour = behaviour;
  }

  centerX() {
    return this.x + this.size / 2;
  }

  centerY() {
    return this.y + this.size / 2;
  }
}
