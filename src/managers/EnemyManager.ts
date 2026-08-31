import { Enemy } from '../entities/Enemy.ts';
import { enemyData } from '../data/enemyData.ts';

export class EnemyManager {
  private enemy: Enemy;

  constructor() {
    this.enemy = new Enemy(enemyData.drifter);
  }

  spawn(x: number, y: number) {
    this.enemy.spawn(x, y);
  }

  getActiveEnemies(): Enemy[] {
    return [this.enemy];
  }
}
