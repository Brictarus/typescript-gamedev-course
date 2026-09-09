import { GAME_HEIGHT, GAME_MARGIN, GAME_WIDTH } from './constants.ts';
import { RenderSystem } from '../systems/RenderSystem.ts';
import { Player } from '../entities/Player.ts';
import type { Keys } from '../systems/input/Keys.ts';
import { ImageManager } from '../managers/ImageManager.ts';
import { AudioManager } from '../managers/AudioManager.ts';
import { UIManager } from '../managers/UIManager.ts';
import { EnemyManager } from '../managers/EnemyManager.ts';
import { EnemySpawner } from '../managers/EnemySpawner.ts';
import { EventEmitter } from './EventEmitter.ts';
import type { Events, GameEventEmitter } from './Events.ts';
import { CollisionManager } from '../managers/CollisionManager.ts';
import { CollisionSystem } from '../systems/CollisionSystem.ts';
import type { Enemy } from '../entities/Enemy.ts';
import { missionData } from '../data/playerData.ts';

export type GameState =
  'menu' | 'playing' | 'paused' | 'gameOver' | 'missionComplete';

export class Game {
  private canvas: HTMLCanvasElement;
  private player: Player;
  private keys: Keys;
  private lastTime: DOMHighResTimeStamp;
  private time: number;

  private readonly events: GameEventEmitter;
  private readonly imageManager: ImageManager;
  private readonly audioManager: AudioManager;
  private readonly uiManager: UIManager;
  private readonly renderSystem: RenderSystem;
  private readonly enemyManager: EnemyManager;
  private readonly collisionManager: CollisionManager;
  private readonly enemySpawner: EnemySpawner;
  private state: GameState;
  private enemiesKilled: number;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

    this.events = new EventEmitter<Events>();
    this.imageManager = new ImageManager();
    this.audioManager = new AudioManager();
    this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
    this.uiManager = new UIManager(this.events);
    this.enemyManager = new EnemyManager();
    this.enemySpawner = new EnemySpawner(this.enemyManager);
    this.collisionManager = new CollisionManager(
      new CollisionSystem(),
      this.events,
    );

    this.player = new Player();
    this.keys = {};
    this.lastTime = 0;
    this.time = 0;
    this.enemiesKilled = 0;
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

    this.events.on('sound', (name) => this.audioManager.play(name));

    this.events.on('game:start', () => this.startGame());
    this.events.on('game:pause', () => this.pause());
    this.events.on('game:resume', () => this.resume());
    this.events.on('game:returnToMenu', () => this.returnToMenu());
    this.events.on('mission:complete', () => this.missionComplete());
    this.events.on('enemy:died', () => {
      this.enemiesKilled++;
      this.events.emit('enemy:killCount', this.enemiesKilled);
      this.checkMissionConditions();
    });

    this.events.on('player:damaged', ({ health, maxHealth }) => {
      this.events.emit('sound', 'player_hurt');
      this.uiManager.updateHealth(health, maxHealth);
    });
    this.events.on('player:died', () => {
      this.events.emit('sound', 'game_over');
      this.gameOver();
    });

    this.uiManager.showPanel('mainMenu');

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.setupInput();

    this.lastTime = performance.now();
    window.requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number, activeEnemies: Enemy[]) {
    if (this.state !== 'playing') return;

    this.player.update(deltaTime, this.keys);
    this.enemyManager.update(deltaTime, this.player);
    this.enemySpawner.update(deltaTime);
    this.collisionManager.update(this.player, activeEnemies);
  }

  private gameLoop(time: DOMHighResTimeStamp) {
    const deltaTime = (time - this.lastTime) / 1_000;
    const cappedDeltaTime = Math.min(deltaTime, 0.1);
    this.lastTime = time;

    if (this.state === 'playing') {
      this.time += cappedDeltaTime;
      this.uiManager.updateTimer(this.time);
      this.checkMissionConditions();
    }

    const activeEnemies = this.enemyManager.getActiveEnemies();

    this.update(cappedDeltaTime, activeEnemies);
    this.renderSystem.render(this.state, this.player, activeEnemies);
    window.requestAnimationFrame((t) => this.gameLoop(t));
  }

  private setupInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;

      if (e.key === 'Escape') {
        if (this.state === 'playing') {
          this.events.emit('game:pause');
        } else if (this.state === 'paused') {
          this.events.emit('game:resume');
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

  private startGame() {
    this.events.emit('sound', 'button_click');
    this.state = 'playing';
    this.uiManager.hideAllPanels();
    this.time = 0;
    this.enemiesKilled = 0;
    this.uiManager.showHud();

    this.player.reset();
    this.enemyManager.reset();
    this.enemySpawner.reset();

    this.uiManager.updateHealth(this.player.health, this.player.maxHealth);

    this.lastTime = performance.now();
  }

  private pause() {
    this.events.emit('sound', 'pause');
    this.state = 'paused';
    this.uiManager.showPanel('pauseMenu');
  }

  private resume() {
    this.events.emit('sound', 'unpause');
    this.state = 'playing';
    this.uiManager.hideAllPanels();
  }

  private returnToMenu() {
    this.events.emit('sound', 'button_click');
    this.state = 'menu';
    this.uiManager.hideHud();
    this.uiManager.showPanel('mainMenu');
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

  private gameOver() {
    this.state = 'gameOver';
    this.uiManager.hideHud();
    this.uiManager.showPanel('gameOverMenu');
  }

  private missionComplete() {
    this.state = 'missionComplete';
    this.uiManager.hideHud();
    this.uiManager.showPanel('missionCompleteMenu');
    this.events.emit('sound', 'mission_complete');
  }

  private checkMissionConditions() {
    if (this.state !== 'playing') return;
    if (
      this.enemiesKilled >= missionData.killCount ||
      this.time >= missionData.surviveTime
    ) {
      this.events.emit('mission:complete');
    }
  }
}
