import type { BehaviourType } from '../entities/behaviours/enemy/EnemyBehaviourFactory.ts';

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
  pushbackForce: number;
  pushbackImmune: boolean;
  sounds: {
    hit: string;
    death: string;
  };
  particles: {
    hit: { type: string; count: number };
    death: { type: string; count: number };
  };
};

export const enemyData: { [type: string]: EnemyData } = {
  drifter: {
    width: 48,
    height: 48,
    speed: 80,
    health: 3,
    damage: 1,
    collisionRadius: 24,
    behaviourType: 'drifter',
    color: '#ff4444',
    image: 'enemy_drifter',
    pushbackForce: 0,
    pushbackImmune: true,

    sounds: {
      hit: 'enemy_drifter_hit',
      death: 'enemy_drifter_death',
    },
    particles: {
      hit: { type: 'smoke', count: 6 },
      death: { type: 'implosion', count: 25 },
    },
  },
  seeker: {
    width: 38,
    height: 25,
    speed: 120,
    health: 2,
    damage: 1,
    collisionRadius: 14,
    behaviourType: 'seek',
    color: '#ff8844',
    image: 'enemy_seeker',
    pushbackForce: 580,
    pushbackImmune: false,

    sounds: {
      hit: 'enemy_seeker_hit',
      death: 'enemy_seeker_death',
    },
    particles: {
      hit: { type: 'sparks', count: 10 },
      death: { type: 'implosion', count: 17 },
    },
  },
};
