import type { Emitter } from './EventEmitter.ts';

export type Events = {
  sound: string;
  'game:start': undefined;
  'game:resume': undefined;
  'game:returnToMenu': undefined;
};

export type GameEventEmitter = Emitter<Events>;
