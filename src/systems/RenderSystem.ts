import { GAME_HEIGHT, GAME_WIDTH, GRID_SIZE } from '../core/constants.ts';

export class RenderSystem {
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
  }

  render() {
    this.ctx.fillStyle = '#0f3460';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.renderGrid();
  }

  private renderGrid() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 1;

    for (let i = 0; i < GAME_WIDTH; i += GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, GAME_HEIGHT);
      this.ctx.stroke();
    }

    for (let i = 0; i < GAME_HEIGHT; i += GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(GAME_WIDTH, i);
      this.ctx.stroke();
    }
  }
}
