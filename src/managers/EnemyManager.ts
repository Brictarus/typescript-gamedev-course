import { Enemy, type EnemyUpdateContext } from '../entities/Enemy.ts';
import { enemyData } from '../data/enemyData.ts';
import type { Player } from '../entities/Player.ts';
import { ObjectPooler } from '../utils/ObjectPooler.ts';

export class EnemyManager {
  private readonly pool: ObjectPooler<Enemy, EnemyUpdateContext>;

  constructor() {
    const ENEMY_POOL_SIZE = 10;

    this.pool = new ObjectPooler<Enemy, EnemyUpdateContext>(
      () => new Enemy(enemyData.drifter),
      ENEMY_POOL_SIZE,
    );
  }

  spawn(x: number, y: number): Enemy {
    const enemy = this.pool.retrieve();
    enemy.spawn(x, y);
    return enemy;
  }

  getActiveEnemies(): Enemy[] {
    return this.pool.active;
  }

  update(deltaTime: number, player: Player) {
    this.pool.updateAll(deltaTime, { player });
  }

  reset() {
    this.pool.releaseAll();
  }
}
