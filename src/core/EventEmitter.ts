type EventType = string | symbol;
type Handler<T = unknown> = (event: T) => void;
type EventHandlerList<T = unknown> = Handler<T>[];
type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
  keyof Events,
  EventHandlerList<Events[keyof Events]>
>;

export interface Emitter<Events extends Record<EventType, unknown>> {
  on<Key extends keyof Events>(type: Key, listener: Handler<Events[Key]>): void;

  emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
  emit<Key extends keyof Events>(
    type: undefined extends Events[Key] ? Key : never,
  ): void;
}

export class EventEmitter<
  Events extends Record<EventType, unknown>,
> implements Emitter<Events> {
  private readonly all: EventHandlerMap<Events>;

  constructor(all?: EventHandlerMap<Events>) {
    this.all = all ?? new Map();
  }

  on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>) {
    const existingListeners = this.all.get(type);
    if (existingListeners) {
      existingListeners.push(handler as Handler<Events[keyof Events]>);
    } else {
      this.all.set(type, [handler] as EventHandlerList<Events[keyof Events]>);
    }
  }

  emit<Key extends keyof Events>(type: Key, payload?: Events[Key]) {
    const existingListeners = this.all.get(type);
    if (existingListeners) {
      existingListeners.forEach((listener) => listener(payload!));
    }
  }
}
