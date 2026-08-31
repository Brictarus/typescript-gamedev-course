import { GAME_HEIGHT, GAME_WIDTH } from '../core/constants.ts';

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor() {
    this.x = GAME_WIDTH / 2;
    this.y = GAME_HEIGHT / 2;
    this.width = 64;
    this.height = 64;
  }
}
