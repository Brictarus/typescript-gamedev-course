import type { Particle } from '../../Particle.ts';
import type { ParticleBehaviour } from './ParticleBehaviour.ts';

export class RadialBehaviour implements ParticleBehaviour {
  update(particle: Particle, deltaTime: number) {
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.vx += particle.gravity.x * deltaTime;
    particle.vy += particle.gravity.y * deltaTime;
  }
}
