import type { EnemyManager } from './EnemyManager.ts';
import {
  ENEMY_SPAWN_INTERVAL,
  ENEMY_SPAWN_MARGIN,
  GAME_HEIGHT,
  GAME_WIDTH,
} from '../core/constants.ts';
import { enemyData } from '../data/enemyData.ts';

const edges = ['top', 'right', 'bottom', 'left'] as const;
type Edge = (typeof edges)[number];

export class EnemySpawner {
  private readonly enemyManager: EnemyManager;
  private spawnTimer: number;
  private spawnInterval: number;
  private enemyTypes: string[];

  constructor(enemyManager: EnemyManager) {
    this.enemyManager = enemyManager;
    this.spawnTimer = 0;
    this.spawnInterval = ENEMY_SPAWN_INTERVAL;

    this.enemyTypes = this.initEnemyTypes();
  }

  private initEnemyTypes() {
    const types: string[] = [];
    for (const type in enemyData) {
      types.push(type);
    }
    return types;
  }

  update(deltaTime: number) {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnWave();
      this.spawnTimer = 0;
    }
  }

  private spawnWave() {
    const type =
      this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
    const edge = this.randomEdge();
    let x, y;
    switch (edge) {
      case 'top':
        x = Math.random() * GAME_WIDTH;
        y = -ENEMY_SPAWN_MARGIN;
        break;
      case 'right':
        x = GAME_WIDTH + ENEMY_SPAWN_MARGIN;
        y = Math.random() * GAME_HEIGHT;
        break;
      case 'bottom':
        x = Math.random() * GAME_WIDTH;
        y = GAME_HEIGHT + ENEMY_SPAWN_MARGIN;
        break;
      case 'left':
        x = -ENEMY_SPAWN_MARGIN;
        y = Math.random() * GAME_HEIGHT;
        break;
    }
    this.enemyManager.spawn(type, x, y);
  }

  private randomEdge(): Edge {
    return edges[Math.floor(Math.random() * 4)];
  }

  reset() {
    this.spawnTimer = 0;
  }
}
