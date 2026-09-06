import type { Emitter } from './EventEmitter.ts';
import type { Enemy } from '../entities/Enemy.ts';

export type Events = {
  sound: string;
  'game:start': undefined;
  'game:resume': undefined;
  'game:returnToMenu': undefined;
  'player:damaged': { health: number; maxHealth: number };
  'player:died': undefined;
  'enemy:damaged': { health: number; maxHealth: number };
  'enemy:died': Enemy;
};

export type GameEventEmitter = Emitter<Events>;
