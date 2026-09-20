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
} & ParticleShape;

type ParticleShape =
  | {
      shape: 'circle' | 'rectangle';
    }
  | {
      shape: 'image';
      image: string;
    };

export const particleData: { [key: string]: ParticleData } = {
  sparks: {
    count: 12,
    color: '#fff',
    speed: 100,
    lifetime: 2.5,
    size: 10,
    fade: false,
    shrink: true,
    gravity: { x: 0, y: 250 },
    behaviourType: 'radial',
    shape: 'rectangle',
  },
  smoke: {
    count: 12,
    color: '#fff',
    speed: 70,
    lifetime: 2.5,
    size: 15,
    fade: true,
    shrink: false,
    gravity: { x: 0, y: -250 },
    behaviourType: 'radial',
    shape: 'circle',
  },
  implosion: {
    count: 40,
    color: '#fff',
    speed: 600,
    lifetime: 2,
    size: 16,
    fade: false,
    shrink: true,
    gravity: { x: 0, y: 0 },
    behaviourType: 'implosion',
    shape: 'image',
    image: 'particle_star',
  },
};
