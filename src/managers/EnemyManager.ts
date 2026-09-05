import { Enemy, type EnemyUpdateContext } from '../entities/Enemy.ts';
import { enemyData } from '../data/enemyData.ts';
import type { Player } from '../entities/Player.ts';
import { ObjectPooler } from '../utils/ObjectPooler.ts';
import { BehaviourFactory } from '../entities/behaviours/BehaviourFactory.ts';

export class EnemyManager {
  private readonly pools: {
    [enemyType: string]: ObjectPooler<Enemy, EnemyUpdateContext>;
  };

  constructor() {
    this.pools = {};
    const ENEMY_POOL_SIZE = 10;

    for (const type in enemyData) {
      this.pools[type] = new ObjectPooler<Enemy, EnemyUpdateContext>(() => {
        const data = enemyData[type];
        const behaviour = BehaviourFactory.create(data.behaviourType);
        return new Enemy(data, behaviour);
      }, ENEMY_POOL_SIZE);
    }
  }

  spawn(type: string, x: number, y: number): Enemy {
    const pool = this.pools[type];
    if (!pool) {
      console.warn(`Unknown enemy type: ${type}`);
    }
    const enemy = pool.retrieve();
    enemy.spawn(x, y);
    return enemy;
  }

  getActiveEnemies(): Enemy[] {
    const enemies: Enemy[] = [];
    for (const type in this.pools) {
      enemies.push(...this.pools[type].active);
    }

    return enemies;
  }

  update(deltaTime: number, player: Player) {
    const updateContext = { player };
    for (const type in this.pools) {
      this.pools[type].updateAll(deltaTime, updateContext);
    }
  }

  reset() {
    for (const type in this.pools) {
      this.pools[type].releaseAll();
    }
  }
}
