type SoundData = {
  audio: HTMLAudioElement;
  loaded: boolean;
};
export class AudioManager {
  private sounds: { [name: string]: SoundData };

  constructor() {
    this.sounds = {};
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
        console.warn(`Audio load error: ${name} (will skip)`, e);
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
        console.log(`Could not play ${name}`, err);
      });
    }
  }

  async loadAll(): Promise<void> {
    await Promise.all([
      this.load('pause', document.baseURI + '/audio/pause.mp3'),
      this.load('unpause', document.baseURI + '/audio/unpause.mp3'),
      this.load('button_hover', document.baseURI + '/audio/button_hover.mp3'),
      this.load('button_click', document.baseURI + '/audio/button_click.mp3'),
    ]);
  }
}
