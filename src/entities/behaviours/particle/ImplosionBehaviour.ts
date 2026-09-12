import type { Particle } from '../../Particle.ts';
import type { ParticleBehaviour } from './ParticleBehaviour.ts';

const HOVER_DURATION_MIN = 0.2;
const HOVER_DURATION_MAX = 0.6;
const BURST_DURATION = 0.25;
const BURST_DRAG = 3;
const ARRIVE_RADIUS = 5;
const IMPLODE_ACCELERATION = 700;

export class ImplosionBehaviour implements ParticleBehaviour {
  private originX: number;
  private originY: number;
  private hoverDuration: number;

  constructor(originX: number, originY: number) {
    this.originX = originX;
    this.originY = originY;
    this.hoverDuration =
      HOVER_DURATION_MIN +
      Math.random() * (HOVER_DURATION_MAX - HOVER_DURATION_MIN);
  }

  update(particle: Particle, deltaTime: number): void {
    const age = particle.age;
    const isPhase1 = age < BURST_DURATION;
    const isPhase2 = age < BURST_DURATION + this.hoverDuration;

    if (isPhase1) {
      this.burstOutwardWithDrag(particle, deltaTime);
    } else if (isPhase2) {
      // Just wait and see
    } else {
      this.accelerateTowardOrigin(particle, deltaTime);
    }
  }

  private burstOutwardWithDrag(particle: Particle, deltaTime: number) {
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.vx *= Math.exp(-BURST_DRAG * deltaTime);
    particle.vy *= Math.exp(-BURST_DRAG * deltaTime);
  }

  private accelerateTowardOrigin(particle: Particle, deltaTime: number) {
    const dx = this.originX - particle.x;
    const dy = this.originY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ARRIVE_RADIUS) {
      particle.active = false;
      return;
    }
    const nx = dx / distance;
    const ny = dy / distance;

    particle.vx += nx * IMPLODE_ACCELERATION * deltaTime;
    particle.vy += ny * IMPLODE_ACCELERATION * deltaTime;

    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
  }
}
