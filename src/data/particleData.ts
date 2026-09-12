export type ParticleData = {
  count: number;
  color: string;
  speed: number;
  lifetime: number;
  size: number;
  fade: boolean;
  shrink: boolean;
  gravity: { x: number; y: number };
  behaviourType: string;
};

export const particleData: { [key: string]: ParticleData } = {
  sparks: {
    count: 12,
    color: '#fff',
    speed: 100,
    lifetime: 0.5,
    size: 20,
    fade: true,
    shrink: true,
    gravity: { x: 0, y: 0 },
    behaviourType: 'radial',
  },
};
