import { GAME_HEIGHT, GAME_WIDTH, PUSHBACK_DECAY } from '../core/constants.ts';
import type { Keys } from '../systems/input/Keys.ts';
import { playerData } from '../data/playerData.ts';
import { AnimatorController } from '../utils/AnimatorController.ts';

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  maxHealth: number;
  health: number;
  invincible: boolean;
  invincibilityTimer: number;
  private speed: number;
  private speedMultiplier: number;
  readonly collisionRadius: number;
  private invincibilityDuration: number;
  collisionDamage: number;

  pushbackForce: number;
  private pushVx: number;
  private pushVy: number;

  readonly animator: AnimatorController;

  constructor() {
    this.width = playerData.width;
    this.height = playerData.height;

    this.x = (GAME_WIDTH - this.width) / 2;
    this.y = (GAME_HEIGHT - this.height) / 2;
    this.collisionRadius = playerData.collisionRadius;
    this.collisionDamage = playerData.collisionDamage;
    this.speed = playerData.speed;
    this.maxHealth = playerData.maxHealth;
    this.health = this.maxHealth;

    this.invincibilityDuration = playerData.invincibilityDuration;
    this.invincible = false;
    this.invincibilityTimer = 0;

    this.speedMultiplier = 1;
    this.pushbackForce = playerData.pushbackForce;
    this.pushVx = 0;
    this.pushVy = 0;

    this.animator = new AnimatorController(playerData.animData);
  }

  centerX() {
    return this.x + this.width / 2;
  }

  centerY() {
    return this.y + this.height / 2;
  }

  reset() {
    this.x = (GAME_WIDTH - this.width) / 2;
    this.y = (GAME_HEIGHT - this.height) / 2;
    this.speed = playerData.speed;
    this.speedMultiplier = 1;
    this.health = this.maxHealth;
    this.invincible = false;
    this.invincibilityTimer = 0;

    this.pushVx = 0;
    this.pushVy = 0;

    this.animator.reset(playerData.animData.initialState);
  }

  update(deltaTime: number, keys: Keys) {
    this.updatePushback(deltaTime);
    this.updateInvincibility(deltaTime);

    if (!this.animator.is('death') && !this.animator.is('hit')) {
      let dx = 0;
      let dy = 0;

      if (keys['z'] || keys['arrowup']) dy -= 1;
      if (keys['s'] || keys['arrowdown']) dy += 1;
      if (keys['q'] || keys['arrowleft']) dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;

      if (dx || dy) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;

        this.x += dx * this.speed * this.speedMultiplier * deltaTime;
        this.y += dy * this.speed * this.speedMultiplier * deltaTime;
      }

      let intent;
      if (keys['z'] || keys['arrowup']) intent = 'moveUp';
      else if (keys['q'] || keys['arrowleft']) intent = 'moveLeft';
      else if (keys['s'] || keys['arrowdown']) intent = 'moveDown';
      else if (keys['d'] || keys['arrowright']) intent = 'moveRight';
      else intent = 'idle';

      this.animator.play(intent);
    }

    this.animator.update(deltaTime);
    this.clampToBounds();
  }

  private clampToBounds() {
    this.x = Math.max(0, Math.min(GAME_WIDTH - this.width, this.x));
    this.y = Math.max(0, Math.min(GAME_HEIGHT - this.height, this.y));
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
    this.invincibilityTimer = this.invincibilityDuration;

    this.animator.play(this.health <= 0 ? 'death' : 'hit', { force: true });

    return true;
  }

  isDead() {
    return this.animator.is('death');
  }

  isDeathFinished() {
    return this.isDead() && this.animator.finished;
  }
}
