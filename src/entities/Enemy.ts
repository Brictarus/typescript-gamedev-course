import type { EnemyData } from '../data/enemyData.ts';
import type { Player } from './Player.ts';

export class Enemy {
  private readonly data: EnemyData;

  x: number;
  y: number;
  width: number;
  height: number;

  private health: number;
  private damage: number;
  private collisionRadius: number;

  private speed: number;

  constructor(data: EnemyData) {
    this.data = data;

    this.x = 0;
    this.y = 0;
    this.width = data.width;
    this.height = data.height;

    this.health = data.health;
    this.speed = data.speed;
    this.damage = data.damage;
    this.collisionRadius = data.collisionRadius;
  }

  spawn(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.health = this.data.health;
  }

  update(deltaTime: number, player: Player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length > 0) {
      const normalizedDx = dx / length;
      const normalizedDy = dy / length;

      this.x += normalizedDx * this.speed * deltaTime;
      this.y += normalizedDy * this.speed * deltaTime;
    }
  }
}
