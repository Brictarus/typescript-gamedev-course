import type { EnemyData } from '../data/enemyData.ts';
import type { Player } from './Player.ts';
import {
  ENEMY_DESPAWN_MARGIN,
  GAME_HEIGHT,
  GAME_WIDTH,
} from '../core/constants.ts';
import type { PoolableObject } from '../utils/ObjectPooler.ts';

export type EnemyUpdateContext = {
  player: Player;
};

export class Enemy implements PoolableObject<EnemyUpdateContext> {
  private readonly data: EnemyData;

  x: number;
  y: number;
  width: number;
  height: number;

  private health: number;
  private damage: number;
  private collisionRadius: number;

  private speed: number;

  private active: boolean;

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

    this.active = false;
  }

  isActive() {
    return this.active;
  }

  spawn(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.health = this.data.health;
    this.active = true;

    console.log(
      `Enemy spawned! Health = ${this.health}, Damage = ${this.damage}, CollisionRadius = ${this.collisionRadius}`,
    );
  }

  reset() {
    this.active = false;
    this.health = this.data.health;
  }

  update(deltaTime: number, { player }: EnemyUpdateContext) {
    if (!this.active) return;

    if (
      this.x < -ENEMY_DESPAWN_MARGIN ||
      this.x > GAME_WIDTH + ENEMY_DESPAWN_MARGIN ||
      this.y < -ENEMY_DESPAWN_MARGIN ||
      this.y > GAME_HEIGHT + ENEMY_DESPAWN_MARGIN
    ) {
      this.active = false;
      return;
    }

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
