import { GAME_HEIGHT, GAME_WIDTH } from './constants.ts';
import { RenderSystem } from '../systems/RenderSystem.ts';
import { Player } from '../entities/Player.ts';

export class Game {
  private canvas: HTMLCanvasElement;
  private renderSystem: RenderSystem;
  private player: Player;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

    this.renderSystem = new RenderSystem(this.canvas);
    this.player = new Player();

    this.init();
  }

  private init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    window.requestAnimationFrame((time) => this.gameLoop(time));
  }

  private resizeCanvas() {
    const ratio = GAME_WIDTH / GAME_HEIGHT;
    let width, height;
    const margin = 5;

    const availableWidth = window.innerWidth - 2 * margin;
    const availableHeight = window.innerHeight - 2 * margin;
    if (availableWidth / availableHeight > ratio) {
      height = availableHeight;
      width = height * ratio;
    } else {
      width = availableWidth;
      height = availableWidth / ratio;
    }
    this.canvas.width = width;
    this.canvas.height = height;

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.canvas.style.margin = `${margin}px`;
  }

  private gameLoop(_time: DOMHighResTimeStamp) {
    this.renderSystem.render(this.player);
    window.requestAnimationFrame((t) => this.gameLoop(t));
  }
}
