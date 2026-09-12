import { RadialBehaviour } from './RadialBehaviour.ts';
import type { ParticleBehaviour } from './ParticleBehaviour.ts';

export class ParticleBehaviourFactory {
  static create(behaviorType: string): ParticleBehaviour {
    switch (behaviorType) {
      case 'radial':
        return new RadialBehaviour();
      default:
        console.error(`Unknown particle behaviour type: ${behaviorType}`);
        return new RadialBehaviour();
    }
  }
}
