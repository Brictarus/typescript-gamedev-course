export type EnemyData = {
  width: number;
  height: number;
  speed: number;
  health: number;
  damage: number;
  collisionRadius: number;
};

export const enemyData = {
  drifter: {
    width: 48,
    height: 48,
    speed: 80,
    health: 1,
    damage: 1,
    collisionRadius: 24,
  } satisfies EnemyData,
} as const;
