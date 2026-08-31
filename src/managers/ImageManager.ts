type ImageData = {
  image: HTMLImageElement;
  loaded: boolean;
};
export class ImageManager {
  private images: { [name: string]: ImageData };

  constructor() {
    this.images = {};
  }

  private load(name: string, path: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      this.images[name] = { image: img, loaded: false };
      img.onload = () => {
        this.images[name].loaded = true;
        resolve();
      };
      img.onerror = (e) => {
        console.warn(`Image load error: ${name} (will use fallback)`, e);
        resolve();
      };
      img.src = path;
    });
  }

  get(name: string): HTMLImageElement | null {
    return this.images[name]?.loaded ? this.images[name].image : null;
  }

  async loadAll(): Promise<void> {
    await Promise.all([this.load('player', '/images/player.png')]);
  }
}
