import { GAME_HEIGHT, GAME_WIDTH, GRID_SIZE } from '../core/constants.ts';
import type { Player } from '../entities/Player.ts';
import { ImageManager } from '../managers/ImageManager.ts';
import type { GameState } from '../core/Game.ts';

export class RenderSystem {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly imageManager: ImageManager;

  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, imageManager: ImageManager) {
    this.imageManager = imageManager;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
  }

  render(state: GameState, player: Player) {
    if (state === 'menu') {
      this.renderMenuBackground();
    } else {
      this.ctx.fillStyle = '#0f3460';
      this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      this.renderGrid();
      this.renderPlayer(player);
    }
  }

  private renderGrid() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 1;

    this.ctx.beginPath();
    for (let i = 0; i < GAME_WIDTH; i += GRID_SIZE) {
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, GAME_HEIGHT);
    }

    for (let i = 0; i < GAME_HEIGHT; i += GRID_SIZE) {
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(GAME_WIDTH, i);
    }
    this.ctx.stroke();
  }

  private renderPlayer(player: Player) {
    const playerImage = this.imageManager.get('player');
    if (playerImage) {
      this.ctx.drawImage(playerImage, player.x, player.y);
    } else {
      this.ctx.fillStyle = '#1a1a2e';
      this.ctx.fillRect(player.x, player.y, player.width, player.height);
      this.ctx.strokeStyle = 'white';
      this.ctx.strokeRect(player.x, player.y, player.width, player.height);
    }
  }

  private renderMenuBackground() {
    this.ctx.fillStyle = '#0f3460';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
