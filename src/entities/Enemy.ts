import type { EnemyData } from '../data/enemyData.ts';
import type { Player } from './Player.ts';
import {
  ENEMY_DESPAWN_MARGIN,
  ENEMY_HIT_INVINCIBILITY_DURATION,
  GAME_HEIGHT,
  GAME_WIDTH,
  PUSHBACK_DECAY,
} from '../core/constants.ts';
import type { PoolableObject } from '../utils/ObjectPooler.ts';
import type { EnemyBehaviour } from './behaviours/enemy/EnemyBehaviour.ts';
import { AnimatorController } from '../utils/AnimatorController.ts';

export type EnemyUpdateContext = {
  player: Player;
};

export class Enemy implements PoolableObject<EnemyUpdateContext> {
  readonly data: EnemyData;

  x: number;
  y: number;
  width: number;
  height: number;
  facingLeft: boolean;

  health: number;
  readonly damage: number;
  readonly collisionRadius: number;

  speed: number;

  active: boolean;
  private behaviour: EnemyBehaviour;

  invincible: boolean;
  invincibilityTimer: number;

  private pushVx: number;
  private pushVy: number;

  readonly animator: AnimatorController;

  constructor(data: EnemyData, behaviour: EnemyBehaviour) {
    this.data = data;
    this.behaviour = behaviour;

    this.x = 0;
    this.y = 0;
    this.width = data.width;
    this.height = data.height;

    this.health = data.health;
    this.speed = data.speed;
    this.damage = data.damage;
    this.collisionRadius = data.collisionRadius;

    this.active = false;
    this.facingLeft = false;

    this.invincible = false;
    this.invincibilityTimer = 0;

    this.pushVx = 0;
    this.pushVy = 0;

    this.animator = new AnimatorController(data.animData);
  }

  centerX() {
    return this.x + this.width / 2;
  }

  centerY() {
    return this.y + this.height / 2;
  }

  spawn(x: number, y: number) {
    this.reset();

    this.x = x;
    this.y = y;
    this.active = true;
    this.animator.reset(this.data.animData.initialState);
  }

  reset() {
    this.active = false;
    this.facingLeft = false;
    this.health = this.data.health;
    this.behaviour.reset?.();

    this.invincible = false;
    this.invincibilityTimer = 0;

    this.pushVx = 0;
    this.pushVy = 0;
  }

  update(deltaTime: number, { player }: EnemyUpdateContext) {
    if (!this.active) return;

    this.updatePushback(deltaTime);
    this.updateInvincibility(deltaTime);

    if (this.animator.is('death')) {
      this.animator.update(deltaTime);
      if (this.animator.finished) {
        this.active = false;
        return;
      }
    }

    if (
      this.x < -ENEMY_DESPAWN_MARGIN ||
      this.x > GAME_WIDTH + ENEMY_DESPAWN_MARGIN ||
      this.y < -ENEMY_DESPAWN_MARGIN ||
      this.y > GAME_HEIGHT + ENEMY_DESPAWN_MARGIN
    ) {
      this.active = false;
      return;
    }

    if (!this.animator.is('hit')) {
      const oldX = this.x;
      this.behaviour.update(deltaTime, this, player);
      this.facingLeft = this.x < oldX;
    }

    this.animator.update(deltaTime);
  }

  private updateInvincibility(deltaTime: number) {
    if (this.invincible) {
      this.invincibilityTimer -= deltaTime;
      if (this.invincibilityTimer <= 0) {
        this.invincible = false;
        this.invincibilityTimer = 0;
      }
    }
  }

  private updatePushback(deltaTime: number) {
    if (this.pushVx !== 0 || this.pushVy !== 0) {
      this.x += this.pushVx * deltaTime;
      this.y += this.pushVy * deltaTime;

      const speed = Math.sqrt(
        this.pushVx * this.pushVx + this.pushVy * this.pushVy,
      );
      const decay = PUSHBACK_DECAY * deltaTime;
      if (speed <= decay) {
        this.pushVx = 0;
        this.pushVy = 0;
      } else {
        const ratio = (speed - decay) / speed;
        this.pushVx *= ratio;
        this.pushVy *= ratio;
      }
    }
  }

  applyPushback(directionX: number, directionY: number, force: number) {
    this.pushVx = directionX * force;
    this.pushVy = directionY * force;
  }

  takeDamage(amount: number) {
    if (this.invincible) return false;

    this.health = Math.max(0, this.health - amount);
    this.invincible = true;
    this.invincibilityTimer = ENEMY_HIT_INVINCIBILITY_DURATION;

    this.animator.play(this.health <= 0 ? 'death' : 'hit', { force: true });

    return true;
  }

  isDead() {
    return this.animator.is('death');
  }
}
