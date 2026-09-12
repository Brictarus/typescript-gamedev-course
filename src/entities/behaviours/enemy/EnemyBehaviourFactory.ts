import { SeekBehaviour } from './SeekBehaviour.ts';
import type { EnemyBehaviour } from './EnemyBehaviour.ts';
import { DrifBehaviour } from './DrifBehaviour.ts';

export type BehaviourType = 'seek' | 'drifter';

export class EnemyBehaviourFactory {
  static create(behaviourType: BehaviourType): EnemyBehaviour {
    switch (behaviourType) {
      case 'drifter':
        return new DrifBehaviour();
      case 'seek':
        return new SeekBehaviour();
    }
  }
}
