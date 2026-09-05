import type { Enemy } from '../Enemy.ts';
import type { Player } from '../Player.ts';

export interface Behaviour {
  update(deltaTime: number, enemy: Enemy, player: Player): void;
}
