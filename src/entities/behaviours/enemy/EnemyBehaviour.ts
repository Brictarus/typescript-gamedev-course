import type { Enemy } from '../../Enemy.ts';
import type { Player } from '../../Player.ts';

export interface EnemyBehaviour {
  update(deltaTime: number, enemy: Enemy, player: Player): void;
  reset?(): void;
}
