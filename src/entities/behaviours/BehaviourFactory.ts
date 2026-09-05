import { SeekBehaviour } from './SeekBehaviour.ts';
import type { Behaviour } from './Behaviour.ts';

export type BehaviourType = 'seek';

export class BehaviourFactory {
  static create(behaviourType: BehaviourType): Behaviour {
    switch (behaviourType) {
      case 'seek':
        return new SeekBehaviour();
    }
  }
}
