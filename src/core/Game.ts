import { GAME_HEIGHT, GAME_WIDTH } from './constants.ts';
import { RenderSystem } from '../systems/RenderSystem.ts';
import { Player } from '../entities/Player.ts';
import type { Keys } from '../systems/input/Keys.ts';
import { ImageManager } from '../managers/ImageManager.ts';

type GameState = 'menu' | 'playing' | 'paused';

export class Game {
  private canvas: HTMLCanvasElement;
  private player: Player;
  private keys: Keys;
  private lastTime: DOMHighResTimeStamp;
  private imageManager: ImageManager;
  private renderSystem: RenderSystem;
  private state: GameState;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    this.imageManager = new ImageManager();
    this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
    this.player = new Player();
    this.keys = {};
    this.lastTime = 0;
    this.state = 'menu';

    this.init();
  }

  private async init() {
    await Promise.all([
      this.imageManager.loadAll(),
      new Promise((resolve) => setTimeout(resolve, 5_000)),
    ]);

    document.getElementById('loadingScreen')?.classList.remove('active');
    document.getElementById('mainMenu')?.classList.add('active');

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.setupInput();
    this.setupUI();

    this.lastTime = performance.now();
    window.requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number) {
    if (this.state !== 'playing') return;

    this.player.update(deltaTime, this.keys);
  }

  private render() {
    if (this.state === 'menu') {
      this.ctx.fillStyle = '#0f3460';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.renderSystem.render(this.player);
    }
  }

  private gameLoop(time: DOMHighResTimeStamp) {
    if (this.lastTime === 0) {
      this.lastTime = time;
    }

    const deltaTime = (time - this.lastTime) / 1_000;
    const cappedDeltaTime = Math.min(deltaTime, 0.1);
    this.lastTime = time;

    this.update(cappedDeltaTime);
    this.render();
    window.requestAnimationFrame((t) => this.gameLoop(t));
  }

  private setupInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;

      if (e.key === 'Escape') {
        if (this.state === 'playing') {
          this.pause();
        } else if (this.state === 'paused') {
          this.resume();
        }
      }
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

  private setupUI() {
    document
      .getElementById('playBtn')
      ?.addEventListener('click', () => this.startGame());
    document
      .getElementById('resumeBtn')
      ?.addEventListener('click', () => this.resume());
    document
      .getElementById('quitBtn')
      ?.addEventListener('click', () => this.returnToMenu());
  }

  private hideAllPanels() {
    document
      .querySelectorAll('.ui-panel')
      .forEach((panel) => panel.classList.remove('active'));
  }

  private startGame() {
    this.state = 'playing';
    this.hideAllPanels();

    this.player.reset();

    this.lastTime = performance.now();
  }

  private pause() {
    this.state = 'paused';
    document.getElementById('pauseMenu')?.classList.add('active');
  }

  private resume() {
    this.state = 'playing';
    document.getElementById('pauseMenu')?.classList.remove('active');
  }

  private returnToMenu() {
    this.state = 'menu';
    this.hideAllPanels();
    document.getElementById('mainMenu')?.classList.add('active');
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
