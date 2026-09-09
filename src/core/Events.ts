import type { Emitter } from './EventEmitter.ts';
import type { Enemy } from '../entities/Enemy.ts';

export type Events = {
  sound: string;
  'game:start': undefined;
  'game:pause': undefined;
  'game:resume': undefined;
  'game:returnToMenu': undefined;
  'player:damaged': { health: number; maxHealth: number };
  'player:died': undefined;
  'enemy:damaged': Enemy;
  'enemy:died': Enemy;
  'enemy:killCount': number;
  'mission:complete': undefined;
};

export type GameEventEmitter = Emitter<Events>;
