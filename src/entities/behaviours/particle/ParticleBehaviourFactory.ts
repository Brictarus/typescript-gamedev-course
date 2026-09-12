import { RadialBehaviour } from './RadialBehaviour.ts';
import type { ParticleBehaviour } from './ParticleBehaviour.ts';
import { ImplosionBehaviour } from './ImplosionBehaviour.ts';

export class ParticleBehaviourFactory {
  static create(
    behaviorType: string,
    options: { originX: number; originY: number },
  ): ParticleBehaviour {
    switch (behaviorType) {
      case 'radial':
        return new RadialBehaviour();
      case 'implosion':
        return new ImplosionBehaviour(options.originX, options.originY);
      default:
        console.error(`Unknown particle behaviour type: ${behaviorType}`);
        return new RadialBehaviour();
    }
  }
}
