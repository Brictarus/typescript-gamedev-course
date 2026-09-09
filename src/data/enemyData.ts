import type { BehaviourType } from '../entities/behaviours/BehaviourFactory.ts';

export type EnemyData = {
  width: number;
  height: number;
  speed: number;
  health: number;
  damage: number;
  collisionRadius: number;
  behaviourType: BehaviourType;
  color: string;
  image: string;
};

export const enemyData: { [type: string]: EnemyData } = {
  drifter: {
    width: 48,
    height: 48,
    speed: 80,
    health: 5,
    damage: 1,
    collisionRadius: 24,
    behaviourType: 'drifter',
    color: '#ff4444',
    image: 'enemy_drifter',
  } satisfies EnemyData,
  seeker: {
    width: 38,
    height: 25,
    speed: 120,
    health: 3,
    damage: 2,
    collisionRadius: 28,
    behaviourType: 'seek',
    color: '#ff8844',
    image: 'enemy_seeker',
  } satisfies EnemyData,
};
