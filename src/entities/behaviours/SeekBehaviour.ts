import type { Enemy } from '../Enemy.ts';
import type { Player } from '../Player.ts';
import type { Behaviour } from './Behaviour.ts';

export class SeekBehaviour implements Behaviour {
  update(deltaTime: number, enemy: Enemy, player: Player) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length > 0) {
      const normalizedDx = dx / length;
      const normalizedDy = dy / length;

      enemy.x += normalizedDx * enemy.speed * deltaTime;
      enemy.y += normalizedDy * enemy.speed * deltaTime;
    }
  }
}
