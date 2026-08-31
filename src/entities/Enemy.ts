import type { EnemyData } from '../data/enemyData.ts';

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
}
