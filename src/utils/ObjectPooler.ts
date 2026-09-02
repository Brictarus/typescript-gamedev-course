export type PoolableObject<U> = {
  isActive: () => boolean;
  update: (dt: number, context: U) => void;
  reset: () => void;
};

export class ObjectPooler<T extends PoolableObject<U>, U> {
  private factoryFn: () => T;
  private pool: T[];
  readonly #active: T[];

  constructor(factoryFn: () => T, poolSize: number) {
    this.factoryFn = factoryFn;
    this.pool = [];
    this.#active = [];

    for (let i = 0; i < poolSize; i++) {
      this.pool.push(this.factoryFn());
    }
  }

  get active(): T[] {
    return this.#active;
  }

  retrieve(): T {
    let poolableObject: T;
    if (this.pool.length > 0) {
      poolableObject = this.pool.pop()!;
    } else {
      poolableObject = this.factoryFn();
      console.log('[DEV] Pool expanded, created new object');
    }
    this.#active.push(poolableObject);

    return poolableObject;
  }

  updateAll(deltaTime: number, context: U) {
    for (let i = this.#active.length - 1; i >= 0; i--) {
      const poolableObject = this.#active[i];
      poolableObject.update(deltaTime, context);
      if (!poolableObject.isActive()) {
        this.release(poolableObject);
      }
    }
  }

  release(poolableObject: T) {
    const index = this.#active.indexOf(poolableObject);
    if (index > -1) {
      this.#active.splice(index, 1);
      poolableObject.reset();
      this.pool.push(poolableObject);
    }
  }

  releaseAll() {
    for (let i = 0; i < this.#active.length; i++) {
      const obj = this.#active[i];
      obj.reset();
      this.pool.push(obj);
    }
    this.#active.length = 0;
  }
}
