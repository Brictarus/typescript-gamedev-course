import type { BehaviourType } from '../entities/behaviours/BehaviourFactory.ts';

export type EnemyData = {
  width: number;
  height: number;
  speed: number;
  health: number;
  damage: number;
  collisionRadius: number;
  behaviourType: BehaviourType;
};

export const enemyData = {
  drifter: {
    width: 48,
    height: 48,
    speed: 80,
    health: 1,
    damage: 1,
    collisionRadius: 24,
    behaviourType: 'seek',
  } satisfies EnemyData,
} as const;
