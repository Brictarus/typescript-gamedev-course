export type AnimationData = {
  sheets: [string, ...ReadonlyArray<string>];
  frameWidth: number;
  frameHeight: number;
  initialState: string;
  states: AnimationStates;
};

type AnimationStates = {
  [state: string]: AnimationState;
};

type AnimationState = {
  row: number;
  frameCount: number;
  frameInterval: number;
  startFrame: number;
  loop: boolean;
  locked?: boolean;
  next?: string;
};

export class AnimatorController {
  private sheets: [string, ...ReadonlyArray<string>];
  frameWidth: number;
  frameHeight: number;
  private states: AnimationStates;

  private sheet: string | null;
  private currentName: string | null;
  private currentState: AnimationState | null;
  private currentFrame: number;
  private frameTimer: number;
  finished: boolean;

  #frame: {
    sheet: string | null;
    sourceX: number;
    sourceY: number;
    sourceWidth: number;
    sourceHeight: number;
  };

  constructor(animData: AnimationData) {
    this.sheets = animData.sheets;
    this.frameWidth = animData.frameWidth;
    this.frameHeight = animData.frameHeight;
    this.states = animData.states;

    this.sheet = null;
    this.currentName = null;
    this.currentState = null;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.finished = false;

    this.#frame = {
      sheet: null,
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 0,
      sourceHeight: 0,
    };
    this.pickSheet();
    this.play(animData.initialState);
  }

  pickSheet() {
    this.sheet = this.sheets[Math.floor(Math.random() * this.sheets.length)];
  }

  is(name: string): boolean {
    return this.currentName === name;
  }

  play(name: string, { force } = { force: false }): boolean {
    const state = this.states[name];
    if (!state) {
      console.warn(
        `[Animator] Unknown state "${name}". Valid : ${Object.keys(this.states).join(', ')}`,
      );
      return false;
    }

    const alreadyPlaying = name === this.currentName && !this.finished;
    if (!force && alreadyPlaying) return false;
    if (!force && this.currentState?.locked) return false;

    this.currentName = name;
    this.currentState = state;
    this.currentFrame = state.startFrame;
    this.frameTimer = 0;
    this.finished = false;

    return true;
  }

  update(deltaTime: number) {
    if (!this.currentState || this.finished) return;
    this.frameTimer += deltaTime;
    if (this.frameTimer >= this.currentState.frameInterval) {
      this.frameTimer -= this.currentState.frameInterval;
      this.currentFrame++;
      const lastFrame =
        this.currentState.startFrame + this.currentState.frameCount - 1;
      if (this.currentFrame > lastFrame) {
        if (this.currentState.loop) {
          this.currentFrame = this.currentState.startFrame;
        } else {
          this.currentFrame = lastFrame;
          this.finished = true;
          if (this.currentState.next) {
            this.play(this.currentState.next, { force: true });
          }
        }
      }
    }
  }

  getCurrentFrame() {
    if (!this.currentState) return null;
    this.#frame.sheet = this.sheet;
    this.#frame.sourceX = this.currentFrame * this.frameWidth;
    this.#frame.sourceY = this.currentState.row * this.frameHeight;
    this.#frame.sourceWidth = this.frameWidth;
    this.#frame.sourceHeight = this.frameHeight;

    return this.#frame;
  }

  reset(initialState: string) {
    this.pickSheet();
    this.currentName = null;
    this.currentState = null;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.finished = false;

    this.play(initialState, { force: true });
  }
}
