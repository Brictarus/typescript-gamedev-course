import type { EnemyBehaviour } from './EnemyBehaviour.ts';
import type { Enemy } from '../../Enemy.ts';
import type { Player } from '../../Player.ts';

const MOVE_DURATION = 7; // seconds
const IDLE_DURATION_MIN = 2; // seconds
const IDLE_DURATION_MAX = 5; // seconds

export class DrifBehaviour implements EnemyBehaviour {
  private angle: number;
  private phaseTimer: number;
  private phaseDuration: number;
  private idling: boolean;
  private firstMove: boolean;

  constructor() {
    this.angle = 0;
    this.phaseTimer = 0;
    this.phaseDuration = MOVE_DURATION;
    this.idling = false;
    this.firstMove = true;
  }

  update(deltaTime: number, enemy: Enemy, player: Player): void {
    if (this.firstMove) {
      this.firstMove = false;
      this.angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      this.firstMove = false;
    }

    this.phaseTimer += deltaTime;

    if (this.phaseTimer >= this.phaseDuration) {
      this.phaseTimer = 0;
      if (this.idling) {
        this.angle = Math.random() * Math.PI * 2;
        this.phaseDuration = MOVE_DURATION;
      } else {
        this.phaseDuration =
          IDLE_DURATION_MIN +
          Math.random() * (IDLE_DURATION_MAX - IDLE_DURATION_MIN);
      }
      this.idling = !this.idling;
    }

    if (!this.idling) {
      const dx = Math.cos(this.angle);
      const dy = Math.sin(this.angle);

      enemy.x += dx * enemy.speed * deltaTime;
      enemy.y += dy * enemy.speed * deltaTime;
    }
  }

  reset(): void {
    this.angle = Math.random() * Math.PI * 2;
    this.phaseTimer = 0;
    this.phaseDuration = MOVE_DURATION;
    this.idling = false;
  }
}
