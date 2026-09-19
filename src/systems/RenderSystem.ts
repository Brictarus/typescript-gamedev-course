import { GAME_HEIGHT, GAME_WIDTH, GRID_SIZE } from '../core/constants.ts';
import type { Player } from '../entities/Player.ts';
import { ImageManager } from '../managers/ImageManager.ts';
import type { GameState } from '../core/Game.ts';
import type { Enemy } from '../entities/Enemy.ts';
import type { Particle } from '../entities/Particle.ts';

const FLASH_MIN_ALPHA = 0.2;
const FLASH_ALPHA_RANGE = 0.8;
const FLASH_SPEED = 10;

const HEALTH_BAR_HEIGHT = 4;
const HEALTH_BAR_OFFSET = 6;
const HEALTH_BAR_BACKGROUND = 'rgba(0, 0, 0, 0.6)';
const HEALTH_BAR_FILL = '#ff5f6d';

export class RenderSystem {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly imageManager: ImageManager;

  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, imageManager: ImageManager) {
    this.imageManager = imageManager;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
  }

  render(
    state: GameState,
    player: Player,
    enemies: Enemy[],
    particles: Particle[],
    debug: boolean,
  ) {
    if (state === 'menu') {
      this.renderMenuBackground();
    } else {
      this.ctx.fillStyle = '#0f3460';
      this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      this.renderGrid();
      this.renderEnemies(enemies);
      this.renderPlayer(player);
      this.renderParticles(particles);
      if (debug) {
        this.renderDebugOverlay(player, enemies);
      }
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
    if (player.invincible) {
      this.ctx.globalAlpha =
        FLASH_MIN_ALPHA +
        FLASH_ALPHA_RANGE *
          Math.abs(Math.sin(player.invincibilityTimer * FLASH_SPEED));
    }

    const frame = player.animator.getCurrentFrame();
    const sheetImage = frame?.sheet ? this.imageManager.get(frame.sheet) : null;

    if (frame && sheetImage) {
      this.ctx.drawImage(
        sheetImage,
        frame.sourceX,
        frame.sourceY,
        frame.sourceWidth,
        frame.sourceHeight,
        player.x,
        player.y,
        player.width,
        player.height,
      );
    } else {
      this.ctx.fillStyle = '#1a1a2e';
      this.ctx.fillRect(player.x, player.y, player.width, player.height);
      this.ctx.strokeStyle = 'white';
      this.ctx.strokeRect(player.x, player.y, player.width, player.height);
    }

    this.ctx.globalAlpha = 1;
  }

  private renderMenuBackground() {
    this.ctx.fillStyle = '#0f3460';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  private renderEnemies(enemies: Enemy[]) {
    enemies.forEach((enemy) => {
      // const enemyImage = this.imageManager.get(enemy.data.image);
      const frame = enemy.animator.getCurrentFrame();
      const sheetImage = frame?.sheet
        ? this.imageManager.get(frame.sheet)
        : null;

      if (enemy.invincible && !enemy.isDead()) {
        this.ctx.globalAlpha =
          FLASH_MIN_ALPHA +
          FLASH_ALPHA_RANGE *
            Math.abs(Math.sin(enemy.invincibilityTimer * FLASH_SPEED));
      }

      if (frame && sheetImage) {
        this.ctx.save();

        if (enemy.facingLeft) {
          this.ctx.translate(enemy.x + enemy.width, enemy.y);
          this.ctx.scale(-1, 1);
          this.ctx.drawImage(
            sheetImage,
            frame.sourceX,
            frame.sourceY,
            frame.sourceWidth,
            frame.sourceHeight,
            0,
            0,
            enemy.width,
            enemy.height,
          );
        } else {
          this.ctx.drawImage(
            sheetImage,
            frame.sourceX,
            frame.sourceY,
            frame.sourceWidth,
            frame.sourceHeight,
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height,
          );
        }

        this.ctx.restore();
      } else {
        this.ctx.fillStyle = enemy.data.color;
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      }
      this.ctx.globalAlpha = 1;

      if (enemy.health < enemy.data.health && !enemy.isDead()) {
        this.renderEnemyHealthBar(enemy);
      }
    });
  }

  private renderEnemyHealthBar(enemy: Enemy) {
    const percent = enemy.health / enemy.data.health;

    const x = enemy.x;
    const y = enemy.y - HEALTH_BAR_OFFSET - HEALTH_BAR_HEIGHT;
    const width = enemy.width;

    this.ctx.fillStyle = HEALTH_BAR_BACKGROUND;
    this.ctx.fillRect(x, y, width, HEALTH_BAR_HEIGHT);
    this.ctx.fillStyle = HEALTH_BAR_FILL;
    this.ctx.fillRect(x, y, Math.ceil(width * percent), HEALTH_BAR_HEIGHT);
  }

  private renderParticles(particles: Particle[]) {
    particles.forEach((particle) => {
      if (!particle.active) return;
      if (particle.fade) {
        this.ctx.globalAlpha = 1 - particle.age / particle.lifetime;
      }
      this.ctx.fillStyle = particle.color;
      this.ctx.fillRect(
        particle.centerX(),
        particle.centerY(),
        particle.size,
        particle.size,
      );
      this.ctx.globalAlpha = 1;
    });
  }

  private renderDebugOverlay(player: Player, enemies: Enemy[]) {
    this.ctx.save();

    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'green';
    this.ctx.beginPath();
    this.ctx.arc(
      player.centerX(),
      player.centerY(),
      player.collisionRadius,
      0,
      Math.PI * 2,
    );
    this.ctx.stroke();

    enemies.forEach((enemy) => {
      if (!enemy.active) return;
      this.ctx.strokeStyle = enemy.data.color;
      this.ctx.beginPath();
      this.ctx.arc(
        enemy.centerX(),
        enemy.centerY(),
        enemy.collisionRadius,
        0,
        Math.PI * 2,
      );
      this.ctx.stroke();
    });

    this.ctx.restore();
  }
}
