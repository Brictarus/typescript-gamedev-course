import type { GameEventEmitter } from '../core/Events.ts';
import { Particle, type ParticleUpdateContext } from '../entities/Particle.ts';
import { ObjectPooler } from '../utils/ObjectPooler.ts';
import { particleData } from '../data/particleData.ts';
import { ParticleBehaviourFactory } from '../entities/behaviours/particle/ParticleBehaviourFactory.ts';
import type { ParticleSpawnOptions } from './ParticleSpawnOptions.ts';

const PARTICLE_POOL_SIZE = 200;
const particlePool = new ObjectPooler<Particle, ParticleUpdateContext>(
  () => new Particle(),
  PARTICLE_POOL_SIZE,
);

export class ParticleManager {
  private readonly events: GameEventEmitter;

  constructor(events: GameEventEmitter) {
    this.events = events;

    this.registerEvents();
  }

  private registerEvents() {
    this.events.on('enemy:damaged', (enemy) => {
      const type = enemy.data.particles.hit;
      this.spawnEffect(type, enemy.centerX(), enemy.centerY(), {
        color: enemy.data.color,
        count: 3,
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
      const particle = particlePool.retrieve();
      const angle = Math.random() * Math.PI * 2;
      const speed = data.speed * (0.5 + Math.random() * 0.5);

      particle.spawn(
        data,
        x,
        y,
        angle,
        speed,
        ParticleBehaviourFactory.create(data.behaviourType),
        options,
      );
    }
  }

  update(deltaTime: number): void {
    particlePool.updateAll(deltaTime, undefined);
  }

  reset() {
    particlePool.releaseAll();
  }

  getActiveParticles(): Particle[] {
    return particlePool.active;
  }
}
