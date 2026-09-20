import { audioData } from '../data/audioData.ts';
import type { GameEventEmitter } from '../core/Events.ts';

type SoundData = {
  audio: HTMLAudioElement;
  loaded: boolean;
};
export class AudioManager {
  private readonly sounds: { [name: string]: SoundData };
  private readonly events: GameEventEmitter;

  constructor(events: GameEventEmitter) {
    this.events = events;
    this.sounds = {};
    this.registerEvents();
  }

  private registerEvents() {
    this.events.on('sound', (name) => this.play(name));
    this.events.on('enemy:damaged', (enemy) =>
      this.play(enemy.data.sounds.hit),
    );
    this.events.on('enemy:died', (enemy) => this.play(enemy.data.sounds.death));
  }

  private load(name: string, path: string): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio();
      this.sounds[name] = { audio, loaded: false };
      audio.onloadeddata = () => {
        this.sounds[name].loaded = true;
        resolve();
      };
      audio.onerror = (e) => {
        console.warn(`Audio failed: ${name} (will skip)`, e);
        resolve();
      };
      audio.src = path;
    });
  }

  play(name: string) {
    const sound = this.sounds[name]?.loaded ? this.sounds[name] : null;
    if (sound) {
      sound.audio.currentTime = 0;
      sound.audio.play().catch((err) => {
        console.warn(`Could not play ${name}`, err);
      });
    }
  }

  async loadAll(): Promise<void> {
    await Promise.all(
      audioData.map(({ name, path }) =>
        this.load(name, document.baseURI + path),
      ),
    );
  }
}
