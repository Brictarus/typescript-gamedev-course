import type { CollisionSystem } from '../systems/CollisionSystem.ts';
import type { GameEventEmitter } from '../core/Events.ts';
import type { Enemy } from '../entities/Enemy.ts';
import type { Player } from '../entities/Player.ts';

export class CollisionManager {
  private readonly collisionSystem: CollisionSystem;
  private readonly events: GameEventEmitter;

  constructor(collisionSystem: CollisionSystem, events: GameEventEmitter) {
    this.collisionSystem = collisionSystem;
    this.events = events;
  }

  update(player: Player, enemies: Enemy[]) {
    this.checkPlayerVsEnemies(player, enemies);
  }

  private checkPlayerVsEnemies(player: Player, enemies: Enemy[]) {
    for (const enemy of enemies) {
      if (player.isDead()) {
        return;
      }
      this.checkPlayerVsEnemy(enemy, player);
    }
  }

  private checkPlayerVsEnemy(enemy: Enemy, player: Player) {
    if (!enemy.active) return;
    if (this.collisionSystem.checkCircleCircle(player, enemy)) {
      const enemyDamageApplied = enemy.takeDamage(player.collisionDamage);
      if (enemyDamageApplied) {
        this.events.emit('enemy:damaged', enemy);
        if (enemy.isDead()) {
          enemy.active = false;
          this.events.emit('enemy:died', enemy);
        }
      }
      const playerDamageApplied = player.takeDamage(enemy.damage);
      if (playerDamageApplied) {
        this.events.emit('player:damaged', {
          health: player.health,
          maxHealth: player.maxHealth,
        });
        if (player.isDead()) {
          this.events.emit('player:died');
        }
      }
    }
  }
}
