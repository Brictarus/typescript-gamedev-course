import { audioData } from '../data/audioData.ts';
import type { GameEventEmitter } from '../core/Events.ts';

type SoundData = {
  audio: HTMLAudioElement;
  loaded: boolean;
  channels: HTMLAudioElement[];
};

const MAX_CHANNELS_PER_SOUND = 4;

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
      this.sounds[name] = { audio, loaded: false, channels: [] };
      audio.onloadeddata = () => {
        this.sounds[name].loaded = true;
        this.sounds[name].channels.push(audio);
        resolve();
      };
      audio.onerror = (e) => {
        console.warn(`[AudioManager] Audio failed: ${name} (will skip)`, e);
        resolve();
      };
      audio.src = path;
    });
  }

  play(name: string) {
    const sound = this.sounds[name];
    if (!sound?.loaded) return;

    let channel = sound.channels.find((c) => c.paused);
    if (!channel) {
      if (sound.channels.length < MAX_CHANNELS_PER_SOUND) {
        channel = sound.audio.cloneNode() as HTMLAudioElement;
        sound.channels.push(channel);
      } else {
        channel = sound.channels.shift() as HTMLAudioElement;
        sound.channels.push(channel!);
      }
    }

    channel.currentTime = 0;
    channel.play().catch((err) => {
      console.warn(`[AudioManager] Could not play ${name}`, err);
    });
  }

  async loadAll(): Promise<void> {
    await Promise.all(
      audioData.map(({ name, path }) =>
        this.load(name, document.baseURI + path),
      ),
    );
  }
}
