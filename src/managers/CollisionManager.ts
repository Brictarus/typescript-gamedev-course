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
    if (enemy.isDead()) return;
    if (this.collisionSystem.checkCircleCircle(player, enemy)) {
      const dx = player.centerX() - enemy.centerX();
      const dy = player.centerY() - enemy.centerY();

      const distance = Math.sqrt(dx * dx + dy * dy);
      const nx = distance > 0 ? dx / distance : 1;
      const ny = distance > 0 ? dy / distance : 0;

      const enemyDamageApplied = enemy.takeDamage(player.collisionDamage);
      if (enemyDamageApplied) {
        if (enemy.isDead()) {
          this.events.emit('enemy:died', enemy);
        } else {
          this.events.emit('enemy:damaged', enemy);
          if (enemy.data.pushbackTarget === 'enemy') {
            enemy.applyPushback(-nx, -ny, enemy.data.pushbackForce);
          }
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
        } else if (enemy.data.pushbackTarget === 'player') {
          player.applyPushback(nx, ny, player.pushbackForce);
        }
      }
    }
  }
}
