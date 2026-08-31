import { GAME_HEIGHT, GAME_WIDTH } from './constants.ts';
import { RenderSystem } from '../systems/RenderSystem.ts';
import { Player } from '../entities/Player.ts';
import type { Keys } from '../systems/input/Keys.ts';

export class Game {
  private canvas: HTMLCanvasElement;
  private renderSystem: RenderSystem;
  private player: Player;
  private keys: Keys;
  private lastTime: DOMHighResTimeStamp = 0;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

    this.renderSystem = new RenderSystem(this.canvas);
    this.player = new Player();
    this.keys = {};

    this.init();
  }

  private init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.setupInput();

    this.lastTime = performance.now();
    window.requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number) {
    this.player.update(deltaTime, this.keys);
  }

  private gameLoop(time: DOMHighResTimeStamp) {
    const deltaTime = (time - this.lastTime) / 1_000;
    const cappedDeltaTime = Math.min(deltaTime, 0.1);
    this.lastTime = time;

    this.update(cappedDeltaTime);
    this.renderSystem.render(this.player);
    window.requestAnimationFrame((t) => this.gameLoop(t));
  }

  private setupInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
    window.addEventListener('contextmenu', () => {
      this.keys = {};
    });
    window.addEventListener('blur', () => {
      this.keys = {};
    });
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
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.canvas.style.margin = `${margin}px`;
  }
}
