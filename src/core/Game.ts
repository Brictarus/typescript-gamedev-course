import { GAME_HEIGHT, GAME_MARGIN, GAME_WIDTH } from './constants.ts';
import { RenderSystem } from '../systems/RenderSystem.ts';
import { Player } from '../entities/Player.ts';
import type { Keys } from '../systems/input/Keys.ts';
import { ImageManager } from '../managers/ImageManager.ts';
import { AudioManager } from '../managers/AudioManager.ts';
import { UIManager } from '../managers/UIManager.ts';
import { EnemyManager } from '../managers/EnemyManager.ts';

export type GameState = 'menu' | 'playing' | 'paused';

export class Game {
  private canvas: HTMLCanvasElement;
  private player: Player;
  private keys: Keys;
  private lastTime: DOMHighResTimeStamp;
  private time: number;
  private readonly imageManager: ImageManager;
  private readonly audioManager: AudioManager;
  private readonly uiManager: UIManager;
  private readonly renderSystem: RenderSystem;
  private enemyManager: EnemyManager;
  private state: GameState;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

    this.imageManager = new ImageManager();
    this.audioManager = new AudioManager();
    this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
    this.uiManager = new UIManager(this);
    this.enemyManager = new EnemyManager();

    this.player = new Player();
    this.keys = {};
    this.lastTime = 0;
    this.time = 0;
    this.state = 'menu';

    this.init();
  }

  private async init() {
    const DEBUG_LOAD_DELAY = 1_000;
    await Promise.all([
      this.imageManager.loadAll(),
      this.audioManager.loadAll(),
      new Promise((resolve) => {
        return setTimeout(resolve, DEBUG_LOAD_DELAY);
      }),
    ]);

    this.uiManager.showPanel('mainMenu');

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.setupInput();

    this.lastTime = performance.now();
    window.requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number) {
    if (this.state !== 'playing') return;

    this.player.update(deltaTime, this.keys);
    this.enemyManager.update(deltaTime, this.player);
  }

  private gameLoop(time: DOMHighResTimeStamp) {
    const deltaTime = (time - this.lastTime) / 1_000;
    const cappedDeltaTime = Math.min(deltaTime, 0.1);
    this.lastTime = time;

    if (this.state === 'playing') {
      this.time += cappedDeltaTime;
      this.uiManager.updateTimer(this.time);
    }

    this.update(cappedDeltaTime);
    this.renderSystem.render(
      this.state,
      this.player,
      this.enemyManager.getActiveEnemies(),
    );
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

  startGame() {
    this.playSound('button_click');
    this.state = 'playing';
    this.uiManager.hideAllPanels();
    this.time = 0;
    this.uiManager.showTimer();

    this.player.reset();
    this.enemyManager.spawn(200, 200);

    this.lastTime = performance.now();
  }

  pause() {
    this.playSound('pause');
    this.state = 'paused';
    this.uiManager.showPanel('pauseMenu');
  }

  resume() {
    this.playSound('unpause');
    this.state = 'playing';
    this.uiManager.hideAllPanels();
  }

  returnToMenu() {
    this.playSound('button_click');
    this.state = 'menu';
    this.uiManager.hideTimer();
    this.uiManager.showPanel('mainMenu');
  }

  playSound(name: string) {
    this.audioManager.play(name);
  }

  private resizeCanvas() {
    const ratio = GAME_WIDTH / GAME_HEIGHT;
    let width, height;
    const margin = GAME_MARGIN;

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
