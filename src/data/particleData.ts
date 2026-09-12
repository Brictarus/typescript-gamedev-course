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
    lifetime: 2.5,
    size: 20,
    fade: false,
    shrink: true,
    gravity: { x: 0, y: 250 },
    behaviourType: 'radial',
  },
  smoke: {
    count: 12,
    color: '#fff',
    speed: 70,
    lifetime: 2.5,
    size: 20,
    fade: true,
    shrink: false,
    gravity: { x: 0, y: -250 },
    behaviourType: 'radial',
  },
};
