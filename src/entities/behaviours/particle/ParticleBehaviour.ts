import type { Particle } from '../../Particle.ts';

export interface ParticleBehaviour {
  update(particle: Particle, deltaTime: number): void;
}
