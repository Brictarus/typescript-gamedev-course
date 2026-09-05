import type { Behaviour } from './Behaviour.ts';
import type { Enemy } from '../Enemy.ts';

export class DrifBehaviour implements Behaviour {
  private angle: number;
  private changeTimer: number;
  private changeInterval: number;

  constructor() {
    this.angle = Math.random() * Math.PI * 2;
    this.changeTimer = 0;
    this.changeInterval = 2; // seconds
  }

  update(deltaTime: number, enemy: Enemy): void {
    this.changeTimer += deltaTime;

    if (this.changeTimer >= this.changeInterval) {
      this.angle = Math.random() * Math.PI * 2;
      this.changeTimer = 0;
    }

    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);

    enemy.x += dx * enemy.speed * deltaTime;
    enemy.y += dy * enemy.speed * deltaTime;
  }

  reset(): void {
    this.angle = Math.random() * Math.PI * 2;
    this.changeTimer = 0;
  }
}
