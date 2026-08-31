import { GAME_HEIGHT, GAME_WIDTH } from '../core/constants.ts';
import type { Keys } from '../systems/input/Keys.ts';

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  private speed: number;
  private speedMultiplier: number;

  constructor() {
    this.width = 64;
    this.height = 64;

    this.x = (GAME_WIDTH - this.width) / 2;
    this.y = (GAME_HEIGHT - this.height) / 2;
    this.speed = 300;
    this.speedMultiplier = 1;
  }

  update(deltaTime: number, keys: Keys) {
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

    this.x = Math.max(0, Math.min(GAME_WIDTH - this.width, this.x));
    this.y = Math.max(0, Math.min(GAME_HEIGHT - this.height, this.y));
  }
}
