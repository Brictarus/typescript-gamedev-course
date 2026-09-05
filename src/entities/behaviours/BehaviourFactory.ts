import { SeekBehaviour } from './SeekBehaviour.ts';
import type { Behaviour } from './Behaviour.ts';
import { DrifBehaviour } from './DrifBehaviour.ts';

export type BehaviourType = 'seek' | 'drifter';

export class BehaviourFactory {
  static create(behaviourType: BehaviourType): Behaviour {
    switch (behaviourType) {
      case 'drifter':
        return new DrifBehaviour();
      case 'seek':
        return new SeekBehaviour();
    }
  }
}
