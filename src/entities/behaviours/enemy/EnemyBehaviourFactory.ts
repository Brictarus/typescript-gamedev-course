import { SeekBehaviour } from './SeekBehaviour.ts';
import type { EnemyBehaviour } from './EnemyBehaviour.ts';
import { DriftBehaviour } from './DriftBehaviour.ts';

export type BehaviourType = 'seek' | 'drifter';

export class EnemyBehaviourFactory {
  static create(behaviourType: BehaviourType): EnemyBehaviour {
    switch (behaviourType) {
      case 'drifter':
        return new DriftBehaviour();
      case 'seek':
        return new SeekBehaviour();
    }
  }
}
