import { GAME_HEIGHT, GAME_WIDTH } from '../core/constants.ts';
import type { Keys } from '../systems/input/Keys.ts';

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  private speed: number;

  constructor() {
    this.x = GAME_WIDTH / 2;
    this.y = GAME_HEIGHT / 2;
    this.width = 64;
    this.height = 64;
    this.speed = 10;
  }

  update(keys: Keys) {
    let dx = 0;
    let dy = 0;

    if (keys['w'] || keys['arrowup']) dy -= 1;
    if (keys['s'] || keys['arrowdown']) dy += 1;
    if (keys['a'] || keys['arrowleft']) dx -= 1;
    if (keys['d'] || keys['arrowright']) dx += 1;

    if (dx || dy) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;
    }
    if (dx || dy) {
      this.x += dx * this.speed;
      this.y += dy * this.speed;
    }
  }
}
