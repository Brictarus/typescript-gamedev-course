import type { GameEventEmitter } from '../core/Events.ts';
import { Particle, type ParticleUpdateContext } from '../entities/Particle.ts';
import { ObjectPooler } from '../utils/ObjectPooler.ts';
import { particleData } from '../data/particleData.ts';
import { ParticleBehaviourFactory } from '../entities/behaviours/particle/ParticleBehaviourFactory.ts';
import type { ParticleSpawnOptions } from './ParticleSpawnOptions.ts';
import { PARTICLE_POOL_SIZE } from '../core/constants.ts';

export class ParticleManager {
  private readonly events: GameEventEmitter;
  private readonly particlePool: ObjectPooler<Particle, ParticleUpdateContext>;

  constructor(events: GameEventEmitter) {
    this.events = events;
    this.particlePool = new ObjectPooler<Particle, ParticleUpdateContext>(
      () => new Particle(),
      PARTICLE_POOL_SIZE,
    );

    this.registerEvents();
  }

  private registerEvents() {
    this.events.on('enemy:damaged', (enemy) => {
      const type = enemy.data.particles.hit;
      this.spawnEffect(type, enemy.centerX(), enemy.centerY(), {
        color: enemy.data.color,
        count: 5,
      });
    });
    this.events.on('enemy:died', (enemy) => {
      const type = enemy.data.particles.death;
      this.spawnEffect(type, enemy.centerX(), enemy.centerY(), {
        color: enemy.data.color,
        count: 15,
      });
    });
  }

  spawnEffect(
    type: string,
    x: number,
    y: number,
    options: ParticleSpawnOptions,
  ) {
    const data = particleData[type];
    if (!data) {
      console.warn(`Unknown particle type: ${type}`);
      return;
    }

    const count = options.count ?? data.count;
    for (let i = 0; i < count; i++) {
      const particle = this.particlePool.retrieve();
      const angle = Math.random() * Math.PI * 2;
      const speed = data.speed * (0.5 + Math.random() * 0.5);

      particle.spawn(
        data,
        x,
        y,
        angle,
        speed,
        ParticleBehaviourFactory.create(data.behaviourType, {
          originX: x,
          originY: y,
        }),
        options,
      );
    }
  }

  update(deltaTime: number): void {
    this.particlePool.updateAll(deltaTime, undefined);
  }

  reset() {
    this.particlePool.releaseAll();
  }

  getActiveParticles(): Particle[] {
    return this.particlePool.active;
  }
}
